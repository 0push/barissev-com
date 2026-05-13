import MusicChip from "./components/MusicChip";
import LocationChip from "./components/LocationChip";

export default function Home() {
  return (
    <>
      {/* Guide lines */}
      <div className="g g-vl" />
      <div className="g g-vr" />
      <div className="g g-ht" />
      <div className="g g-hb" />
      <div className="g g-corner g-c-tl" />
      <div className="g g-corner g-c-tr" />
      <div className="g g-corner g-c-bl" />
      <div className="g g-corner g-c-br" />

      {/* Nav */}
      <nav>
        <div className="wrap">
          <a href="#" className="nav-logo" aria-label="Barış Şev">
            <svg viewBox="0 0 1024 1024" width="36" height="36" aria-hidden="true">
              <path
                fillRule="evenodd"
                fill="currentColor"
                d="m404.37 306.59l157.9-0.12c26.06 24.81 53.52 48.6 79.87 73.14 7.32 6.82 14.75 13.8 22.39 20.22l-0.04 55.5c-20.49 19.15-41.59 37.75-61.99 56.97 8.86 7.66 17.33 15.85 26.08 23.63 12.07 10.74 23.99 21.34 35.81 32.38l0.03 56.6q-20.29 18.73-40.31 37.76l-33.7 31.41c-4.98 4.66-22.22 22.24-27.81 23.02-5.27 0.73-19.55 0.45-25.52 0.46l-44.43 0.04-56.68 0.09c-9.39 0.02-22.81 0.44-31.9-0.2-5.12-3.58-13.47-12.46-18.18-17.22l-26.89-27.04 0.29-173.32q-0.69-74.73 0.06-149.47c2.51-2.22 4.88-4.54 7.28-6.88 12.61-12.3 25.42-24.38 37.74-36.97zm-8.2 68.91l81.84 75.61c22.04 20.28 44.24 39.75 65.5 60.92 6.64-6.9 17.28-17.06 24.5-23.44q26.54-25.17 53.49-49.89l-0.02-22.46c-26.47-22.58-51.08-47.21-77.01-70.23l-77.71 0.02c-13.11 0.01-27.09-0.23-40.14 0.06zm60.4 218.22l-35.27 32.69c-6.89 6.39-16.9 15.98-24.08 21.67 9.88 9.98 21.01 20.49 30.58 30.58l48.95 0.02 42.49 0.19c8.07 0 17.93 0.2 25.87-0.37 25.29-23.28 50.59-47.34 76.25-70.18 0.01-7.49-0.16-15.71 0.07-23.15-14.98-14.78-33.51-30.65-49.24-45.32l-19.22-18.1c-2.09-1.98-7.57-7.46-9.55-8.89-28.82 27.69-57.71 53.68-86.85 80.86zm-58.61-105.34l-0.13 102c13.68-13.61 29.44-27.05 43.7-40.2 13.6-12.86 27.71-25.43 41.13-38.33-7.1-5.81-14.42-12.69-21.27-18.91l-44.45-40.99c-4.71-4.33-14.52-14-19.1-17.69-0.34 17.62 0.1 36.37 0.12 54.12z"
              />
            </svg>
          </a>
          <a href="mailto:iambarissev@gmail.com" className="nav-email">
            iambarissev@gmail.com
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-identity">
            <div className="hero-av">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/uploads/photo.jpg" alt="Barış Şev" />
            </div>
            <div>
              <p className="hero-eyebrow">AI-Native Product Builder</p>
              <span className="hero-id-name">Barış Şev</span>
            </div>
          </div>

          <p className="hero-sub">
            Building <strong>products</strong> at the intersection
            of human creativity and AI.
          </p>

          <div className="chips">
            <MusicChip />
            <div className="chip-connector" />
            <LocationChip />
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects">
        <div className="wrap">
          <div className="sec-rule">
            <span className="sec-index">01 — Projects</span>
            <div className="sec-line" />
          </div>

          <div className="sec-title">Selected work</div>

          <div className="proj-list">
            <a className="proj" href="#">
              <span className="proj-n">01</span>
              <div>
                <span className="proj-name">Venture OS</span>
                <span className="proj-tag">AI Productivity Platform · 2025</span>
              </div>
              <span className="proj-arr">↗</span>
            </a>

            <a className="proj" href="#">
              <span className="proj-n">02</span>
              <div>
                <span className="proj-name">Meridian</span>
                <span className="proj-tag">Data Intelligence Tool · 2024</span>
              </div>
              <span className="proj-arr">↗</span>
            </a>

            <a className="proj" href="#">
              <span className="proj-n">03</span>
              <div>
                <span className="proj-name">Studio Forma</span>
                <span className="proj-tag">Brand &amp; Digital Product · 2024</span>
              </div>
              <span className="proj-arr">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process">
        <div className="wrap">
          <div className="sec-rule">
            <span className="sec-index">02 — Process</span>
            <div className="sec-line" />
          </div>

          <div className="sec-title">How I work</div>

          <div className="principles">
            <div>
              <span className="p-num">1</span>
              <span className="p-title">Think in systems</span>
              <p className="p-text">
                Every product is a network of decisions. Designed for the whole, not just the parts.
              </p>
            </div>

            <div>
              <span className="p-num">2</span>
              <span className="p-title">AI as collaborator</span>
              <p className="p-text">
                AI compresses timelines and expands what&apos;s possible — without replacing the thinking.
              </p>
            </div>

            <div>
              <span className="p-num">3</span>
              <span className="p-title">Ship, then sharpen</span>
              <p className="p-text">
                Real feedback beats perfect planning. Bias toward momentum and iterate fast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="contact">
        <div className="wrap">
          <div className="contact-eyebrow">Say hello</div>
          <div className="contact-hl">
            Have a project?
            <br />
            <em>Let&apos;s build together.</em>
          </div>
          <a href="mailto:iambarissev@gmail.com" className="contact-email">
            iambarissev@gmail.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="wrap">
          <span>© 2026 Barış Şev</span>
          <span>Built with precision.</span>
        </div>
      </footer>
    </>
  );
}
