import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
  /\/$/,
  ""
);

type Status = "loading" | "success" | "error";

const MagicConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ]);

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Confirming your magic link...");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("error");
      setMessage("This magic link is missing required information.");
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const confirm = async () => {
      try {
        const response = await fetch(`${apiBaseUrl ?? ""}/v1.0/signin/confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, email }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          const errorMessage =
            errorBody?.message ??
            "We couldn't confirm your magic link. Please request a new one.";
          throw new Error(errorMessage);
        }

        const responseBody = await response.json().catch(() => null);
        const accessToken =
          responseBody && typeof responseBody === "object"
            ? (responseBody as { access_token?: unknown }).access_token
            : undefined;
        const expiresAt =
          responseBody && typeof responseBody === "object"
            ? (responseBody as { expires_at?: unknown }).expires_at
            : undefined;

        const isValidExpiresAt =
          typeof expiresAt === "string" || typeof expiresAt === "number";

        if (typeof accessToken !== "string" || !isValidExpiresAt) {
          throw new Error(
            "We received an unexpected response. Please request a new magic link.",
          );
        }

        if (!isMounted || controller.signal.aborted) return;

        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("token_expires_at", String(expiresAt));

        setStatus("success");
        setMessage("Magic link confirmed! Redirecting to your dashboard...");

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
            : "Something went wrong while confirming your magic link.";

        setStatus("error");
        setMessage(errorMessage);
      }
    };

    confirm();

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
            {status === "loading" && "Confirming your sign-in"}
            {status === "success" && "You're all set"}
            {status === "error" && "Unable to confirm link"}
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

export default MagicConfirm;
