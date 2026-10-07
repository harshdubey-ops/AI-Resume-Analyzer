import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Alert, Button, Card, Field, Input, Spinner } from "../components/ui";
import { IconEye, IconEyeOff, IconLock } from "../components/icons";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      setSuccess("Account created successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 700);
    } catch (err) {
      console.error("Signup error:", err);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070d] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/4 top-8 h-72 w-72 rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute bottom-8 right-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Navbar variant="minimal" />

        <main id="main" className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md items-center px-4 py-12 sm:px-6">
          <div className="w-full animate-slide-up">
            <div className="mb-7 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                Get started
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Create your account</h1>
              <p className="mt-2 text-sm text-slate-400">Start analyzing your resume with AI.</p>
            </div>

            <Card className="p-6 sm:p-7">
              <form onSubmit={handleSignup} className="space-y-4">
                {error && <Alert>{error}</Alert>}
                {success && <Alert tone="emerald">{success}</Alert>}

                <Field id="name" label="Full name">
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>

                <Field id="email" label="Email address">
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>

                <Field id="password" label="Password">
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-12"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 hover:text-white"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>

                <Button type="submit" className="h-11 w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              <div className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-semibold text-sky-300 hover:text-sky-200"
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </button>
              </div>
            </Card>

            <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
              <IconLock className="h-3.5 w-3.5" />
              Your information is securely protected
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Signup;
