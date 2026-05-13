"use client";

import { useState, useEffect } from "react";

export default function Tweaks() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [guidesHidden, setGuidesHidden] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const guides = document.querySelectorAll<HTMLElement>(".g");
    guides.forEach((el) => {
      el.style.opacity = guidesHidden ? "0" : "1";
    });
  }, [guidesHidden]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    const els = document.querySelectorAll<HTMLElement>(
      ".sec-rule, .sec-title, .proj, .p-num, .contact-hl, .contact-email"
    );
    els.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
      el.style.transition = `opacity .6s ${i * 0.05}s cubic-bezier(.25,.46,.45,.94), transform .6s ${i * 0.05}s cubic-bezier(.25,.46,.45,.94)`;
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return (
    <>
      <button
        id="tweaks-btn"
        className={open ? "hidden" : ""}
        onClick={() => setOpen(true)}
        aria-label="Open tweaks"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      <div id="tweaks" className={open ? "open" : ""}>
        <div className="tw-hd">
          <span className="tw-ttl">Tweaks</span>
          <button className="tw-x" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="tw-row">
          <span className="tw-lbl">Dark mode</span>
          <div
            className={`tw-tog${dark ? " on" : ""}`}
            onClick={() => setDark((d) => !d)}
          />
        </div>
        <div className="tw-row">
          <span className="tw-lbl">Hide guides</span>
          <div
            className={`tw-tog${guidesHidden ? " on" : ""}`}
            onClick={() => setGuidesHidden((g) => !g)}
          />
        </div>
      </div>
    </>
  );
}
