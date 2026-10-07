import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import UploadResume from "./pages/UploadResume";
import Analysis from "./pages/Analysis";
import ResumeHistory from "./pages/ResumeHistory";
import JobMatch from "./pages/JobMatch";
import JobMatchHistory from "./pages/JobMatchHistory";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";

function Home() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden">

      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px]" />
        <div className="absolute top-[300px] right-[-150px] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[140px]" />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/20">
              AI
            </div>

            <div>
              <h1 className="font-bold text-lg">
                AI Resume Analyzer
              </h1>
              <p className="text-xs text-slate-400">
                Resume Intelligence Platform
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm">
            {user && (
              <>
                <button
                  onClick={() => navigate("/history")}
                  className="text-slate-300 hover:text-white transition"
                >
                  Resume History
                </button>

                <button
                  onClick={() => navigate("/job-match-history")}
                  className="text-slate-300 hover:text-white transition"
                >
                  Job Matches
                </button>

                <span className="text-slate-500">|</span>

                <span className="text-blue-400 font-medium">
                  {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition"
                >
                  Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-slate-300 hover:text-white"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm mb-7">
              <span>✦</span>
              AI-Powered Resume Intelligence
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">
              Turn Your Resume
              <br />
              Into Your
              <br />

              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Career Advantage
              </span>
            </h1>

            <p className="mt-7 text-lg text-slate-400 max-w-xl leading-relaxed">
              Analyze your resume with AI, discover skill gaps,
              improve your ATS score and understand how well your
              resume matches real job opportunities.
            </p>

            <div className="flex flex-wrap gap-4 mt-9">

              <button
                onClick={() => navigate("/upload")}
                className="px-7 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-semibold shadow-xl shadow-blue-600/20 hover:scale-[1.03] transition"
              >
                Analyze My Resume →
              </button>

              <button
                onClick={() => navigate("/job-match")}
                className="px-7 py-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition font-semibold"
              >
                Match With Job
              </button>

            </div>

            <div className="flex flex-wrap gap-6 mt-7 text-sm text-slate-400">
              <span>✓ AI Analysis</span>
              <span>✓ ATS Score</span>
              <span>✓ Skill Gap Detection</span>
            </div>

          </div>

          {/* RIGHT AI DASHBOARD */}
          <div className="relative">

            <div className="absolute -inset-5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />

            <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-6 shadow-2xl">

              <div className="flex justify-between items-center mb-7">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Resume Intelligence
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    AI Analysis
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl">
                  ✦
                </div>
              </div>

              {/* ATS SCORE */}
              <div className="rounded-2xl bg-[#080d20] border border-white/10 p-6">

                <div className="flex justify-between items-end">

                  <div>
                    <p className="text-sm text-slate-400">
                      ATS Compatibility
                    </p>

                    <p className="text-5xl font-black text-blue-400 mt-2">
                      82%
                    </p>
                  </div>

                  <div className="w-20 h-20 rounded-full border-8 border-blue-500/20 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border-4 border-blue-400 flex items-center justify-center text-xs font-bold">
                      GOOD
                    </div>
                  </div>

                </div>

                <div className="mt-5 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full w-[82%] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                </div>

              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-4 mt-4">

                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-slate-400">
                    Strengths
                  </p>

                  <p className="text-2xl font-bold text-emerald-400 mt-2">
                    ✓ AI Insight
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                  <p className="text-xs text-slate-400">
                    Skill Gaps
                  </p>

                  <p className="text-3xl font-bold text-orange-400 mt-2">
                    4
                  </p>
                </div>

              </div>

              {/* AI FEEDBACK */}
              <div className="mt-4 p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20">

                <p className="text-xs text-purple-300 uppercase tracking-wider">
                  AI Feedback
                </p>

                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Improve your frontend skills and highlight
                  relevant projects to increase job compatibility.
                </p>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        <div className="text-center mb-12">

          <p className="text-blue-400 text-sm font-semibold tracking-widest">
            POWERFUL FEATURES
          </p>

          <h2 className="text-4xl md:text-5xl font-black mt-3">
            Everything You Need
          </h2>

          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            One intelligent platform to analyze, improve and
            optimize your resume for your next opportunity.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* CARD 1 */}
          <div className="group p-7 rounded-3xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-blue-500/30 transition">

            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl mb-6">
              📄
            </div>

            <h3 className="text-xl font-bold">
              AI Resume Analysis
            </h3>

            <p className="text-slate-400 mt-3 leading-relaxed">
              Get ATS score, skills, strengths, weaknesses,
              missing skills and personalized AI feedback.
            </p>

            <button
              onClick={() => navigate("/upload")}
              className="mt-6 text-blue-400 text-sm font-semibold"
            >
              Analyze Resume →
            </button>

          </div>

          {/* CARD 2 */}
          <div className="group p-7 rounded-3xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-purple-500/30 transition">

            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl mb-6">
              🎯
            </div>

            <h3 className="text-xl font-bold">
              Job Matching
            </h3>

            <p className="text-slate-400 mt-3 leading-relaxed">
              Compare your resume against job descriptions
              and identify matching and missing skills.
            </p>

            <button
              onClick={() => navigate("/job-match")}
              className="mt-6 text-purple-400 text-sm font-semibold"
            >
              Match With Job →
            </button>

          </div>

          {/* CARD 3 */}
          <div className="group p-7 rounded-3xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-cyan-500/30 transition">

            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl mb-6">
              💡
            </div>

            <h3 className="text-xl font-bold">
              Smart Recommendations
            </h3>

            <p className="text-slate-400 mt-3 leading-relaxed">
              Receive practical recommendations to make your
              resume stronger and more job-ready.
            </p>

            <button
              onClick={() => navigate("/history")}
              className="mt-6 text-cyan-400 text-sm font-semibold"
            >
              View History →
            </button>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">

        <div className="relative overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-500/20 p-10 md:p-16 text-center">

          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />

          <div className="relative">

            <p className="text-blue-300 text-sm font-semibold tracking-widest">
              START YOUR JOURNEY
            </p>

            <h2 className="text-4xl md:text-5xl font-black mt-3">
              Ready to Make Your Resume Better?
            </h2>

            <p className="text-slate-300 mt-5 max-w-2xl mx-auto">
              Upload your resume and let AI show you exactly
              where you can improve.
            </p>

            <button
              onClick={() => navigate("/upload")}
              className="mt-8 px-8 py-4 rounded-xl bg-white text-slate-900 font-bold hover:scale-105 transition shadow-xl"
            >
              Start Analyzing →
            </button>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">

          <div>
            <p className="font-semibold">
              AI Resume Analyzer
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Intelligent resume analysis powered by AI
            </p>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 AI Resume Analyzer
          </p>

        </div>

      </footer>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadResume />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <Analysis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <ResumeHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job-match"
          element={
            <ProtectedRoute>
              <JobMatch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job-match-history"
          element={
            <ProtectedRoute>
              <JobMatchHistory />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;