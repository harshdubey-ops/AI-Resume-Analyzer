export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60";

  const variants = {
    primary:
      "bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-[0_0_0_1px_rgba(56,189,248,0.25)]",
    secondary:
      "border border-white/12 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]",
    ghost: "text-slate-300 hover:bg-white/[0.06] hover:text-white",
    danger:
      "border border-rose-400/25 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20",
    white: "bg-white text-slate-950 hover:bg-slate-100",
  };

  return (
    <button type={type} className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.035] shadow-[0_18px_50px_-28px_rgba(0,0,0,0.8)] backdrop-blur-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ children, tone = "sky", className = "" }) {
  const tones = {
    sky: "border-sky-400/25 bg-sky-400/10 text-sky-300",
    emerald: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    rose: "border-rose-400/25 bg-rose-400/10 text-rose-300",
    amber: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    violet: "border-violet-400/25 bg-violet-400/10 text-violet-300",
    slate: "border-white/12 bg-white/5 text-slate-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Field({ id, label, children, hint }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-200">
          {label}
        </label>
      )}
      {children}
      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

const controlClass =
  "w-full rounded-lg border border-white/10 bg-[#070b14] px-3.5 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/15";

export function Input({ className = "", ...props }) {
  return <input className={`${controlClass} ${className}`} {...props} />;
}

export function Select({ className = "", children, ...props }) {
  return (
    <select className={`${controlClass} ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className = "", ...props }) {
  return <textarea className={`${controlClass} resize-none ${className}`} {...props} />;
}

export function Alert({ tone = "rose", children }) {
  const tones = {
    rose: "border-rose-400/20 bg-rose-500/10 text-rose-200",
    emerald: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
    sky: "border-sky-400/20 bg-sky-500/10 text-sky-200",
  };

  return (
    <div role="alert" className={`rounded-lg border px-3.5 py-3 text-sm ${tones[tone]}`}>
      {children}
    </div>
  );
}

export function Spinner({ className = "h-4 w-4" }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function ProgressBar({ value, className = "" }) {
  const width = Math.min(Math.max(Number(value) || 0, 0), 100);

  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-white/10 ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 transition-[width] duration-700"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function SkillBadge({ children, tone = "sky" }) {
  const tones = {
    sky: "border-sky-400/20 bg-sky-400/10 text-sky-200",
    emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    rose: "border-rose-400/20 bg-rose-400/10 text-rose-200",
  };

  return (
    <span className={`inline-flex max-w-full break-words rounded-lg border px-3 py-1.5 text-sm font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
        {description && <p className="mt-1.5 text-sm text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <Card className="px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sky-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}

export function Modal({ title, subtitle, onClose, children, labelledBy = "modal-title" }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-white/10 bg-[#0b101c] p-5 shadow-2xl animate-slide-up sm:rounded-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {subtitle && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-400">
                {subtitle}
              </p>
            )}
            <h2 id={labelledBy} className="mt-1 truncate text-xl font-semibold text-white">
              {title}
            </h2>
          </div>
          <Button variant="secondary" onClick={onClose} aria-label="Close dialog">
            Close
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ title, description, confirmLabel = "Delete", onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={onCancel}
    >
      <Card className="w-full max-w-md p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-0">
          <h2 id="confirm-title" className="text-lg font-semibold text-white">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function ScoreRing({ score, size = 128, label }) {
  const value = Math.min(Math.max(Number(score) || 0, 0), 100);
  const color = value >= 80 ? "#34d399" : value >= 60 ? "#fbbf24" : "#f87171";
  const inner = size * 0.78;

  return (
    <div
      className="animate-score flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${color} ${value * 3.6}deg, rgba(148,163,184,0.18) 0deg)`,
      }}
      role="img"
      aria-label={label || `Score ${value} out of 100`}
    >
      <div
        className="flex items-center justify-center rounded-full bg-[#080d18]"
        style={{ width: inner, height: inner }}
      >
        <span className="text-2xl font-bold text-white sm:text-3xl">{value}</span>
      </div>
    </div>
  );
}

export function PageShell({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070d] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[-180px] top-[-140px] h-[420px] w-[420px] rounded-full bg-sky-500/[0.08] blur-[120px]" />
        <div className="absolute bottom-[-80px] right-[-160px] h-[420px] w-[420px] rounded-full bg-indigo-500/[0.08] blur-[130px]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
