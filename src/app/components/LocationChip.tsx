export default function LocationChip() {
  return (
    <div className="widget widget-loc">
      <div className="widget-globe-wrap">
        <svg className="widget-globe-svg" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="globe-fw" cx="38%" cy="34%" r="62%">
              <stop offset="0%" stopColor="oklch(22% 0.014 252)" />
              <stop offset="55%" stopColor="oklch(11% 0.008 252)" />
              <stop offset="100%" stopColor="oklch(7% 0.004 252)" />
            </radialGradient>
            <clipPath id="globe-clip">
              <circle cx="22" cy="22" r="20.5" />
            </clipPath>
          </defs>

          {/* Dark sphere */}
          <circle cx="22" cy="22" r="20.5" fill="url(#globe-fw)" />

          {/* Latitude lines */}
          <g clipPath="url(#globe-clip)" stroke="white" strokeWidth="0.45" opacity="0.13" fill="none">
            <ellipse cx="22" cy="22" rx="20.5" ry="20.5" />
            <ellipse cx="22" cy="17" rx="19" ry="5.5" />
            <ellipse cx="22" cy="27" rx="19" ry="5.5" />
            <ellipse cx="22" cy="12" rx="14" ry="3" />
            <ellipse cx="22" cy="32" rx="14" ry="3" />
            <ellipse cx="22" cy="8"  rx="7"  ry="1.5" />
            <ellipse cx="22" cy="36" rx="7"  ry="1.5" />
          </g>

          {/* Longitude lines */}
          <g clipPath="url(#globe-clip)" stroke="white" strokeWidth="0.45" opacity="0.10" fill="none">
            <line x1="22" y1="1.5" x2="22" y2="42.5" />
            <ellipse cx="22" cy="22" rx="11" ry="20.5" />
            <ellipse cx="22" cy="22" rx="18" ry="20.5" />
            <ellipse cx="22" cy="22" rx="6"  ry="20.5" />
          </g>

          {/* Specular highlight */}
          <ellipse cx="16" cy="15" rx="7" ry="5" fill="white" opacity="0.04" clipPath="url(#globe-clip)" />

          {/* Istanbul marker */}
          <circle cx="28" cy="17" r="2.5" fill="white" opacity="0.18" clipPath="url(#globe-clip)" />
          <circle cx="28" cy="17" r="1.5" fill="white" opacity="0.9" clipPath="url(#globe-clip)" />

          {/* Edge ring */}
          <circle cx="22" cy="22" r="20.5" stroke="white" strokeWidth="0.5" strokeOpacity="0.16" fill="none" />
        </svg>

        <div className="widget-loc-dot">
          <div className="widget-loc-pulse" />
        </div>
      </div>

      <div className="widget-loc-text">
        <span className="widget-label">Location</span>
        <span className="widget-city">Istanbul, TR</span>
      </div>
    </div>
  );
}
