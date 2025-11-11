import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Anime } from '../types/anime';
import { getAnimeById } from '../services/animeApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      if (!id) {
        setError('Invalid anime ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await getAnimeById(parseInt(id));
        setAnime(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  const handleRetry = () => {
    if (id) {
      setIsLoading(true);
      setError(null);
      getAnimeById(parseInt(id))
        .then((response) => {
          setAnime(response.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          setIsLoading(false);
        });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="detail-page">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Search
        </button>
        <ErrorMessage message={error} onRetry={handleRetry} />
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="detail-page">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Search
        </button>
        <div className="empty-state">
          <h3>Anime not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Search
      </button>

      <div className="detail-header">
        <div className="detail-image-container">
          <img
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
            alt={anime.title}
            className="detail-image"
          />
        </div>

        <div className="detail-info">
          <h1 className="detail-title">{anime.title}</h1>
          {anime.title_english && anime.title_english !== anime.title && (
            <h2 className="detail-title-english">{anime.title_english}</h2>
          )}
          {anime.title_japanese && (
            <p className="detail-title-japanese">{anime.title_japanese}</p>
          )}

          <div className="detail-stats">
            {anime.score && (
              <div className="stat-item">
                <span className="stat-label">Score</span>
                <span className="stat-value">⭐ {anime.score.toFixed(2)}</span>
              </div>
            )}
            {anime.rank && (
              <div className="stat-item">
                <span className="stat-label">Rank</span>
                <span className="stat-value">#{anime.rank}</span>
              </div>
            )}
            {anime.popularity && (
              <div className="stat-item">
                <span className="stat-label">Popularity</span>
                <span className="stat-value">#{anime.popularity}</span>
              </div>
            )}
            {anime.members && (
              <div className="stat-item">
                <span className="stat-label">Members</span>
                <span className="stat-value">{anime.members.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="detail-meta">
            {anime.type && (
              <div className="meta-item">
                <strong>Type:</strong> {anime.type}
              </div>
            )}
            {anime.episodes && (
              <div className="meta-item">
                <strong>Episodes:</strong> {anime.episodes}
              </div>
            )}
            {anime.status && (
              <div className="meta-item">
                <strong>Status:</strong> {anime.status}
              </div>
            )}
            {anime.aired?.string && (
              <div className="meta-item">
                <strong>Aired:</strong> {anime.aired.string}
              </div>
            )}
            {anime.duration && (
              <div className="meta-item">
                <strong>Duration:</strong> {anime.duration}
              </div>
            )}
            {anime.rating && (
              <div className="meta-item">
                <strong>Rating:</strong> {anime.rating}
              </div>
            )}
            {anime.source && (
              <div className="meta-item">
                <strong>Source:</strong> {anime.source}
              </div>
            )}
          </div>

          {anime.genres && anime.genres.length > 0 && (
            <div className="detail-genres">
              <strong>Genres:</strong>
              <div className="genre-tags">
                {anime.genres.map((genre) => (
                  <span key={genre.mal_id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {anime.studios && anime.studios.length > 0 && (
            <div className="detail-studios">
              <strong>Studios:</strong> {anime.studios.map((s) => s.name).join(', ')}
            </div>
          )}
        </div>
      </div>

      {anime.synopsis && (
        <div className="detail-section">
          <h3>Synopsis</h3>
          <p className="detail-synopsis">{anime.synopsis}</p>
        </div>
      )}

      {anime.background && (
        <div className="detail-section">
          <h3>Background</h3>
          <p className="detail-background">{anime.background}</p>
        </div>
      )}

      {anime.trailer?.embed_url && (
        <div className="detail-section">
          <h3>Trailer</h3>
          <div className="trailer-container">
            <iframe
              src={anime.trailer.embed_url}
              title={`${anime.title} Trailer`}
              allowFullScreen
              className="trailer-iframe"
            />
          </div>
        </div>
      )}
    </div>
  );
}
