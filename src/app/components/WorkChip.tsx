export default function WorkChip() {
  const icons = [
    { color: "#5b8af0" },
    { color: "#f0845b" },
    { color: "#5bbf8a" },
    { color: "#c45bf0" },
  ];

  return (
    <a href="#projects" className="widget widget-work">
      <div className="widget-folder">
        <div className="widget-folder-bg" />
        <div className="widget-folder-icons">
          {icons.map((ic, i) => (
            <div
              key={i}
              className="widget-folder-icon"
              style={{ background: ic.color }}
            />
          ))}
        </div>
      </div>
      <div className="widget-work-text">
        <span className="widget-label">Portfolio</span>
        <span className="widget-work-cta">
          View my work
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </a>
  );
}
