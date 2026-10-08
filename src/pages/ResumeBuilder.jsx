import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Alert, Badge, Button, Card, Field, Input, Select, Spinner, Textarea } from "../components/ui";

const emptyResume = {
  template: "modern",
  fullName: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  website: "",
  summary: "",
  skills: "",
  experience: "",
  education: "",
  projects: "",
};

const textFields = [
  { name: "summary", label: "Professional summary", placeholder: "A concise introduction to your experience and career goals.", rows: 4 },
  { name: "skills", label: "Skills", placeholder: "JavaScript\nReact\nNode.js\nCommunication", rows: 4, hint: "Put each skill on a new line." },
  { name: "experience", label: "Work experience", placeholder: "Senior Developer | Acme Inc. | 2022–Present\nDescribe your impact and achievements.\n\nDeveloper | Example Co. | 2020–2022\nDescribe your responsibilities and results.", rows: 7, hint: "Separate roles with a blank line. Put each responsibility on a new line." },
  { name: "education", label: "Education", placeholder: "B.Sc. Computer Science | Example University | 2020", rows: 4, hint: "Separate qualifications with a blank line." },
  { name: "projects", label: "Projects", placeholder: "Project name | Technology used\nWhat you built and its impact.", rows: 5, hint: "Separate projects with a blank line." },
];

function getLines(value) {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function getBlocks(value) {
  return value.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
}

async function createResumeDocument(resume, versionName) {
  const { Document, HeadingLevel, Paragraph, TextRun } = await import("docx");
  const accent = resume.template === "classic" ? "334155" : "0369A1";
  const paragraphs = [];
  const addSection = (title, content, asList = false) => {
    if (!content.trim()) return;
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        keepNext: true,
        spacing: { before: 240, after: 100 },
        children: [new TextRun({ text: title.toUpperCase(), font: "Arial", size: 22, bold: true, color: accent })],
      })
    );

    if (asList) {
      getLines(content).forEach((skill) => {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: skill, font: "Arial", size: 20 })],
          bullet: { indent: 360 },
          spacing: { after: 40 },
        }));
      });
      return;
    }

    getBlocks(content).forEach((block) => {
      const [heading, ...details] = block.split(/\r?\n/);
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: heading, font: "Arial", size: 20, bold: true })],
        keepNext: details.length > 0,
        spacing: { before: 100, after: 50 },
      }));
      details.forEach((detail) => {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: detail, font: "Arial", size: 20 })],
          bullet: { indent: 360 },
          spacing: { after: 40 },
        }));
      });
    });
  };

  paragraphs.push(new Paragraph({
    alignment: resume.template === "classic" ? "center" : "left",
    children: [new TextRun({
      text: resume.fullName || "Your Name",
      font: "Arial",
      size: 36,
      bold: true,
      color: accent,
    })],
    spacing: { after: 70 },
  }));

  if (resume.headline) {
    paragraphs.push(new Paragraph({
      alignment: resume.template === "classic" ? "center" : "left",
      children: [new TextRun({ text: resume.headline, font: "Arial", size: 24, color: "475569" })],
      spacing: { after: 100 },
    }));
  }

  const contact = [resume.email, resume.phone, resume.location, resume.linkedin, resume.website]
    .filter(Boolean)
    .join("  |  ");
  if (contact) {
    paragraphs.push(new Paragraph({
      alignment: resume.template === "classic" ? "center" : "left",
      children: [new TextRun({ text: contact, font: "Arial", size: 18, color: "475569" })],
      spacing: { after: 220 },
    }));
  }

  addSection("Professional Summary", resume.summary);
  addSection("Skills", resume.skills, true);
  addSection("Experience", resume.experience);
  addSection("Education", resume.education);
  addSection("Projects", resume.projects);

  return new Document({
    creator: "AI Resume Analyzer",
    title: `${resume.fullName || "Resume"} - ${versionName || "Resume"}`,
    description: "Editable resume created with AI Resume Analyzer",
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
        },
      },
      children: paragraphs,
    }],
  });
}

function ResumePreview({ resume }) {
  const skills = getLines(resume.skills);
  const sections = [
    ["Experience", resume.experience],
    ["Education", resume.education],
    ["Projects", resume.projects],
  ].filter(([, value]) => value.trim());

  return (
    <article className={`resume-sheet resume-${resume.template} mx-auto min-h-[800px] w-full max-w-[640px] bg-white p-7 text-slate-800 shadow-2xl sm:p-10`}>
      <header className="resume-heading border-b-2 border-slate-800 pb-5">
        <h2 className="break-words text-3xl font-bold tracking-tight text-slate-900">
          {resume.fullName || "Your Name"}
        </h2>
        {resume.headline && <p className="mt-1 text-base font-medium text-slate-600">{resume.headline}</p>}
        <div className="resume-contact mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
          {[resume.email, resume.phone, resume.location, resume.linkedin, resume.website].filter(Boolean).map((item) => (
            <span key={item} className="break-all">{item}</span>
          ))}
        </div>
      </header>

      {resume.summary && (
        <section className="resume-section mt-5">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-800">Professional Summary</h3>
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{resume.summary}</p>
        </section>
      )}

      {skills.length > 0 && (
        <section className="resume-section mt-5">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-800">Skills</h3>
          <p className="text-sm leading-6 text-slate-700">{skills.join("  •  ")}</p>
        </section>
      )}

      {sections.map(([title, content]) => (
        <section className="resume-section mt-5" key={title}>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-800">{title}</h3>
          <div className="space-y-3">
            {getBlocks(content).map((block, index) => {
              const [heading, ...details] = block.split(/\r?\n/);
              return (
                <div key={`${title}-${index}`} className="resume-entry">
                  <p className="whitespace-pre-wrap text-sm font-semibold leading-5 text-slate-800">{heading}</p>
                  {details.length > 0 && (
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm leading-5 text-slate-700">
                      {details.map((detail, detailIndex) => <li key={detailIndex}>{detail}</li>)}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </article>
  );
}

function ResumeBuilder() {
  const [resume, setResume] = useState(emptyResume);
  const [versions, setVersions] = useState([]);
  const [selectedVersionId, setSelectedVersionId] = useState("");
  const [versionName, setVersionName] = useState("");
  const [newVersionName, setNewVersionName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [docxExporting, setDocxExporting] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const loadVersions = async () => {
      try {
        const response = await fetch("http://localhost:5000/resume-versions", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to load your resume versions.");
        }
        const savedVersions = Array.isArray(data.versions) ? data.versions : [];
        setVersions(savedVersions);
        if (savedVersions.length > 0) {
          setSelectedVersionId(savedVersions[0]._id);
          setVersionName(savedVersions[0].name);
          setResume({ ...emptyResume, ...savedVersions[0] });
        }
      } catch (loadError) {
        console.error("Resume versions load error:", loadError);
        setError(loadError.message || "Unable to load your resume versions.");
      } finally {
        setLoading(false);
      }
    };

    loadVersions();
  }, []);

  const selectVersion = (id) => {
    const selected = versions.find((version) => version._id === id);
    if (!selected) return;
    if (dirty && !window.confirm("Discard unsaved changes and open another version?")) return;
    setSelectedVersionId(selected._id);
    setVersionName(selected.name);
    setResume({ ...emptyResume, ...selected });
    setDirty(false);
    setError("");
    setNotice("");
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setResume((current) => ({ ...current, [name]: value }));
    setDirty(true);
    setNotice("");
  };

  const saveResume = async () => {
    if (!selectedVersionId) {
      setError("Create a resume version before saving.");
      return;
    }
    if (!versionName.trim()) {
      setError("Please enter a name for this resume version.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`http://localhost:5000/resume-versions/${selectedVersionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...resume, name: versionName }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to save this resume version.");
      }
      const savedVersion = data.version;
      setResume({ ...emptyResume, ...savedVersion });
      setVersionName(savedVersion.name);
      setDirty(false);
      setVersions((current) => [
        savedVersion,
        ...current.filter((version) => version._id !== savedVersion._id),
      ]);
      setNotice("Resume version saved to your account.");
    } catch (saveError) {
      console.error("Resume version save error:", saveError);
      setError(saveError.message || "Unable to save this resume version.");
    } finally {
      setSaving(false);
    }
  };

  const createVersion = async () => {
    const name = newVersionName.trim();
    if (!name) {
      setError("Enter a name or target role for the new version.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("http://localhost:5000/resume-versions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...resume, name }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to create a resume version.");
      }
      setVersions((current) => [data.version, ...current]);
      setSelectedVersionId(data.version._id);
      setVersionName(data.version.name);
      setResume({ ...emptyResume, ...data.version });
      setDirty(false);
      setNewVersionName("");
      setNotice(`Created “${data.version.name}”. This version starts with a copy of the current resume.`);
    } catch (createError) {
      console.error("Resume version create error:", createError);
      setError(createError.message || "Unable to create a resume version.");
    } finally {
      setSaving(false);
    }
  };

  const deleteVersion = async () => {
    const selected = versions.find((version) => version._id === selectedVersionId);
    if (!selected || !window.confirm(`Delete the “${selected.name}” resume version? This cannot be undone.`)) {
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`http://localhost:5000/resume-versions/${selectedVersionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to delete this resume version.");
      }
      const remaining = versions.filter((version) => version._id !== selectedVersionId);
      setVersions(remaining);
      if (remaining.length > 0) {
        const next = remaining[0];
        setSelectedVersionId(next._id);
        setVersionName(next.name);
        setResume({ ...emptyResume, ...next });
      } else {
        setSelectedVersionId("");
        setVersionName("");
        setResume(emptyResume);
      }
      setDirty(false);
      setNotice("Resume version deleted.");
    } catch (deleteError) {
      console.error("Resume version delete error:", deleteError);
      setError(deleteError.message || "Unable to delete this resume version.");
    } finally {
      setSaving(false);
    }
  };

  const downloadDocx = async () => {
    if (!resume.fullName.trim()) {
      setError("Add your name before downloading the resume.");
      return;
    }

    setDocxExporting(true);
    setError("");
    setNotice("");
    try {
      const { Packer } = await import("docx");
      const wordDocument = await createResumeDocument(resume, versionName);
      const blob = await Packer.toBlob(wordDocument);
      const downloadUrl = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      const fileBase = `${resume.fullName}-${versionName || "Resume"}`
        .normalize("NFKD")
        .replace(/[^\w.-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 100) || "resume";
      link.href = downloadUrl;
      link.download = `${fileBase}.docx`;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      setNotice("Editable Word resume downloaded.");
    } catch (exportError) {
      console.error("DOCX export error:", exportError);
      setError("Unable to create the Word document. Please try again.");
    } finally {
      setDocxExporting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#05070d] text-slate-100">
      <Navbar />
      <main id="main" className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge>Resume Builder</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Build a professional resume</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Create role-specific versions, keep each one editable, and download any version as a PDF.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={saveResume} disabled={loading || saving || !selectedVersionId}>
              {saving ? <><Spinner /> Saving...</> : "Save version"}
            </Button>
            <Button onClick={() => window.print()} disabled={loading || !resume.fullName.trim()}>
              Download PDF
            </Button>
            <Button
              variant="secondary"
              onClick={downloadDocx}
              disabled={loading || docxExporting || !resume.fullName.trim()}
            >
              {docxExporting ? <><Spinner /> Creating DOCX...</> : "Download DOCX"}
            </Button>
          </div>
        </div>

        {(error || notice) && (
          <div className="mb-5">
            <Alert tone={error ? "rose" : "emerald"}>{error || notice}</Alert>
          </div>
        )}

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(340px,0.8fr)_minmax(580px,1.2fr)]">
          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Your resume versions</h2>
                <p className="mt-1 text-sm text-slate-400">Each version has its own details and template.</p>
              </div>
              <Badge>{versions.length} saved</Badge>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-400">
                <Spinner className="h-5 w-5" /> Loading saved versions...
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {versions.length > 0 && (
                  <Field id="savedVersion" label="Open a saved version">
                    <Select id="savedVersion" value={selectedVersionId} onChange={(event) => selectVersion(event.target.value)}>
                      {versions.map((version) => (
                        <option key={version._id} value={version._id}>{version.name}</option>
                      ))}
                    </Select>
                  </Field>
                )}

                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <Field id="newVersionName" label="Create a new version" hint="Starts as a copy of the currently selected version.">
                    <Input
                      id="newVersionName"
                      value={newVersionName}
                      onChange={(event) => setNewVersionName(event.target.value)}
                      maxLength={80}
                      placeholder="e.g. Frontend Developer"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") createVersion();
                      }}
                    />
                  </Field>
                  <Button className="self-end" onClick={createVersion} disabled={saving}>New version</Button>
                </div>

                {selectedVersionId && (
                  <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto]">
                    <Field id="versionName" label="Selected version name">
                      <Input
                        id="versionName"
                        value={versionName}
                        onChange={(event) => {
                          setVersionName(event.target.value);
                          setDirty(true);
                        }}
                        maxLength={80}
                        placeholder="Version name or target role"
                      />
                    </Field>
                    <Button variant="danger" onClick={deleteVersion} disabled={saving}>Delete version</Button>
                  </div>
                )}

                <div className="border-t border-white/[0.08] pt-5">
                  <h3 className="font-semibold text-white">Resume details</h3>
                  <p className="mt-1 text-sm text-slate-400">Edit details for the selected version.</p>
                </div>

                <Field id="template" label="Choose a template">
                  <Select id="template" name="template" value={resume.template} onChange={updateField}>
                    <option value="modern">Modern — clean accent</option>
                    <option value="classic">Classic — traditional</option>
                  </Select>
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="fullName" label="Full name">
                    <Input id="fullName" name="fullName" value={resume.fullName} onChange={updateField} maxLength={120} placeholder="Jordan Lee" autoComplete="name" />
                  </Field>
                  <Field id="headline" label="Professional title">
                    <Input id="headline" name="headline" value={resume.headline} onChange={updateField} maxLength={120} placeholder="Software Engineer" />
                  </Field>
                  <Field id="email" label="Email">
                    <Input id="email" name="email" type="email" value={resume.email} onChange={updateField} maxLength={160} placeholder="jordan@example.com" autoComplete="email" />
                  </Field>
                  <Field id="phone" label="Phone">
                    <Input id="phone" name="phone" value={resume.phone} onChange={updateField} maxLength={50} placeholder="+1 555 010 1234" autoComplete="tel" />
                  </Field>
                  <Field id="location" label="Location">
                    <Input id="location" name="location" value={resume.location} onChange={updateField} maxLength={120} placeholder="City, Country" autoComplete="address-level2" />
                  </Field>
                  <Field id="linkedin" label="LinkedIn">
                    <Input id="linkedin" name="linkedin" value={resume.linkedin} onChange={updateField} maxLength={200} placeholder="linkedin.com/in/yourname" />
                  </Field>
                </div>

                <Field id="website" label="Portfolio or website">
                  <Input id="website" name="website" value={resume.website} onChange={updateField} maxLength={200} placeholder="yourportfolio.com" />
                </Field>

                {textFields.map(({ name, label, placeholder, rows, hint }) => (
                  <Field id={name} label={label} hint={hint} key={name}>
                    <Textarea id={name} name={name} value={resume[name]} onChange={updateField} placeholder={placeholder} rows={rows} maxLength={name === "summary" ? 2500 : 6000} />
                  </Field>
                ))}
              </div>
            )}
          </Card>

          <section className="resume-preview-panel min-w-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-white">Live preview</h2>
                <p className="mt-1 text-xs text-slate-500">Use “Download PDF” and choose “Save as PDF” in the print dialog.</p>
              </div>
              <Badge tone="emerald">A4-ready</Badge>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111827] p-3 sm:p-5">
              <div className="resume-print-target">
                <ResumePreview resume={resume} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ResumeBuilder;
