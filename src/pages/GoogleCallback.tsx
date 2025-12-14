import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
const apiBaseUrl = (rawApiBaseUrl ?? "https://api.epictwin.co").replace(/\/$/, "");

const googleExchangeUrl =
  (import.meta.env.VITE_GOOGLE_TOKEN_URL as string | undefined) ??
  `${apiBaseUrl}/v1.0/auth/google/exchange`;

type Status = "loading" | "success" | "error";

const GoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ]);

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Signing you in with Google...");

  useEffect(() => {
    const controller = new AbortController();
    let cleanup: (() => void) | undefined;
    const error = searchParams.get("error");
    const errorDescription =
      searchParams.get("error_description") ?? searchParams.get("message");
    const providedAccessToken =
      searchParams.get("access_token") ?? searchParams.get("token");
    const providedExpiresAt =
      searchParams.get("expires_at") ?? searchParams.get("expiresAt");
    const authorizationCode = searchParams.get("code");
    const next = searchParams.get("next");

    if (error) {
      setStatus("error");
      setMessage(
        errorDescription ??
          "We couldn't sign you in with Google. Please try again in a moment.",
      );
      return () => controller.abort();
    }

    const resolveDestination = () => {
      if (next && next.startsWith("/")) return next;
      return "/";
    };

    const persistCredentials = (accessToken: string, expiresAt: string) => {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("token_expires_at", expiresAt);
    };

    const finalizeSuccess = () => {
      setStatus("success");
      setMessage("Signed in with Google! Redirecting to your dashboard...");

      const timeoutId = window.setTimeout(() => {
        navigate(resolveDestination(), { replace: true });
      }, 1200);

      return () => window.clearTimeout(timeoutId);
    };

    const redirectUri = `${window.location.origin}/auth/google`;

    const exchangeCodeForToken = async () => {
      const response = await fetch(googleExchangeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: authorizationCode, redirect_uri: redirectUri }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const errorMessage =
          (errorBody && typeof errorBody === "object"
            ? (errorBody as { message?: unknown }).message
            : null) ||
          "We couldn't verify your Google sign-in. Please try again.";

        throw new Error(String(errorMessage));
      }

      const responseBody = await response.json().catch(() => null);
      const accessToken =
        responseBody && typeof responseBody === "object"
          ? (responseBody as { access_token?: unknown; token?: unknown })
              .access_token || (responseBody as { token?: unknown }).token
          : undefined;
      const expiresAt =
        responseBody && typeof responseBody === "object"
          ? (responseBody as { expires_at?: unknown; expiresAt?: unknown })
              .expires_at || (responseBody as { expiresAt?: unknown }).expiresAt
          : undefined;

      if (typeof accessToken !== "string") {
        throw new Error(
          "We received an unexpected response. Please try the Google sign-in again.",
        );
      }

      const expiresValue =
        typeof expiresAt === "string" || typeof expiresAt === "number"
          ? String(expiresAt)
          : null;

      if (!expiresValue) {
        throw new Error(
          "We couldn't confirm how long the session lasts. Please sign in again.",
        );
      }

      persistCredentials(accessToken, expiresValue);
    };

    const handleGoogleCallback = async () => {
      try {
        if (providedAccessToken) {
          const expiresValue = providedExpiresAt ?? String(Date.now());

          persistCredentials(providedAccessToken, expiresValue);
          cleanup = finalizeSuccess();
          return;
        }

        if (authorizationCode) {
          await exchangeCodeForToken();
          cleanup = finalizeSuccess();
          return;
        }

        setStatus("error");
        setMessage("This Google sign-in link is missing required information.");
      } catch (err) {
        if (err instanceof Error) {
          setMessage(err.message);
        } else {
          setMessage("Something went wrong while finishing Google sign-in.");
        }
        setStatus("error");
      }
    };

    handleGoogleCallback();

    return () => {
      controller.abort();
      if (cleanup) cleanup();
    };
  }, [navigate, searchParams]);

  const statusIcon: Record<Status, JSX.Element> = {
    loading: <Loader2 className="h-10 w-10 text-primary animate-spin" />,
    success: <CheckCircle2 className="h-10 w-10 text-green-500" />,
    error: <AlertCircle className="h-10 w-10 text-destructive" />,
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-card rounded-lg shadow-card border border-border p-8 space-y-6 text-center">
        <div className="flex justify-center">{statusIcon[status]}</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            {status === "loading" && "Completing Google sign-in"}
            {status === "success" && "You're all set"}
            {status === "error" && "Unable to sign in with Google"}
          </h1>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        {status === "error" && (
          <button
            className="text-sm text-primary font-medium hover:underline"
            onClick={() => navigate("/login")}
            type="button"
          >
            Return to login
          </button>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
