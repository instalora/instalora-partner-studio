import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
const apiBaseUrl = (rawApiBaseUrl ?? "https://api.epictwin.co").replace(
  /\/$/,
  "",
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const isValidEmail = /.+@.+\..+/.test(email);

  const googleAuthUrl = useMemo(() => {
    try {
      if (typeof window === "undefined") return null;

      const redirectUri = `${window.location.origin}/auth/google`;
      const baseUrl =
        (import.meta.env.VITE_GOOGLE_AUTH_URL as string | undefined) ??
        `${apiBaseUrl}/v1.0/auth/google`;

      const url = new URL(baseUrl);

      if (!url.searchParams.has("redirect_uri")) {
        url.searchParams.set("redirect_uri", redirectUri);
      }

      return url.toString();
    } catch (error) {
      console.error("Failed to build Google auth URL", error);
      return null;
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidEmail || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${apiBaseUrl}/v1.0/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const errorMessage =
          errorBody?.message ?? "Unable to send the magic link. Please try again.";
        throw new Error(errorMessage);
      }

      toast({
        title: "Check your inbox",
        description: "We've sent a magic link to your email address.",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while sending the magic link.";

      toast({
        title: "Magic link request failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (isRedirecting || !googleAuthUrl) {
      if (!googleAuthUrl) {
        toast({
          title: "Google sign-in unavailable",
          description: "We couldn't start the Google sign-in flow. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    setIsRedirecting(true);
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-card border border-border p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold">Sign in to your account</h1>
            <p className="text-sm text-muted-foreground">
              Use your email to receive a secure magic link
            </p>
          </div>

          <form className="space-y-2" onSubmit={handleSubmit}>
            <label className="text-sm font-medium" htmlFor="email">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="h-11"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={email.length > 0 && !isValidEmail}
              disabled={isSubmitting}
              required
            />
            <Button
              type="submit"
              className="w-full h-11"
              disabled={!isValidEmail || isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Magic Link"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-11"
            onClick={handleGoogleSignIn}
            disabled={isRedirecting}
          >
            <svg
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="#4285F4"
                d="M22.32 12.258c0-.638-.057-1.252-.163-1.84H12v3.48h5.77c-.249 1.34-1.004 2.476-2.14 3.237v2.69h3.46c2.027-1.86 3.23-4.61 3.23-7.567z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.94 0 5.405-.98 7.207-2.675l-3.46-2.69c-.96.64-2.187 1.02-3.747 1.02-2.883 0-5.32-1.947-6.19-4.56H2.21v2.77C4 20.982 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.81 14.095c-.22-.64-.35-1.32-.35-2.02s.13-1.38.35-2.02V7.285H2.21A10.01 10.01 0 0 0 2 12.075c0 1.62.39 3.15 1.09 4.79l2.72-2.77z"
              />
              <path
                fill="#EA4335"
                d="M12 6.04c1.6 0 3.04.55 4.17 1.63l3.12-3.12C17.4 2.82 14.94 1.78 12 1.78 7.7 1.78 4 3.8 2.21 7.285l3.6 2.77C6.68 7.99 9.12 6.04 12 6.04z"
              />
            </svg>
            {isRedirecting ? "Redirecting..." : "Continue with Google"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By continuing, you agree to our {" "}
            <Link to="/terms" className="underline font-medium">
              Terms of Service
            </Link>{" "}
            and {" "}
            <Link to="/privacy" className="underline font-medium">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
