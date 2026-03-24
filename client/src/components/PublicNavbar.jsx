import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const sections = [
  { id: "home", label: "Home" },
  { id: "classes", label: "Classes" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

export default function PublicNavbar() {
  const [active, setActive] = useState("home");

  // Cache section elements
  const sectionEls = useMemo(() => {
    if (typeof document === "undefined") return [];
    return sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);
  }, []);

  useEffect(() => {
    const HEADER_OFFSET = 110; // fixed navbar height + a little extra

    const setActiveByScroll = () => {
      const y = window.scrollY + HEADER_OFFSET;

      // Find the last section whose top is <= current scroll position
      let current = "home";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;

        const top = el.offsetTop;
        if (top <= y) current = s.id;
      }
      setActive(current);
    };

    // Run once on load
    setActiveByScroll();

    // Smooth + efficient scroll handler
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setActiveByScroll();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", setActiveByScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setActiveByScroll);
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const itemClass = (id) => {
    const isActive = active === id;

    return [
      "relative",
      "text-sm",
      "font-semibold",
      "uppercase",
      "tracking-wide",
      "transition-all",
      "duration-200",
      "ease-out",
      "hover:scale-110",
      "hover:text-[0.95rem]",
      isActive ? "text-emerald-400" : "text-zinc-200 hover:text-white",
    ].join(" ");
  };

  const underlineClass = (id) => {
    const isActive = active === id;
    return [
      "absolute",
      "-bottom-2",
      "left-0",
      "h-[2px]",
      "rounded-full",
      "transition-all",
      "duration-300",
      isActive ? "w-full bg-emerald-400" : "w-0 bg-transparent",
    ].join(" ");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-black/60 backdrop-blur border-b border-white/10">
        <div className="w-full px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <button
              onClick={() => scrollTo("home")}
              className="flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-xl bg-emerald-500/90 grid place-items-center font-black text-zinc-950">
                M
              </div>
              <div className="leading-tight text-left">
                <div className="text-white font-extrabold tracking-wide">
                  MUSCLEMINT
                </div>
                <div className="text-xs text-zinc-300">GYM SYSTEM</div>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={itemClass(s.id)}
                >
                  {s.label}
                  <span className={underlineClass(s.id)} />
                </button>
              ))}
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollTo("contact")}
                className="hidden sm:inline-flex rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-emerald-400 transition"
              >
                JOIN US TODAY
              </button>

              <Link
                to="/login"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Mobile nav */}
          <div className="mt-4 flex flex-wrap gap-4 lg:hidden">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={itemClass(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}