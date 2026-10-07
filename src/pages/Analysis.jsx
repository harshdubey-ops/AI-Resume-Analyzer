import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Badge, Button, Card, ScoreRing, SectionHeader, SkillBadge } from "../components/ui";
import { IconFile } from "../components/icons";

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

  const scoreTone = atsScore >= 80 ? "emerald" : atsScore >= 60 ? "amber" : "rose";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070d] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[-150px] top-[-150px] h-[450px] w-[450px] rounded-full bg-sky-600/10 blur-[130px]" />
        <div className="absolute right-[-150px] top-[350px] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[150px]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main id="main" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <Badge tone="emerald">Analysis complete</Badge>
            <span className="text-sm text-slate-500">Step 2 of 3</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Your resume analysis
          </h1>
          <p className="mt-2 text-slate-400">AI-powered insights to help improve your resume.</p>

          <Card className="mt-6 flex max-w-xl items-center gap-4 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sky-300">
              <IconFile />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-slate-500">Analyzed resume</p>
              <p className="mt-0.5 truncate font-semibold text-white">{fileName}</p>
            </div>
            <Badge tone="emerald" className="ml-auto shrink-0">
              Analyzed
            </Badge>
          </Card>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">ATS compatibility</p>
                <Badge tone="sky">AI score</Badge>
              </div>
              <div className="mt-6 flex items-center gap-5">
                <ScoreRing score={atsScore} size={112} label={`ATS score ${atsScore} out of 100`} />
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      scoreTone === "emerald"
                        ? "text-emerald-300"
                        : scoreTone === "amber"
                        ? "text-amber-300"
                        : "text-rose-300"
                    }`}
                  >
                    {scoreMessage}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">Score out of 100. Higher means better ATS readability and keyword coverage.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-slate-400">Skills found</p>
              <p className="mt-6 text-4xl font-semibold text-white">{skills.length}</p>
              <p className="mt-2 text-sm text-slate-500">Technical and professional skills</p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-slate-400">Improvements</p>
              <p className="mt-6 text-4xl font-semibold text-white">{weaknesses.length}</p>
              <p className="mt-2 text-sm text-slate-500">Areas that can be improved</p>
            </Card>
          </div>

          <Card className="mt-6 p-6 sm:p-7">
            <SectionHeader
              eyebrow="Skills"
              title="Skills detected"
              action={<Badge>{skills.length} skills</Badge>}
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <SkillBadge key={index} tone="sky">
                    {skill}
                  </SkillBadge>
                ))
              ) : (
                <p className="text-slate-500">No skills detected.</p>
              )}
            </div>
          </Card>

          <Card className="mt-6 p-6 sm:p-7">
            <SectionHeader
              eyebrow="Skill gap"
              title="Missing skills"
              description="Skills that could strengthen your resume."
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {missingSkills.length > 0 ? (
                missingSkills.map((skill, index) => (
                  <SkillBadge key={index} tone="rose">
                    {skill}
                  </SkillBadge>
                ))
              ) : (
                <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                  No major missing skills identified.
                </div>
              )}
            </div>
          </Card>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card className="p-6 sm:p-7">
              <SectionHeader eyebrow="Positive signals" title="Strengths" />
              <div className="mt-6 space-y-3">
                {strengths.length > 0 ? (
                  strengths.map((item, index) => (
                    <div key={index} className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] p-4 text-sm leading-6 text-slate-300">
                      {item}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No strengths identified.</p>
                )}
              </div>
            </Card>

            <Card className="p-6 sm:p-7">
              <SectionHeader eyebrow="Areas to improve" title="Improvements" />
              <div className="mt-6 space-y-3">
                {weaknesses.length > 0 ? (
                  weaknesses.map((item, index) => (
                    <div key={index} className="rounded-xl border border-amber-400/15 bg-amber-400/[0.06] p-4 text-sm leading-6 text-slate-300">
                      {item}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No major improvements identified.</p>
                )}
              </div>
            </Card>
          </div>

          <Card className="mt-6 p-6 sm:p-7">
            <SectionHeader eyebrow="AI recommendations" title="Smart suggestions" />
            <div className="mt-6 space-y-3">
              {suggestions.length > 0 ? (
                suggestions.map((item, index) => (
                  <div key={index} className="flex gap-3 rounded-xl border border-white/8 bg-[#080d18] p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sky-500/10 text-xs font-semibold text-sky-300">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-slate-300">{item}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No suggestions available.</p>
              )}
            </div>
          </Card>

          <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <Button variant="secondary" onClick={() => navigate("/history")}>
              Resume history
            </Button>
            <Button onClick={() => navigate("/job-match")}>Match with a job</Button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Analysis;
