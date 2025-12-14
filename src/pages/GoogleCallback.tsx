import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
const apiBaseUrl = (rawApiBaseUrl ?? "https://api.epictwin.co").replace(/\/$/, "");

type Status = "loading" | "success" | "error";

type TokenResponse = {
  access_token: string;
  expires_at: string | number;
};

const GoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ]);

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Signing you in with Google...");

  useEffect(() => {
    const credential = searchParams.get("credential");

    if (!credential) {
      setStatus("error");
      setMessage("Missing Google credential. Please try signing in again.");
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const authenticate = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/v1.0/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credential }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          const errorMessage =
            errorBody?.message ?? "Unable to complete Google sign-in.";
          throw new Error(errorMessage);
        }

        const data = (await response.json().catch(() => null)) as
          | TokenResponse
          | null;

        const accessToken = data?.access_token;
        const expiresAt = data?.expires_at;
        const isValidExpiresAt =
          typeof expiresAt === "string" || typeof expiresAt === "number";

        if (typeof accessToken !== "string" || !isValidExpiresAt) {
          throw new Error(
            "Received an unexpected response. Please try signing in again.",
          );
        }

        if (!isMounted || controller.signal.aborted) return;

        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("token_expires_at", String(expiresAt));

        setStatus("success");
        setMessage("Google sign-in successful! Redirecting to your dashboard...");

        setTimeout(() => {
          if (isMounted) {
            navigate("/", { replace: true });
          }
        }, 1500);
      } catch (error) {
        if (!isMounted || controller.signal.aborted) return;

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Something went wrong while completing Google sign-in.";

        setStatus("error");
        setMessage(errorMessage);
      }
    };

    authenticate();

    return () => {
      isMounted = false;
      controller.abort();
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
