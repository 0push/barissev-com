"use client";

import { useEffect } from "react";

export default function Cursor() {
  useEffect(() => {
    const dot = document.getElementById("c-dot");
    const ring = document.getElementById("c-ring");
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    };

    let rafId: number;
    const tick = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    document.addEventListener("mousemove", onMove);

    const hoverEls = document.querySelectorAll("a, button, .tw-tog, .chip, .proj");
    const addHover = (el: Element) => {
      el.addEventListener("mouseenter", () => document.body.classList.add("ch"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("ch"));
    };
    hoverEls.forEach(addHover);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div id="c-dot" />
      <div id="c-ring" />
    </>
  );
}
