import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ResumeHistory() {
  const [resumes, setResumes] = useState([]);
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

  const deleteResume = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/resumes/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete resume");
        return;
      }

      setResumes((prev) =>
        prev.filter((resume) => resume._id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete resume");
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 font-bold shadow-lg shadow-purple-500/20">
              AI
            </div>

            <div>
              <h1 className="font-bold">
                Resume<span className="text-cyan-400">AI</span>
              </h1>
              <p className="text-xs text-gray-500">
                Resume History
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/upload")}
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-105"
          >
            + Analyze Resume
          </button>

        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-10">
          <div className="mb-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-medium text-cyan-300">
            YOUR RESUMES
          </div>

          <h2 className="text-4xl font-bold tracking-tight">
            Resume <span className="text-cyan-400">History</span>
          </h2>

          <p className="mt-3 max-w-2xl text-gray-400">
            View your previous resume analyses and track how your resume
            improves over time.
          </p>
        </div>

        {/* Empty State */}
        {resumes.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center backdrop-blur-xl">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 text-2xl">
              📄
            </div>

            <h3 className="text-xl font-semibold">
              No resumes analyzed yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Upload your resume and let AI analyze your skills,
              ATS score and improvement areas.
            </p>

            <button
              onClick={() => navigate("/upload")}
              className="mt-6 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 px-6 py-3 font-semibold text-black"
            >
              Analyze Your Resume
            </button>

          </div>
        ) : (

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {resumes.map((resume) => {

              const score = resume.analysis?.atsScore ?? 0;

              return (
                <div
                  key={resume._id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.06]"
                >

                  {/* Glow */}
                  <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

                  <div className="relative">

                    {/* Header */}
                    <div className="mb-6 flex items-start justify-between">

                      <div className="min-w-0">
                        <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">
                          Resume
                        </p>

                        <h3 className="truncate font-semibold text-gray-200">
                          {resume.fileName}
                        </h3>
                      </div>

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20">
                        <span className="text-lg font-bold text-cyan-300">
                          {score}
                        </span>
                      </div>

                    </div>

                    {/* ATS Score */}
                    <div className="mb-6">

                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-gray-500">
                          ATS Score
                        </span>

                        <span className="text-gray-300">
                          {score}/100
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                          style={{
                            width: `${Math.min(score, 100)}%`,
                          }}
                        />
                      </div>

                    </div>

                    {/* Stats */}
                    <div className="mb-5 grid grid-cols-3 gap-2">

                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                        <p className="text-lg font-bold text-cyan-300">
                          {resume.analysis?.skills?.length || 0}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          Skills
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                        <p className="text-lg font-bold text-emerald-300">
                          {resume.analysis?.strengths?.length || 0}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          Strengths
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                        <p className="text-lg font-bold text-red-300">
                          {resume.analysis?.missingSkills?.length || 0}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          Missing
                        </p>
                      </div>

                    </div>

                    {/* Date */}
                    <p className="mb-5 text-xs text-gray-600">
                      {resume.createdAt
                        ? new Date(
                            resume.createdAt
                          ).toLocaleDateString()
                        : "Recent analysis"}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">

                      <button
                        onClick={() =>
                          navigate("/analysis", {
                            state: {
                              analysis: resume.analysis,
                              fileName: resume.fileName,
                            },
                          })
                        }
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium transition hover:bg-white/10"
                      >
                        View Analysis
                      </button>

                      <button
                        onClick={() =>
                          deleteResume(resume._id)
                        }
                        className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-2.5 text-sm text-red-300 transition hover:bg-red-400/10"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </main>
    </div>
  );
}

export default ResumeHistory;