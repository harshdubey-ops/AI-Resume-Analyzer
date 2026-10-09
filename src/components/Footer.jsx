import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-white/[0.07]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-white">Resumind</p>
          <p className="mt-1 text-xs text-slate-500">
            Analyze resumes, improve ATS scores, and match jobs with AI.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
          <button type="button" className="hover:text-white" onClick={() => navigate("/upload")}>
            Analyze
          </button>
          <button type="button" className="hover:text-white" onClick={() => navigate("/job-match")}>
            Job match
          </button>
          <button type="button" className="hover:text-white" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
        <p className="text-sm text-slate-500">© 2026 Resumind</p>
      </div>
    </footer>
  );
}

export default Footer;
