export default function SkeletonCard() {
  return (
    <div className="anime-card skeleton-card">
      <div className="skeleton-image"></div>
      <div className="anime-card-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-meta"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text short"></div>
      </div>
    </div>
  );
}
