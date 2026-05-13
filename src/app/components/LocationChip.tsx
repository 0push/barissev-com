export default function LocationChip() {
  return (
    <div className="widget widget-loc">
      <div className="loc-globe-wrap">
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="loc-globe-svg">
          <defs>
            <clipPath id="wf-clip">
              <circle cx="36" cy="36" r="33" />
            </clipPath>
          </defs>

          {/* Outer ring */}
          <circle cx="36" cy="36" r="33" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.28" fill="none" />

          {/* Latitude lines */}
          <g clipPath="url(#wf-clip)" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.18" fill="none">
            <ellipse cx="36" cy="36" rx="33" ry="33" />
            <ellipse cx="36" cy="28" rx="30" ry="8" />
            <ellipse cx="36" cy="44" rx="30" ry="8" />
            <ellipse cx="36" cy="20" rx="21" ry="5" />
            <ellipse cx="36" cy="52" rx="21" ry="5" />
            <ellipse cx="36" cy="13" rx="10" ry="2.5" />
            <ellipse cx="36" cy="59" rx="10" ry="2.5" />
          </g>

          {/* Longitude lines */}
          <g clipPath="url(#wf-clip)" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.14" fill="none">
            <line x1="36" y1="3" x2="36" y2="69" />
            <ellipse cx="36" cy="36" rx="16" ry="33" />
            <ellipse cx="36" cy="36" rx="28" ry="33" />
          </g>

          {/* Istanbul pulse rings */}
          <circle cx="45" cy="27" r="5" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.12" fill="none" clipPath="url(#wf-clip)" />
          {/* Istanbul dot */}
          <circle cx="45" cy="27" r="2.2" fill="currentColor" fillOpacity="0.7" clipPath="url(#wf-clip)" />
          <circle cx="45" cy="27" r="1.2" fill="currentColor" fillOpacity="0.95" clipPath="url(#wf-clip)" />
        </svg>

        <div className="loc-pulse-dot">
          <div className="loc-pulse-ring" />
        </div>
      </div>

      <div className="loc-footer">
        <span className="widget-label">Location</span>
        <span className="loc-city">Istanbul, TR</span>
      </div>
    </div>
  );
}
