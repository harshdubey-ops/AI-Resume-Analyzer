import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Alert, Badge, Button, Card, Spinner } from "../components/ui";
import { IconFile, IconLock, IconUpload } from "../components/icons";

function UploadResume() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const applyFile = (file) => {
    setError("");
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file.");
      return;
    }
    setSelectedFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    applyFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070d] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[-150px] top-[-150px] h-[400px] w-[400px] rounded-full bg-sky-600/10 blur-[120px]" />
        <div className="absolute right-[-150px] top-[300px] h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="text-center">
            <Badge>Step 1 of 3</Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Upload your resume
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              We&apos;ll extract skills, score ATS compatibility, and surface improvements you can act on.
            </p>
          </div>

          <Card className="mt-10 p-5 sm:p-7">
            {error && (
              <div className="mb-4">
                <Alert>{error}</Alert>
              </div>
            )}

            <div
              onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              className={`rounded-xl border border-dashed px-4 py-12 text-center transition sm:px-6 ${
                dragActive
                  ? "border-sky-400/60 bg-sky-400/10"
                  : "border-white/15 bg-[#080d18]"
              }`}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sky-300">
                <IconUpload className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-white">Drop your resume here</h2>
              <p className="mt-1 text-sm text-slate-500">or choose a file from your computer</p>

              <label className="mt-6 inline-flex cursor-pointer">
                <span className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]">
                  Choose resume
                </span>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="sr-only"
                  onChange={(e) => applyFile(e.target.files[0])}
                  aria-label="Choose a PDF resume"
                />
              </label>

              {selectedFile && (
                <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-left">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
                    <IconFile />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-emerald-300">Resume selected</p>
                    <p className="truncate text-sm font-medium text-white">{selectedFile.name}</p>
                    <p className="text-xs text-slate-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ml-auto text-xs text-slate-400 hover:text-white"
                    onClick={() => setSelectedFile(null)}
                  >
                    Remove
                  </button>
                </div>
              )}

              <p className="mt-5 text-xs text-slate-500">PDF files only</p>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <IconLock className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
              <div>
                <p className="text-sm font-semibold text-white">Your resume is secure</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Uploads are used only for analysis in your account. You can review or delete history later.
                </p>
              </div>
            </div>

            <Button
              className="mt-5 h-12 w-full"
              disabled={loading}
              onClick={async () => {
                if (!selectedFile) {
                  setError("Please select a resume first");
                  return;
                }

                try {
                  setLoading(true);
                  setError("");

                  const formData = new FormData();
                  formData.append("resume", selectedFile);

                  const response = await fetch("http://localhost:5000/upload", {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: formData,
                  });

                  const data = await response.json();

                  if (!response.ok) {
                    setLoading(false);
                    setError(data.message || "Something went wrong");
                    return;
                  }

                  console.log("AI Analysis:", data.analysis);

                  navigate("/analysis", {
                    state: {
                      analysis: data.analysis,
                      fileName: data.fileName,
                    },
                  });
                } catch (err) {
                  console.error("Upload error:", err);
                  setLoading(false);
                  setError("Failed to analyze resume");
                }
              }}
            >
              {loading ? (
                <>
                  <Spinner />
                  Analyzing resume...
                </>
              ) : (
                "Analyze my resume"
              )}
            </Button>
          </Card>

          <div className="mt-12">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">
              AI analysis
            </p>
            <h2 className="mt-2 text-center text-2xl font-semibold text-white">What we&apos;ll analyze</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { title: "ATS score", body: "How well your resume is likely to pass applicant tracking systems." },
                { title: "Skills detection", body: "Technical and professional skills extracted from the document." },
                { title: "AI improvements", body: "Specific suggestions to strengthen impact and completeness." },
              ].map((item) => (
                <Card key={item.title} className="p-5">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default UploadResume;
