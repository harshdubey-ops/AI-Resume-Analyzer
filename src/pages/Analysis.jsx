import { useLocation, useNavigate } from "react-router-dom";

function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();

  const analysis = location.state?.analysis || {};
  const fileName = location.state?.fileName || "Resume";

  const atsScore = analysis.atsScore || 0;
  const skills = analysis.skills || [];
  const strengths = analysis.strengths || [];
  const weaknesses = analysis.weaknesses || [];
  const missingSkills = analysis.missingSkills || [];
  const suggestions = analysis.suggestions || [];

  const scoreMessage =
    atsScore >= 80
      ? "Excellent compatibility"
      : atsScore >= 60
      ? "Good compatibility"
      : "Needs improvement";

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 font-bold shadow-lg shadow-blue-500/20">
              AI
            </div>

            <div>
              <p className="font-bold">
                AI Resume Analyzer
              </p>

              <p className="text-xs text-slate-500">
                Resume Intelligence Platform
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">

            <button
              onClick={() => navigate("/")}
              className="rounded-lg px-4 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              Home
            </button>

            <button
              onClick={() => navigate("/history")}
              className="rounded-lg px-4 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              Resume History
            </button>

            <button
              onClick={() => navigate("/job-match")}
              className="rounded-lg bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-500/20"
            >
              Job Match
            </button>

          </div>

        </div>
      </nav>

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-150px] top-[-150px] h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[130px]" />

        <div className="absolute right-[-150px] top-[350px] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[150px]" />
      </div>

      {/* MAIN */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12">

        {/* HEADER */}
        <div className="mb-10">

          <div className="flex flex-wrap items-center gap-3">

            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
              ✓ ANALYSIS COMPLETE
            </span>

            <span className="text-sm text-slate-500">
              Step 2 of 3
            </span>

          </div>

          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
            Your Resume{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Analysis
            </span>
          </h1>

          <p className="mt-3 text-slate-400">
            AI-powered insights to help improve your resume.
          </p>

          {/* FILE */}
          <div className="mt-6 flex max-w-xl items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
              📄
            </div>

            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Analyzed Resume
              </p>

              <p className="mt-1 truncate font-semibold text-white">
                {fileName}
              </p>
            </div>

            <div className="ml-auto rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              Analyzed
            </div>

          </div>

        </div>

        {/* SUMMARY CARDS */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* ATS */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">

            <div className="absolute right-[-40px] top-[-40px] h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                ATS Compatibility
              </p>

              <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                AI Score
              </span>

            </div>

            <div className="mt-7 flex items-center gap-6">

              <div
                className="flex h-28 w-28 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#3b82f6 ${
                    atsScore * 3.6
                  }deg, #1e293b 0deg)`,
                }}
              >
                <div className="flex h-23 w-23 items-center justify-center rounded-full bg-[#080d20]">

                  <span className="text-3xl font-black text-blue-400">
                    {atsScore}
                  </span>

                </div>
              </div>

              <div>

                <p
                  className={`text-sm font-bold ${
                    atsScore >= 80
                      ? "text-emerald-400"
                      : atsScore >= 60
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {scoreMessage}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Score out of 100
                </p>

              </div>

            </div>

          </div>

          {/* SKILLS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                Skills Found
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                ⚡
              </div>

            </div>

            <p className="mt-6 text-5xl font-black text-white">
              {skills.length}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Technical and professional skills
            </p>

          </div>

          {/* IMPROVEMENTS */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                Improvements
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                📈
              </div>

            </div>

            <p className="mt-6 text-5xl font-black text-white">
              {weaknesses.length}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Areas that can be improved
            </p>

          </div>

        </div>

        {/* SKILLS */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>

              <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                Skills
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Skills Detected
              </h2>

            </div>

            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
              {skills.length} Skills
            </span>

          </div>

          <div className="mt-7 flex flex-wrap gap-3">

            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20"
                >
                  ✓ {skill}
                </span>
              ))
            ) : (
              <p className="text-slate-500">
                No skills detected.
              </p>
            )}

          </div>

        </section>

        {/* MISSING SKILLS */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">

          <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
            Skill Gap
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Missing Skills
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Skills that could strengthen your resume.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">

            {missingSkills.length > 0 ? (
              missingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300"
                >
                  + {skill}
                </span>
              ))
            ) : (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm font-medium text-emerald-400">
                ✓ No major missing skills identified.
              </div>
            )}

          </div>

        </section>

        {/* STRENGTHS + WEAKNESSES */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* STRENGTHS */}
          <section className="rounded-3xl border border-emerald-500/10 bg-white/[0.04] p-7 backdrop-blur-xl">

            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Positive Signals
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Strengths
            </h2>

            <div className="mt-7 space-y-3">

              {strengths.length > 0 ? (
                strengths.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.06] p-4"
                  >

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      ✓
                    </div>

                    <p className="text-sm leading-6 text-slate-300">
                      {item}
                    </p>

                  </div>
                ))
              ) : (
                <p className="text-slate-500">
                  No strengths identified.
                </p>
              )}

            </div>

          </section>

          {/* WEAKNESSES */}
          <section className="rounded-3xl border border-orange-500/10 bg-white/[0.04] p-7 backdrop-blur-xl">

            <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
              Areas to Improve
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Improvements
            </h2>

            <div className="mt-7 space-y-3">

              {weaknesses.length > 0 ? (
                weaknesses.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 rounded-2xl border border-orange-500/10 bg-orange-500/[0.06] p-4"
                  >

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                      !
                    </div>

                    <p className="text-sm leading-6 text-slate-300">
                      {item}
                    </p>

                  </div>
                ))
              ) : (
                <p className="text-slate-500">
                  No major improvements identified.
                </p>
              )}

            </div>

          </section>

        </div>

        {/* AI SUGGESTIONS */}
        <section className="mt-8 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.08] to-blue-500/[0.05] p-7">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 font-bold shadow-lg shadow-blue-500/20">
              AI
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-widest text-purple-400">
                AI Recommendations
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Smart Suggestions
              </h2>

            </div>

          </div>

          <div className="mt-7 space-y-3">

            {suggestions.length > 0 ? (
              suggestions.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                >

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-bold text-blue-400">
                    {index + 1}
                  </div>

                  <p className="text-sm leading-6 text-slate-300">
                    {item}
                  </p>

                </div>
              ))
            ) : (
              <p className="text-slate-500">
                No suggestions available.
              </p>
            )}

          </div>

        </section>

        {/* ACTIONS */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <button
            onClick={() => navigate("/history")}
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            ← Resume History
          </button>

          <button
            onClick={() => navigate("/job-match")}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold shadow-lg shadow-blue-600/20 transition hover:scale-[1.02]"
          >
            Match With Job →
          </button>

        </div>

      </main>

    </div>
  );
}

export default Analysis;