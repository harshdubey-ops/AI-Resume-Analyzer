import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Alert,
  Badge,
  Button,
  Card,
  Field,
  ScoreRing,
  SectionHeader,
  Select,
  SkillBadge,
  Spinner,
  Textarea,
} from "../components/ui";

function JobMatch() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumes, setResumes] = useState([]);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
          setError(data.message || "Unable to load resumes.");
          return;
        }

        setResumes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching resumes:", err);
        setError("Unable to load resumes.");
      } finally {
        setResumeLoading(false);
      }
    };

    loadResumes();
  }, []);

  const handleAnalyze = async () => {
    setError("");

    if (!selectedResume) {
      setError("Please select a resume first");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter a job description first");
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
        setError(data.message || "Something went wrong");
        return;
      }

      setMatchResult(data.analysis);
      setLoading(false);

      console.log("Job Match Response:", data);
    } catch (err) {
      console.error("Job match error:", err);
      setLoading(false);
      setError("Failed to analyze job match. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070d] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[-150px] top-[-150px] h-[450px] w-[450px] rounded-full bg-sky-600/10 blur-[130px]" />
        <div className="absolute right-[-150px] top-[350px] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[150px]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main id="main" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="text-center">
            <Badge tone="violet">Step 3 of 3</Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Match your resume
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
              Paste a job description and compare it with a saved resume to see matching skills and gaps.
            </p>
          </div>

          <Card className="mt-10 p-5 sm:p-7">
            {error && (
              <div className="mb-5">
                <Alert>{error}</Alert>
              </div>
            )}

            <Field id="resume" label="Select resume">
              <Select
                id="resume"
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
                disabled={resumeLoading || resumes.length === 0}
              >
                <option value="">
                  {resumeLoading
                    ? "Loading resumes..."
                    : error
                    ? "Unable to load resumes"
                    : resumes.length
                    ? "Select a resume"
                    : "No resumes available"}
                </option>
                {resumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.fileName}
                  </option>
                ))}
              </Select>
              {!resumeLoading && !error && resumes.length === 0 && (
                <p className="mt-2 text-sm text-slate-400">
                  Upload a resume before matching it to a job.{" "}
                  <button
                    type="button"
                    className="font-medium text-sky-300 underline decoration-sky-300/40 underline-offset-4 hover:text-sky-200"
                    onClick={() => navigate("/upload")}
                  >
                    Upload resume
                  </button>
                </p>
              )}
            </Field>

            <div className="mt-6">
              <div className="mb-2 flex items-end justify-between gap-3">
                <label htmlFor="jobDescription" className="text-sm font-medium text-slate-200">
                  Job description
                </label>
                <span className="text-xs text-slate-500">{jobDescription.length} characters</span>
              </div>
              <Textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Example: We are looking for a Java Backend Developer with experience in Spring Boot, REST APIs, SQL, MongoDB..."
                className="h-56 sm:h-64"
              />
              <p className="mt-2 text-xs text-slate-500">
                Include responsibilities, required skills and qualifications.
              </p>
            </div>

            <Button className="mt-6 h-12 w-full" onClick={handleAnalyze} disabled={loading}>
              {loading ? (
                <>
                  <Spinner />
                  Analyzing job match...
                </>
              ) : (
                "Analyze job match"
              )}
            </Button>

            <Button
              variant="secondary"
              className="mt-3 h-11 w-full"
              onClick={() => navigate("/job-match-history")}
            >
              View job match history
            </Button>
          </Card>

          {matchResult && (
            <div className="mt-8 space-y-4 animate-slide-up">
              <Card className="p-6 sm:p-7">
                <SectionHeader
                  eyebrow="AI analysis"
                  title="Resume match score"
                  action={<Badge>AI match</Badge>}
                />
                <div className="mt-7 flex flex-col items-center gap-6 sm:flex-row">
                  <ScoreRing
                    score={matchResult.matchScore}
                    size={128}
                    label={`Match score ${matchResult.matchScore} percent`}
                  />
                  <div className="text-center sm:text-left">
                    <p className="text-xl font-semibold text-white">
                      {matchResult.matchScore}% match
                    </p>
                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                      Based on the skills and requirements found in your resume and the provided job description.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    Matching skills
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Matching skills</h2>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {matchResult.matchingSkills?.length > 0 ? (
                      matchResult.matchingSkills.map((skill, index) => (
                        <SkillBadge key={index} tone="emerald">
                          {skill}
                        </SkillBadge>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No matching skills found.</p>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-300">
                    Missing skills
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Missing skills</h2>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {matchResult.missingSkills?.length > 0 ? (
                      matchResult.missingSkills.map((skill, index) => (
                        <SkillBadge key={index} tone="rose">
                          {skill}
                        </SkillBadge>
                      ))
                    ) : (
                      <p className="text-sm text-emerald-300">No major skill gaps found.</p>
                    )}
                  </div>
                </Card>
              </div>

              <Card className="p-6 sm:p-7">
                <SectionHeader eyebrow="AI recommendations" title="How to improve your match" />
                <div className="mt-6 space-y-3">
                  {matchResult.recommendations?.length > 0 ? (
                    matchResult.recommendations.map((item, index) => (
                      <div key={index} className="flex gap-3 rounded-xl border border-white/8 bg-[#080d18] p-4">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-violet-500/10 text-xs font-semibold text-violet-300">
                          {index + 1}
                        </span>
                        <p className="text-sm leading-6 text-slate-300">{item}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No recommendations available.</p>
                  )}
                </div>
              </Card>
            </div>
          )}

          <section className="mt-14">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">
              AI job analysis
            </p>
            <h2 className="mt-2 text-center text-2xl font-semibold text-white">What we&apos;ll analyze</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { title: "Match score", body: "See how closely your resume matches the job." },
                { title: "Matching skills", body: "Identify skills that overlap with the requirements." },
                { title: "Skill gaps", body: "Find skills you may need to improve or learn." },
              ].map((item) => (
                <Card key={item.title} className="p-5">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default JobMatch;
