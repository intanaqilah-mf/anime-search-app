import { Link } from 'react-router-dom';
import type { Anime } from '../types/anime';

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link to={`/anime/${anime.mal_id}`} className="anime-card">
      <div className="anime-card-image">
        <img
          src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
          alt={anime.title}
          loading="lazy"
        />
        {anime.score && (
          <div className="anime-card-score">
            ⭐ {anime.score.toFixed(1)}
          </div>
        )}
      </div>
      <div className="anime-card-content">
        <h3 className="anime-card-title">{anime.title}</h3>
        <div className="anime-card-meta">
          <span className="anime-type">{anime.type || 'N/A'}</span>
          {anime.episodes && (
            <span className="anime-episodes">{anime.episodes} eps</span>
          )}
        </div>
        {anime.synopsis && (
          <p className="anime-card-synopsis">
            {anime.synopsis.length > 120
              ? `${anime.synopsis.substring(0, 120)}...`
              : anime.synopsis}
          </p>
        )}
      </div>
    </Link>
  );
}
