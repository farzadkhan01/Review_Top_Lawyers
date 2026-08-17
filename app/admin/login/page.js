/** @format */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";
import { getCurrentAdmin, login } from "@/lib/admin/auth";
import { cn } from "@/lib/utils";

const FIELD_CLASSES =
  "w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600";

function validate(values) {
  const errors = {};
  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.password) {
    errors.password = "Please enter your password.";
  }
  return errors;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("checking");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    let isMounted = true;
    getCurrentAdmin().then((current) => {
      if (!isMounted) return;
      if (current) {
        router.replace("/admin/dashboard");
        return;
      }
      setStatus("idle");
    });
    return () => {
      isMounted = false;
    };
  }, [router]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    setServerError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    setServerError("");

    try {
      await login(values);
      router.replace("/admin/dashboard");
    } catch (err) {
      setStatus("idle");
      setServerError(err.message || "Unable to sign in. Please try again.");
    }
  }

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950">
        <p className="text-sm text-cream-100/70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-lg font-bold text-navy-950">
            RL
          </span>
          <div>
            <h1 className="font-heading text-2xl font-semibold text-cream-50">Admin Portal</h1>
            <p className="mt-1 text-sm text-cream-100/70">Sign in to manage Review Top Lawyers.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5 rounded-lg bg-white p-6 shadow-xl sm:p-8"
        >
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-navy-900">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="username"
              value={values.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              className={cn(FIELD_CLASSES, errors.email ? "border-red-400" : "border-navy-900/15 focus:border-navy-900/40")}
            />
            {errors.email && (
              <p id="login-email-error" role="alert" className="mt-1.5 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="login-password" className="block text-sm font-medium text-navy-900">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert("Password reset is not available in this preview.")}
                className="rounded text-xs font-medium text-navy-600 hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "login-password-error" : undefined}
                className={cn(
                  FIELD_CLASSES,
                  "pr-11",
                  errors.password ? "border-red-400" : "border-navy-900/15 focus:border-navy-900/40"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-400 hover:text-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p id="login-password-error" role="alert" className="mt-1.5 text-sm text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-600">
            <input
              type="checkbox"
              name="remember"
              checked={values.remember}
              onChange={handleChange}
              className="h-4 w-4 rounded border-navy-900/25 text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
            />
            Remember me
          </label>

          {serverError && (
            <p role="alert" className="rounded-md bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
              {serverError}
            </p>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={status === "submitting"}>
            {status === "submitting" ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-center text-xs text-muted-400">
            Demo credentials: admin@reviewtoplawyers.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
