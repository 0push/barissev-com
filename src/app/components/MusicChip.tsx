export default function MusicChip() {
  return (
    <div className="music-free">
      <div className="vinyl-scene">
        <div className="vinyl-disc vinyl-left" />
        <div className="vinyl-disc vinyl-center">
          <div className="vinyl-label">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/uploads/dust-it-off.jpg" alt="" />
          </div>
        </div>
        <div className="vinyl-disc vinyl-right" />
      </div>
      <div className="music-info">
        <span className="widget-label">Now playing</span>
        <span className="music-track">Dust It Off — The Dø</span>
      </div>
    </div>
  );
}
