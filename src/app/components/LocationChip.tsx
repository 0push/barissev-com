export default function LocationChip() {
  return (
    <div className="widget widget-loc">
      <div className="widget-globe-wrap">
        <svg className="widget-globe-svg" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ocean" cx="38%" cy="36%" r="65%">
              <stop offset="0%" stopColor="#60b8f5" />
              <stop offset="45%" stopColor="#2a7fd4" />
              <stop offset="100%" stopColor="#0d3d8f" />
            </radialGradient>
            <clipPath id="globe-clip">
              <circle cx="22" cy="22" r="20" />
            </clipPath>
          </defs>

          {/* Ocean */}
          <circle cx="22" cy="22" r="20" fill="url(#ocean)" />

          {/* Subtle continent shapes */}
          <g clipPath="url(#globe-clip)" opacity="0.35">
            <path d="M8 14 Q12 10 18 12 Q22 14 20 20 Q16 24 10 22 Z" fill="#4caf7d" />
            <path d="M20 8 Q28 6 32 12 Q36 18 30 22 Q24 20 22 14 Z" fill="#4caf7d" />
            <path d="M28 24 Q34 22 36 28 Q34 34 28 32 Q24 30 26 26 Z" fill="#4caf7d" />
            <path d="M6 28 Q10 26 14 30 Q12 36 8 34 Z" fill="#4caf7d" />
          </g>

          {/* Latitude lines */}
          <g clipPath="url(#globe-clip)" stroke="white" strokeWidth="0.4" opacity="0.25">
            <ellipse cx="22" cy="22" rx="20" ry="6" />
            <ellipse cx="22" cy="15" rx="17" ry="4" />
            <ellipse cx="22" cy="29" rx="17" ry="4" />
          </g>

          {/* Longitude lines */}
          <g clipPath="url(#globe-clip)" stroke="white" strokeWidth="0.4" opacity="0.18">
            <line x1="22" y1="2" x2="22" y2="42" />
            <ellipse cx="22" cy="22" rx="10" ry="20" />
          </g>

          {/* Globe edge highlight */}
          <circle cx="22" cy="22" r="20" stroke="white" strokeWidth="0.5" strokeOpacity="0.15" fill="none" />
          <circle cx="17" cy="16" r="5" fill="white" opacity="0.06" />
        </svg>

        {/* Istanbul dot */}
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
