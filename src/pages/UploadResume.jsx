import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UploadResume() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* Navbar */}
      <nav className="border-b border-white/10 bg-[#050816]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 font-bold shadow-lg shadow-blue-500/20">
              AI
            </div>

            <div>
              <p className="font-bold">AI Resume Analyzer</p>
              <p className="text-xs text-slate-500">
                Resume Intelligence Platform
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            ← Back
          </button>

        </div>
      </nav>

      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-150px] top-[-150px] h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute right-[-150px] top-[300px] h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-[140px]" />
      </div>

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-16">

        {/* Heading */}
        <div className="text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            <span>✦</span>
            STEP 1 OF 3
          </div>

          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Upload Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Resume
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-slate-400">
            Upload your resume and let our AI analyze your skills,
            experience, ATS compatibility and improvement areas.
          </p>

        </div>

        {/* Upload Card */}
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl md:p-8">

          <div className="absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          {/* Drop Area */}
          <div className="relative rounded-3xl border-2 border-dashed border-blue-500/30 bg-gradient-to-b from-blue-500/[0.08] to-purple-500/[0.04] px-6 py-16 text-center transition hover:border-blue-400/50">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-4xl shadow-lg shadow-blue-500/10">
              📄
            </div>

            <h2 className="mt-7 text-2xl font-bold">
              Drop your resume here
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              or choose a file from your computer
            </p>

            <label className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3.5 font-semibold shadow-lg shadow-blue-600/20 transition hover:scale-[1.03]">
              Choose Resume
              <span>↑</span>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </label>

            {/* Selected File */}
            {selectedFile && (
              <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-left">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  ✓
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-emerald-400">
                    Resume selected
                  </p>

                  <p className="truncate text-sm font-medium text-white">
                    {selectedFile.name}
                  </p>
                </div>

              </div>
            )}

            <p className="mt-5 text-xs text-slate-500">
              PDF, DOC, DOCX • Maximum size: 10 MB
            </p>

          </div>

          {/* Privacy */}
          <div className="mt-6 flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-lg">
              🔒
            </div>

            <div>
              <p className="text-sm font-semibold">
                Your resume is secure
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your uploaded resume is used only for analysis.
                Your data is handled securely.
              </p>
            </div>

          </div>

          {/* Analyze Button */}
          <button
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 font-bold shadow-lg shadow-blue-600/20 transition hover:scale-[1.01] hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
            onClick={async () => {

              if (!selectedFile) {
                alert("Please select a resume first");
                return;
              }

              try {
                setLoading(true);

                const formData = new FormData();
                formData.append("resume", selectedFile);

                const response = await fetch(
                  "http://localhost:5000/upload",
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: formData,
                  }
                );

                const data = await response.json();

                if (!response.ok) {
                  setLoading(false);
                  alert(data.message || "Something went wrong");
                  return;
                }

                console.log("AI Analysis:", data.analysis);

                navigate("/analysis", {
                  state: {
                    analysis: data.analysis,
                    fileName: data.fileName,
                  },
                });

              } catch (error) {
                console.error("Upload error:", error);
                setLoading(false);
                alert("Failed to analyze resume");
              }
            }}
          >
            {loading ? "Analyzing Resume..." : "Analyze My Resume →"}
          </button>

        </div>

        {/* What AI Analyzes */}
        <div className="mt-16">

          <div className="text-center">
            <p className="text-sm font-semibold tracking-widest text-blue-400">
              AI ANALYSIS
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
                ATS Score
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Check how well your resume performs with
                Applicant Tracking Systems.
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-purple-500/30 hover:bg-white/[0.06]">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-2xl">
                💡
              </div>

              <h3 className="mt-5 font-bold">
                Skills Detection
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Identify your technical and professional
                skills from your resume.
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-cyan-500/30 hover:bg-white/[0.06]">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl">
                📈
              </div>

              <h3 className="mt-5 font-bold">
                AI Improvements
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Get personalized AI suggestions to improve
                your resume.
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default UploadResume;