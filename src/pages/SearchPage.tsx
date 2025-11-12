import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setCurrentPage,
  setSearchResults,
  setLoading,
  setError,
} from '../store/animeSlice';
import { searchAnime, getTopAnime, cancelSearch } from '../services/animeApi';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';
import ErrorMessage from '../components/ErrorMessage';
import SkeletonCard from '../components/SkeletonCard';

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const { searchResults, searchQuery, selectedGenres, currentPage, pagination, isLoading, error } =
    useAppSelector((state) => state.anime);

  // State for managing trailer playback
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [playMainTrailer, setPlayMainTrailer] = useState(true);

  const fetchAnime = useCallback(async (query: string, page: number, genres: number[]) => {
    try {
      dispatch(setLoading(true));
      console.log('Fetching anime with genres:', genres);

      let response;
      if (query.trim() === '') {
        // If no search query, show top anime
        response = await getTopAnime(page, genres);
      } else {
        // Otherwise, search for anime
        response = await searchAnime(query, page, genres);
      }

      dispatch(setSearchResults({ data: response.data, pagination: response.pagination }));
    } catch (err) {
      // Don't show error for cancelled requests
      if (err instanceof Error && err.message !== 'Request was cancelled') {
        dispatch(setError(err.message));
      }
    }
  }, [dispatch]);

  // Fetch anime when search query, page, or genres change
  useEffect(() => {
    console.log('useEffect triggered - fetching page:', currentPage);
    fetchAnime(searchQuery, currentPage, selectedGenres);

    // Cleanup: cancel any pending requests when component unmounts
    return () => {
      cancelSearch();
    };
  }, [searchQuery, currentPage, selectedGenres, fetchAnime]);

  const handlePageChange = useCallback((page: number) => {
    console.log('handlePageChange called with page:', page);
    dispatch(setCurrentPage(page));
    console.log('Dispatched setCurrentPage');
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    fetchAnime(searchQuery, currentPage, selectedGenres);
  }, [fetchAnime, searchQuery, currentPage, selectedGenres]);

  const handleCardHover = (index: number) => {
    setHoveredCardIndex(index);
    setPlayMainTrailer(false);
  };

  const handleCardLeave = () => {
    setHoveredCardIndex(null);
    setPlayMainTrailer(true);
  };

  const featuredAnime = searchResults[0];

  // Filter out top 10 anime from the main grid when showing the hero banner
  // Only slice on the first page when there's no search query AND no genre filter
  const displayedAnime = !searchQuery && !selectedGenres.length && searchResults.length > 0 && currentPage === 1
    ? searchResults.slice(10)
    : searchResults;

  // Helper function to build trailer URL for embed
  const buildTrailerUrl = (embedUrl: string, youtubeId: string | null, muted: boolean = true): string => {
    // The embed_url from API already contains autoplay=1, so we append additional params
    const separator = embedUrl.includes('?') ? '&' : '?';
    const playlistParam = youtubeId ? `&playlist=${youtubeId}` : '';
    const muteParam = muted ? '&mute=1' : '';
    return `${embedUrl}${separator}${muteParam}&controls=0&showinfo=0&rel=0&loop=1${playlistParam}`;
  };

  // Helper function to get YouTube watch URL
  const getYouTubeWatchUrl = (trailer: { url: string | null; embed_url: string | null; youtube_id: string | null } | null): string | null => {
    if (!trailer) return null;

    // If url exists, use it
    if (trailer.url) return trailer.url;

    // If youtube_id exists, build URL from it
    if (trailer.youtube_id) return `https://www.youtube.com/watch?v=${trailer.youtube_id}`;

    // Extract video ID from embed_url
    if (trailer.embed_url) {
      const match = trailer.embed_url.match(/\/embed\/([^?]+)/);
      if (match && match[1]) {
        return `https://www.youtube.com/watch?v=${match[1]}`;
      }
    }

    return null;
  };

  // Debug: Log pagination info (removed displayedAnime from deps to prevent extra renders)
  useEffect(() => {
    console.log('Current page:', currentPage);
    console.log('Search results count:', searchResults.length);
  }, [currentPage, searchResults]);

  return (
    <>
      {/* Netflix-style Full-Width Hero Banner with Top 10 Inside */}
      {!searchQuery && featuredAnime && !isLoading && (
        <div className="hero-banner-full" style={{ display: currentPage === 1 ? 'block' : 'none' }}>
          {/* Background image or trailer */}
          {playMainTrailer && featuredAnime.trailer?.embed_url ? (
            <iframe
              className="hero-trailer"
              src={buildTrailerUrl(featuredAnime.trailer.embed_url, featuredAnime.trailer.youtube_id)}
              title={featuredAnime.title}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div
              className="hero-banner-bg"
              style={{ backgroundImage: `url(${featuredAnime.images.jpg.large_image_url})` }}
            />
          )}

          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">{featuredAnime.title}</h1>
              <div className="hero-meta">
                <span className="hero-rating">⭐ {featuredAnime.score}</span>
                <span className="hero-year">{featuredAnime.year || 'N/A'}</span>
                <span className="hero-type">{featuredAnime.type}</span>
              </div>
              <p className="hero-synopsis">{featuredAnime.synopsis?.slice(0, 200)}...</p>
              <div className="hero-buttons">
                {getYouTubeWatchUrl(featuredAnime.trailer) ? (
                  <a
                    href={getYouTubeWatchUrl(featuredAnime.trailer)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-button hero-button-play"
                  >
                    ▶ Watch Now
                  </a>
                ) : (
                  <button className="hero-button hero-button-play" disabled>
                    ▶ Watch Now
                  </button>
                )}
                <Link
                  to={`/anime/${featuredAnime.mal_id}`}
                  className="hero-button hero-button-info"
                >
                  ℹ More Info
                </Link>
              </div>
            </div>

            {/* Top 10 Anime Carousel Inside Banner */}
            <div className="carousel-section-inside">
              <h2 className="carousel-title">Top 10 Anime</h2>
              <div className="carousel-container">
                <div className="carousel-track">
                  {searchResults.slice(1, 10).map((anime, index) => (
                    <Link
                      key={anime.mal_id}
                      to={`/anime/${anime.mal_id}`}
                      className="carousel-card"
                      onMouseEnter={() => handleCardHover(index)}
                      onMouseLeave={handleCardLeave}
                    >
                      <div className="top-rank-badge">{index + 2}</div>
                      <div className="carousel-card-image">
                        {hoveredCardIndex === index && anime.trailer?.embed_url ? (
                          <iframe
                            className="carousel-trailer"
                            src={buildTrailerUrl(anime.trailer.embed_url, anime.trailer.youtube_id, false)}
                            title={anime.title}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                          />
                        ) : (
                          <img src={anime.images.jpg.large_image_url} alt={anime.title} />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="search-page">
        <main className="search-content">
          {error ? (
            <ErrorMessage message={error} onRetry={handleRetry} />
          ) : isLoading && searchResults.length === 0 ? (
            <div className="anime-grid">
              {Array.from({ length: 10 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : displayedAnime.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No anime found</h3>
              <p>Try searching for something else</p>
            </div>
          ) : (
            <>
              <div className="anime-grid">
                {displayedAnime.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </div>

              {pagination && pagination.last_visible_page > 1 && (
                <Pagination
                  pagination={pagination}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
