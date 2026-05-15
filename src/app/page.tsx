import Link from "next/link";
import HowIWork from "./components/HowIWork";
import HeroSub from "./components/HeroSub";
import AboutBento from "./components/AboutBento";

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
          <a href="mailto:iambarissev@gmail.com" className="nav-email" aria-label="Mail">
            <span className="nav-email-blip" />
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-identity">
            <div className="hero-identity-left">
              <div className="hero-av">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/uploads/photo.jpg" alt="Barış Şev" />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                <div>
                  <p className="hero-eyebrow">AI-Native Product Builder</p>
                  <span className="hero-id-name">Barış Şev</span>
                </div>
                <Link href="/about" className="hero-more">
                  <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true">
                    <path d="M2 14 C6 14, 10 6, 18 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
                    <path d="M15 5 L19 8.5 L14.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  more?
                </Link>
              </div>
            </div>
            <span className="hero-location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              IST, TR
            </span>
          </div>

          <HeroSub />
        </div>
      </section>

      {/* Process */}
      <section id="process">
        <div className="wrap">
          <div className="sec-rule">
            <span className="sec-index">01 — Process</span>
            <div className="sec-line" />
          </div>

          <div className="sec-title">How I work</div>

          <HowIWork />
        </div>
      </section>

      {/* About */}
      <section id="about">
        <div className="wrap">
          <div className="sec-rule">
            <span className="sec-index">02 — About</span>
            <div className="sec-line" />
          </div>

          <div className="sec-title">About me</div>
          <AboutBento />
        </div>
      </section>

      {/* Projects */}
      <section id="projects">
        <div className="wrap">
          <div className="sec-rule">
            <span className="sec-index">03 — Projects</span>
            <div className="sec-line" />
          </div>

          <div className="sec-title">Selected work</div>

          <div className="proj-grid">
            <div className="proj-square proj-square--img proj-square--hepitrak">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/uploads/proj-moodwatch.png" alt="Hepitrak" />
              <div className="proj-square__info">
                <p className="proj-square__title">Hepitrak</p>
                <p className="proj-square__desc">Mood tracking for Apple Watch.</p>
              </div>
            </div>
            <div className="proj-square proj-square--img proj-square--fittory">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/uploads/proj-fitness.png" alt="Fittory" />
              <div className="proj-square__info">
                <p className="proj-square__title">Fittory</p>
                <p className="proj-square__desc">Your personal workout companion.</p>
              </div>
            </div>
            <div className="proj-square proj-square--img proj-square--pawview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/uploads/proj-pawview.png" alt="Pawview" />
              <div className="proj-square__info">
                <p className="proj-square__title">Pawview</p>
                <p className="proj-square__desc">Watch your pet from anywhere.</p>
              </div>
            </div>
            <div className="proj-square proj-square--img proj-square--dispo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/uploads/dispo-webapp.png" alt="DISPO" />
              <div className="proj-square__info">
                <p className="proj-square__title">DISPO</p>
                <p className="proj-square__desc">Disposable camera app.</p>
              </div>
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
