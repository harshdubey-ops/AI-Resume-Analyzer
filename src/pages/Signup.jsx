import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
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
        alert(data.message || "Signup failed");
        return;
      }

      alert("Account created successfully");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10 bg-[#050816]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-4">

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 font-bold shadow-lg shadow-purple-500/20">
              AI
            </div>

            <h1 className="font-bold">
              Resume<span className="text-cyan-400">AI</span>
            </h1>
          </button>

        </div>
      </nav>

      {/* Signup */}
      <main className="relative z-10 flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8 text-center">

            <div className="mb-4 inline-flex rounded-full border border-purple-400/20 bg-purple-400/10 px-4 py-1.5 text-xs font-medium text-purple-300">
              GET STARTED
            </div>

            <h2 className="text-4xl font-bold tracking-tight">
              Create Your{" "}
              <span className="text-cyan-400">Account</span>
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Start analyzing your resume with AI.
            </p>

          </div>

          {/* Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-xl">

            <form onSubmit={handleSignup} className="space-y-5">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none placeholder:text-gray-600 transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none placeholder:text-gray-600 transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none placeholder:text-gray-600 transition focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/10"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 py-3.5 font-semibold text-black shadow-lg shadow-purple-500/10 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account →"}
              </button>

            </form>

            {/* Login */}
            <div className="mt-7 border-t border-white/10 pt-6 text-center">

              <p className="text-sm text-gray-500">
                Already have an account?
              </p>

              <button
                onClick={() => navigate("/login")}
                className="mt-2 font-medium text-cyan-400 transition hover:text-cyan-300"
              >
                Sign in →
              </button>

            </div>

          </div>

          {/* Security */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-600">
            <span>🔒</span>
            Your information is securely protected
          </div>

        </div>
      </main>
    </div>
  );
}

export default Signup;