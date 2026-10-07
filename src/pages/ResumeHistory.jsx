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
  ProgressBar,
  Spinner,
} from "../components/ui";
import { IconFile } from "../components/icons";

function ResumeHistory() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const response = await fetch("http://localhost:5000/resumes", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load resume history.");
          return;
        }

        setResumes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching resumes:", err);
        setError("Unable to load resume history.");
      } finally {
        setLoading(false);
      }
    };

    loadResumes();
  }, []);

  const deleteResume = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/resumes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete resume");
        return;
      }

      setResumes((prev) => prev.filter((resume) => resume._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete resume");
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
            <Badge>Your resumes</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Resume history
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
              View previous analyses and track how your resume improves over time.
            </p>
          </div>
          <Button onClick={() => navigate("/upload")}>Analyze resume</Button>
        </div>

        {error && (loading || resumes.length > 0) && (
          <div className="mb-6">
            <Alert>{error}</Alert>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Spinner className="h-6 w-6" />
            <span className="ml-3 text-sm">Loading history...</span>
          </div>
        ) : error && resumes.length === 0 ? (
          <EmptyState
            icon={<IconFile />}
            title="Unable to load resume history"
            description={error}
            action={
              <Button variant="secondary" onClick={() => navigate(0)}>
                Try again
              </Button>
            }
          />
        ) : resumes.length === 0 ? (
          <EmptyState
            icon={<IconFile />}
            title="No resumes analyzed yet"
            description="Upload your resume and let AI analyze your skills, ATS score and improvement areas."
            action={<Button onClick={() => navigate("/upload")}>Analyze your resume</Button>}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => {
              const score = resume.analysis?.atsScore ?? 0;

              return (
                <Card
                  key={resume._id}
                  className="p-5 transition duration-200 hover:-translate-y-0.5 hover:border-white/15"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-slate-500">Resume</p>
                      <h2 className="mt-1 truncate font-semibold text-white">{resume.fileName}</h2>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-sky-300">
                      {score}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs text-slate-400">
                      <span>ATS score</span>
                      <span>{score}/100</span>
                    </div>
                    <ProgressBar value={score} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-white/8 bg-white/[0.03] p-3 text-center">
                      <p className="text-lg font-semibold text-sky-300">
                        {resume.analysis?.skills?.length || 0}
                      </p>
                      <p className="text-[11px] text-slate-500">Skills</p>
                    </div>
                    <div className="rounded-lg border border-white/8 bg-white/[0.03] p-3 text-center">
                      <p className="text-lg font-semibold text-rose-300">
                        {resume.analysis?.missingSkills?.length || 0}
                      </p>
                      <p className="text-[11px] text-slate-500">Missing skills</p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    {resume.createdAt
                      ? new Date(resume.createdAt).toLocaleDateString()
                      : "Recent analysis"}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() =>
                        navigate("/analysis", {
                          state: {
                            analysis: resume.analysis,
                            fileName: resume.fileName,
                          },
                        })
                      }
                    >
                      View analysis
                    </Button>
                    <Button variant="danger" onClick={() => setPendingDelete(resume)}>
                      Delete
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this resume?"
          description={`This will remove “${pendingDelete.fileName}” and its analysis from your history.`}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => deleteResume(pendingDelete._id)}
        />
      )}
    </div>
  );
}

export default ResumeHistory;
