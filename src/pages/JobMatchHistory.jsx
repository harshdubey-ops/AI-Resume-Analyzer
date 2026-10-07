import { useEffect, useState } from "react";

function JobMatchHistory() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/job-matches", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMatches(data);
      })
      .catch((error) => {
        console.error("Error fetching job matches:", error);
      });
  }, []);

  const deleteMatch = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job match?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/job-matches/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete");
        return;
      }

      setMatches((prev) => prev.filter((match) => match._id !== id));

      if (selectedMatch?._id === id) {
        setSelectedMatch(null);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete job match");
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 text-lg font-bold shadow-lg shadow-purple-500/20">
              AI
            </div>

            <div>
              <h1 className="font-bold tracking-wide">
                Resume<span className="text-cyan-400">AI</span>
              </h1>
              <p className="text-xs text-gray-500">
                Job Match History
              </p>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = "/job-match")}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition hover:bg-white/10"
          >
            ← New Job Match
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        
        <div className="mb-10">
          <div className="mb-3 inline-flex rounded-full border border-purple-400/20 bg-purple-400/10 px-4 py-1.5 text-xs font-medium text-purple-300">
            YOUR ANALYSIS HISTORY
          </div>

          <h2 className="text-4xl font-bold tracking-tight">
            Job Match <span className="text-cyan-400">History</span>
          </h2>

          <p className="mt-3 max-w-2xl text-gray-400">
            Review your previous resume-to-job comparisons and track your
            matching skills, missing skills and AI recommendations.
          </p>
        </div>

        {/* Empty State */}
        {matches.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 text-2xl">
              ✦
            </div>

            <h3 className="text-xl font-semibold">
              No job matches yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Analyze your resume against a job description to see your
              results here.
            </p>

            <button
              onClick={() => (window.location.href = "/job-match")}
              className="mt-6 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 px-6 py-3 font-semibold text-black"
            >
              Analyze a Job
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <div
                key={match._id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.06]"
              >
                {/* Glow */}
                <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />

                <div className="relative">
                  {/* Header */}
                  <div className="mb-5 flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">
                        Resume
                      </p>

                      <h3 className="truncate font-semibold text-gray-200">
                        {match.resumeFileName}
                      </h3>
                    </div>

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20">
                      <span className="text-xl font-bold text-cyan-300">
                        {match.matchScore}%
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="mb-5">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-gray-500">
                        Job Compatibility
                      </span>
                      <span className="text-gray-300">
                        {match.matchScore}/100
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                        style={{
                          width: `${match.matchScore}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-3">
                      <p className="text-xs text-gray-500">
                        Matching
                      </p>
                      <p className="mt-1 text-lg font-bold text-emerald-300">
                        {match.matchingSkills?.length || 0}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-red-400/10 bg-red-400/5 p-3">
                      <p className="text-xs text-gray-500">
                        Missing
                      </p>
                      <p className="mt-1 text-lg font-bold text-red-300">
                        {match.missingSkills?.length || 0}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <p className="mb-5 text-xs text-gray-600">
                    {match.createdAt
                      ? new Date(match.createdAt).toLocaleDateString()
                      : "Recent analysis"}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedMatch(match)}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium transition hover:bg-white/10"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => deleteMatch(match._id)}
                      className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-2.5 text-sm text-red-300 transition hover:bg-red-400/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Details Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1020] p-7 shadow-2xl">
            
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-cyan-400">
                  Job Match Details
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {selectedMatch.resumeFileName}
                </h2>
              </div>

              <button
                onClick={() => setSelectedMatch(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-gray-400 hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Score */}
            <div className="mb-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5">
              <p className="text-sm text-gray-400">
                Match Score
              </p>

              <div className="mt-2 text-5xl font-bold text-cyan-300">
                {selectedMatch.matchScore}%
              </div>
            </div>

            {/* Matching Skills */}
            <div className="mb-6">
              <h3 className="mb-3 font-semibold text-emerald-300">
                Matching Skills
              </h3>

              <div className="flex flex-wrap gap-2">
                {selectedMatch.matchingSkills?.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="mb-6">
              <h3 className="mb-3 font-semibold text-red-300">
                Missing Skills
              </h3>

              <div className="flex flex-wrap gap-2">
                {selectedMatch.missingSkills?.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-sm text-red-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="mb-3 font-semibold text-purple-300">
                AI Recommendations
              </h3>

              <div className="space-y-3">
                {selectedMatch.recommendations?.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-gray-300"
                  >
                    <span className="mr-2 text-purple-400">
                      {index + 1}.
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedMatch(null)}
              className="mt-7 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 py-3 font-semibold text-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobMatchHistory;