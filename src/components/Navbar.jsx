import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "./ui";
import { IconClose, IconMenu } from "./icons";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function Navbar({ variant = "full" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getStoredUser);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `rounded-lg px-3 py-2 text-sm transition ${
      isActive(path)
        ? "bg-white/[0.07] text-white"
        : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
    }`;

  const authedLinks = (
    <>
      <button type="button" className={linkClass("/upload")} onClick={() => navigate("/upload")}>
        Upload
      </button>
      <button type="button" className={linkClass("/history")} onClick={() => navigate("/history")}>
        Resume History
      </button>
      <button type="button" className={linkClass("/job-match")} onClick={() => navigate("/job-match")}>
        Job Match
      </button>
      <button
        type="button"
        className={linkClass("/job-match-history")}
        onClick={() => navigate("/job-match-history")}
      >
        Job Matches
      </button>
      <button
        type="button"
        className={linkClass("/resume-builder")}
        onClick={() => navigate("/resume-builder")}
      >
        Resume Builder
      </button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#05070d]/80 backdrop-blur-xl">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-sky-500 focus:px-3 focus:py-2 focus:text-slate-950"
      >
        Skip to content
      </a>

      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Logo compact />

        {variant === "minimal" ? (
          <div className="flex items-center gap-2">
            {location.pathname !== "/login" && (
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
            {location.pathname !== "/signup" && (
              <Button onClick={() => navigate("/signup")}>Get started</Button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden items-center gap-1 lg:flex">
              {user ? authedLinks : (
                <>
                  <button type="button" className={linkClass("/")} onClick={() => navigate("/")}>
                    Product
                  </button>
                </>
              )}
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              {user ? (
                <>
                  <span className="max-w-[140px] truncate text-sm text-sky-300">{user.name}</span>
                  <Button variant="danger" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button onClick={() => navigate("/signup")}>Get started</Button>
                </>
              )}
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <IconClose /> : <IconMenu />}
            </button>
          </>
        )}
      </nav>

      {variant !== "minimal" && open && (
        <div id="mobile-nav" className="border-t border-white/[0.07] px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {user ? (
              <>
                {authedLinks}
                <p className="px-3 pt-3 text-xs text-slate-500">Signed in as {user.name}</p>
                <Button variant="danger" className="mt-2 w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="justify-start" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button className="mt-1 w-full" onClick={() => navigate("/signup")}>
                  Get started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
