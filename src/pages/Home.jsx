import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Badge, Button, Card } from "../components/ui";
import { IconArrowRight, IconCheck, IconFile, IconLock, IconShield, IconSpark } from "../components/icons";

function Home() {
  const navigate = useNavigate();
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const goAnalyze = () => navigate(user ? "/upload" : "/signup");
  const goMatch = () => navigate(user ? "/job-match" : "/signup");

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070d] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[-200px] top-[-160px] h-[480px] w-[480px] rounded-full bg-sky-500/[0.09] blur-[130px]" />
        <div className="absolute right-[-180px] top-[280px] h-[420px] w-[420px] rounded-full bg-indigo-500/[0.08] blur-[130px]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main id="main">
          <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:pt-20">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="animate-slide-up">
                <Badge>
                  <IconSpark className="h-3.5 w-3.5" />
                  AI-powered career intelligence
                </Badge>

                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
                  Analyze your resume.
                  <br />
                  Improve your ATS score.
                  <br />
                  <span className="bg-gradient-to-r from-sky-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                    Match with the right jobs.
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                  ResumeAI reviews your resume like a recruiter and an ATS: skills, gaps,
                  strengths, and job-fit — so you know exactly what to improve.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button className="h-12 px-6" onClick={goAnalyze}>
                    Analyze my resume
                    <IconArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" className="h-12 px-6" onClick={goMatch}>
                    Match with a job
                  </Button>
                </div>

                <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
                  {["ATS scoring", "Skill-gap detection", "Job matching"].map((item) => (
                    <li key={item} className="inline-flex items-center gap-2">
                      <IconCheck className="h-4 w-4 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="animate-slide-up delay-2 relative">
                <div className="absolute -inset-6 rounded-3xl bg-sky-500/10 blur-3xl" aria-hidden="true" />
                <Card className="relative p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Your workspace
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">A clearer view of your resume</p>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/10 text-sky-300">
                      <IconFile />
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#080d18] p-4 sm:p-5">
                    <div className="flex items-center gap-3 border-b border-white/[0.07] pb-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-slate-300">
                        <IconSpark className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">AI resume analysis</p>
                        <p className="mt-0.5 text-xs text-slate-500">Insights grounded in your resume</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {[
                        ["01", "ATS compatibility", "Score and readability"],
                        ["02", "Skills & gaps", "Strengths and missing skills"],
                        ["03", "Next steps", "Recommendations you can act on"],
                      ].map(([number, title, description]) => (
                        <div key={number} className="flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.08] text-[11px] font-medium text-slate-500">
                            {number}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-200">{title}</p>
                            <p className="text-xs text-slate-500">{description}</p>
                          </div>
                          <IconCheck className="ml-auto h-4 w-4 shrink-0 text-sky-400" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                    <span className="text-slate-300">Then compare</span>
                    <span aria-hidden="true">·</span>
                    <span>matching skills</span>
                    <span aria-hidden="true">·</span>
                    <span>job requirements</span>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6" id="features">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">
                Product
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Built for serious job search
              </h2>
              <p className="mt-3 text-slate-400">
                One workspace to analyze, improve, and compare your resume against real job descriptions.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "AI resume analysis",
                  body: "ATS score, detected skills, strengths, weaknesses, and targeted recommendations.",
                  cta: "Analyze resume",
                  href: "/upload",
                },
                {
                  title: "Job matching",
                  body: "See matching skills versus missing skills so you can tailor applications with intent.",
                  cta: "Match a job",
                  href: "/job-match",
                },
                {
                  title: "History that compounds",
                  body: "Keep every analysis and match. Track progress as you iterate on the same career story.",
                  cta: "View history",
                  href: "/history",
                },
              ].map((item) => (
                <Card key={item.title} className="p-6 transition duration-200 hover:-translate-y-0.5 hover:border-white/15">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.body}</p>
                  <button
                    type="button"
                    onClick={() => navigate(item.href)}
                    className="mt-6 text-sm font-semibold text-sky-300 hover:text-sky-200"
                  >
                    {item.cta} →
                  </button>
                </Card>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="p-6 sm:p-8">
                <Badge tone="sky">Resume analysis</Badge>
                <h2 className="mt-4 text-2xl font-semibold text-white">Know your resume quality in seconds</h2>
                <ul className="mt-5 space-y-3 text-sm text-slate-300">
                  {[
                    "ATS compatibility score with a clear explanation",
                    "Skills extracted from your actual resume",
                    "Missing skills that weaken applications",
                    "Actionable AI recommendations, not generic tips",
                  ].map((line) => (
                    <li key={line} className="flex gap-3">
                      <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                      {line}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 sm:p-8">
                <Badge tone="violet">Job matching</Badge>
                <h2 className="mt-4 text-2xl font-semibold text-white">Apply where you actually fit</h2>
                <ul className="mt-5 space-y-3 text-sm text-slate-300">
                  {[
                    "Paste a job description and compare it to a saved resume",
                    "Match score grounded in skills overlap",
                    "Matching skills separated from missing skills",
                    "Recommendations to close the gap before you apply",
                  ].map((line) => (
                    <li key={line} className="flex gap-3">
                      <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                      {line}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <Card className="p-6 sm:p-10">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">
                    Trust
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Private by design</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
                  <div className="flex gap-3">
                    <IconLock className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                    <div>
                      <p className="font-medium text-white">Used for analysis only</p>
                      <p className="mt-1 text-sm text-slate-400">
                        Uploads are processed to generate insights for your account.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <IconShield className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                    <div>
                      <p className="font-medium text-white">Protected sessions</p>
                      <p className="mt-1 text-sm text-slate-400">
                        Authenticated access keeps your history and matches in your workspace.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
            <div className="rounded-2xl border border-sky-400/15 bg-gradient-to-br from-sky-500/10 via-transparent to-indigo-500/10 px-6 py-12 text-center sm:px-10">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Make your next application sharper
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-400">
                Upload a resume, get an ATS score, then match it against the job you actually want.
              </p>
              <Button className="mt-8 h-12 px-7" onClick={goAnalyze}>
                Start analyzing
                <IconArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Home;
