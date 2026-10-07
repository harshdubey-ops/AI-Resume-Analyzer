import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Alert,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Modal,
  ProgressBar,
  SkillBadge,
  Spinner,
} from "../components/ui";
import { IconSpark } from "../components/icons";

function JobMatchHistory() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const response = await fetch("http://localhost:5000/job-matches", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load job match history.");
          return;
        }

        setMatches(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching job matches:", err);
        setError("Unable to load job match history.");
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  useEffect(() => {
    if (!selectedMatch) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedMatch(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedMatch]);

  const deleteMatch = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/job-matches/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete");
        return;
      }

      setMatches((prev) => prev.filter((match) => match._id !== id));

      if (selectedMatch?._id === id) {
        setSelectedMatch(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete job match");
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070d] text-slate-100">
      <Navbar />

      <main id="main" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge tone="violet">Your analysis history</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Job match history
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
              Review previous resume-to-job comparisons, matching skills, missing skills and recommendations.
            </p>
          </div>
          <Button variant="secondary" onClick={() => navigate("/job-match")}>
            New job match
          </Button>
        </div>

        {error && (loading || matches.length > 0) && (
          <div className="mb-6">
            <Alert>{error}</Alert>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Spinner className="h-6 w-6" />
            <span className="ml-3 text-sm">Loading matches...</span>
          </div>
        ) : error && matches.length === 0 ? (
          <EmptyState
            icon={<IconSpark />}
            title="Unable to load job match history"
            description={error}
            action={
              <Button variant="secondary" onClick={() => navigate(0)}>
                Try again
              </Button>
            }
          />
        ) : matches.length === 0 ? (
          <EmptyState
            icon={<IconSpark />}
            title="No job matches yet"
            description="Analyze your resume against a job description to see your results here."
            action={<Button onClick={() => navigate("/job-match")}>Analyze a job</Button>}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <Card
                key={match._id}
                className="p-5 transition duration-200 hover:-translate-y-0.5 hover:border-white/15"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Resume used</p>
                    <h2 className="mt-1 truncate font-semibold text-white">{match.resumeFileName}</h2>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-sky-300">
                    {match.matchScore}%
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs text-slate-400">
                    <span>Job match score</span>
                    <span>{match.matchScore}/100</span>
                  </div>
                  <ProgressBar value={match.matchScore} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-emerald-400/15 bg-emerald-400/5 p-3">
                    <p className="text-[11px] text-slate-500">Matching skills</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-300">
                      {match.matchingSkills?.length || 0}
                    </p>
                  </div>
                  <div className="rounded-lg border border-rose-400/15 bg-rose-400/5 p-3">
                    <p className="text-[11px] text-slate-500">Missing skills</p>
                    <p className="mt-1 text-lg font-semibold text-rose-300">
                      {match.missingSkills?.length || 0}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                  {match.createdAt
                    ? new Date(match.createdAt).toLocaleDateString()
                    : "Recent analysis"}
                </p>

                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" className="flex-1" onClick={() => setSelectedMatch(match)}>
                    View details
                  </Button>
                  <Button variant="danger" onClick={() => setPendingDelete(match)}>
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {selectedMatch && (
        <Modal
          subtitle="Job match details"
          title={selectedMatch.resumeFileName}
          onClose={() => setSelectedMatch(null)}
        >
          <div className="rounded-xl border border-sky-400/15 bg-sky-400/5 p-5">
            <p className="text-sm text-slate-400">Match score</p>
            <p className="mt-1 text-4xl font-semibold text-sky-300">{selectedMatch.matchScore}%</p>
            <ProgressBar value={selectedMatch.matchScore} className="mt-3" />
          </div>

          <div className="mt-6">
            <h3 className="mb-3 font-semibold text-emerald-300">Matching skills</h3>
            <div className="flex flex-wrap gap-2">
              {selectedMatch.matchingSkills?.length ? (
                selectedMatch.matchingSkills.map((skill, index) => (
                  <SkillBadge key={index} tone="emerald">
                    {skill}
                  </SkillBadge>
                ))
              ) : (
                <p className="text-sm text-slate-500">None listed.</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 font-semibold text-rose-300">Missing skills</h3>
            <div className="flex flex-wrap gap-2">
              {selectedMatch.missingSkills?.length ? (
                selectedMatch.missingSkills.map((skill, index) => (
                  <SkillBadge key={index} tone="rose">
                    {skill}
                  </SkillBadge>
                ))
              ) : (
                <p className="text-sm text-slate-500">None listed.</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 font-semibold text-violet-300">AI recommendations</h3>
            <div className="space-y-3">
              {selectedMatch.recommendations?.length ? (
                selectedMatch.recommendations.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300"
                  >
                    <span className="mr-2 text-violet-300">{index + 1}.</span>
                    {item}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No recommendations available.</p>
              )}
            </div>
          </div>
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this job match?"
          description={`This will remove the match for “${pendingDelete.resumeFileName}” from your history.`}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => deleteMatch(pendingDelete._id)}
        />
      )}
    </div>
  );
}

export default JobMatchHistory;
