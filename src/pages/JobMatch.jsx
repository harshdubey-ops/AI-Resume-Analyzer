import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function JobMatch() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/resumes", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setResumes(data);
      })
      .catch((error) => {
        console.error("Error fetching resumes:", error);
      });
  }, []);

  const handleAnalyze = async () => {
    if (!selectedResume) {
      alert("Please select a resume first");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter a job description first");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/job-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          resumeId: selectedResume,
          jobDescription: jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        alert(data.message || "Something went wrong");
        return;
      }

      setMatchResult(data.analysis);
      setLoading(false);

      console.log("Job Match Response:", data);
    } catch (error) {
      console.error("Job match error:", error);
      setLoading(false);
      alert("Failed to analyze job match. Please try again.");
    }
  };

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

          <div className="flex gap-2">

            <button
              onClick={() => navigate("/history")}
              className="hidden rounded-lg px-4 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white md:block"
            >
              Resume History
            </button>

            <button
              onClick={() => navigate("/job-match-history")}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Match History
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
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-14">

        {/* HEADER */}
        <div className="text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-400">
            <span>✦</span>
            STEP 3 OF 3
          </div>

          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Match Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Resume
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-slate-400">
            Paste a job description and let AI compare it with
            your resume to identify your strengths and skill gaps.
          </p>

        </div>

        {/* MAIN CARD */}
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-xl md:p-8">

          <div className="absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

          {/* SELECT RESUME */}
          <div className="relative">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                📄
              </div>

              <div>
                <h2 className="font-bold">
                  Select Resume
                </h2>

                <p className="text-sm text-slate-500">
                  Choose the resume you want to match.
                </p>
              </div>

            </div>

            <select
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              className="mt-5 w-full rounded-xl border border-white/10 bg-[#080d20] p-4 text-sm text-slate-300 outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
            >
              <option value="">
                Select a resume
              </option>

              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.fileName}
                </option>
              ))}
            </select>

          </div>

          {/* JOB DESCRIPTION */}
          <div className="relative mt-9">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                  💼
                </div>

                <div>
                  <h2 className="font-bold">
                    Job Description
                  </h2>

                  <p className="text-sm text-slate-500">
                    Paste the job description you want to apply for.
                  </p>
                </div>

              </div>

              <span className="text-xs text-slate-500">
                {jobDescription.length} characters
              </span>

            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Example: We are looking for a Java Backend Developer with experience in Spring Boot, REST APIs, SQL, MongoDB..."
              className="mt-5 h-64 w-full resize-none rounded-2xl border border-white/10 bg-[#080d20] p-5 text-sm leading-6 text-slate-300 outline-none transition placeholder:text-slate-600 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10"
            />

            <p className="mt-3 text-xs text-slate-500">
              Include responsibilities, required skills and qualifications.
            </p>

          </div>

          {/* ANALYZE BUTTON */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="relative mt-7 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 font-bold shadow-lg shadow-blue-600/20 transition hover:scale-[1.01] hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Analyzing Job Match..."
              : "Analyze Job Match →"}
          </button>

          {/* HISTORY */}
          <button
            onClick={() => navigate("/job-match-history")}
            className="relative mt-3 w-full rounded-xl border border-white/10 bg-white/5 py-3 font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            View Job Match History
          </button>

        </div>

        {/* MATCH RESULT */}
        {matchResult && (
          <div className="mt-10 space-y-6">

            {/* SCORE */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                    AI Analysis
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Resume Match Score
                  </h2>
                </div>

                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
                  AI Match
                </span>

              </div>

              <div className="mt-8 flex flex-col items-center gap-7 md:flex-row">

                <div
                  className="flex h-32 w-32 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#3b82f6 ${
                      matchResult.matchScore * 3.6
                    }deg, #1e293b 0deg)`,
                  }}
                >
                  <div className="flex h-27 w-27 items-center justify-center rounded-full bg-[#080d20]">

                    <span className="text-3xl font-black text-blue-400">
                      {matchResult.matchScore}%
                    </span>

                  </div>
                </div>

                <div className="text-center md:text-left">

                  <p className="text-xl font-bold">
                    Resume Match
                  </p>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Based on the skills and requirements found
                    in your resume and the provided job description.
                  </p>

                </div>

              </div>

            </section>

            {/* MATCHING + MISSING */}
            <div className="grid gap-6 md:grid-cols-2">

              {/* MATCHING */}
              <section className="rounded-3xl border border-emerald-500/10 bg-white/[0.04] p-7">

                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                  Strong Match
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Matching Skills
                </h2>

                <div className="mt-6 flex flex-wrap gap-3">

                  {matchResult.matchingSkills?.length > 0 ? (
                    matchResult.matchingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-300"
                      >
                        ✓ {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No matching skills found.
                    </p>
                  )}

                </div>

              </section>

              {/* MISSING */}
              <section className="rounded-3xl border border-red-500/10 bg-white/[0.04] p-7">

                <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
                  Skill Gap
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Missing Skills
                </h2>

                <div className="mt-6 flex flex-wrap gap-3">

                  {matchResult.missingSkills?.length > 0 ? (
                    matchResult.missingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300"
                      >
                        + {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-emerald-400">
                      ✓ No major skill gaps found.
                    </p>
                  )}

                </div>

              </section>

            </div>

            {/* RECOMMENDATIONS */}
            <section className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.08] to-blue-500/[0.05] p-7">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 font-bold shadow-lg shadow-blue-500/20">
                  AI
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-widest text-purple-400">
                    AI Recommendations
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    How to Improve Your Match
                  </h2>

                </div>

              </div>

              <div className="mt-7 space-y-3">

                {matchResult.recommendations?.length > 0 ? (
                  matchResult.recommendations.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                    >

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-sm font-bold text-purple-400">
                        {index + 1}
                      </div>

                      <p className="text-sm leading-6 text-slate-300">
                        {item}
                      </p>

                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No recommendations available.
                  </p>
                )}

              </div>

            </section>

          </div>
        )}

        {/* FEATURES */}
        <section className="mt-16">

          <div className="text-center">

            <p className="text-sm font-semibold tracking-widest text-blue-400">
              AI JOB ANALYSIS
            </p>

            <h2 className="mt-2 text-3xl font-black">
              What We'll Analyze
            </h2>

          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-blue-500/30 hover:bg-white/[0.06]">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
                🎯
              </div>

              <h3 className="mt-5 font-bold">
                Match Score
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                See how closely your resume matches the job.
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-emerald-500/30 hover:bg-white/[0.06]">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-2xl">
                ⚡
              </div>

              <h3 className="mt-5 font-bold">
                Matching Skills
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Identify skills that match the job requirements.
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-red-500/30 hover:bg-white/[0.06]">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-2xl">
                📈
              </div>

              <h3 className="mt-5 font-bold">
                Skill Gaps
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Find skills you may need to improve or learn.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default JobMatch;