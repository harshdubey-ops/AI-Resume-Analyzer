import { useNavigate } from "react-router-dom";

function Logo({ compact = false }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/")}
      className="flex min-w-0 items-center gap-2.5 rounded-lg text-left"
      aria-label="AI Resume Analyzer home"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 text-xs font-bold text-slate-950">
        AI
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-white">
          ResumeAI
        </span>
        {!compact && (
          <span className="hidden text-[11px] text-slate-500 sm:block">
            Resume intelligence
          </span>
        )}
      </span>
    </button>
  );
}

export default Logo;
