import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setSearchQuery,
  setSelectedGenres,
  setCurrentPage,
  setSearchResults,
  setLoading,
  setError,
} from '../store/animeSlice';
import { searchAnime, getTopAnime, cancelSearch } from '../services/animeApi';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';
import ErrorMessage from '../components/ErrorMessage';
import SkeletonCard from '../components/SkeletonCard';

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const { searchResults, searchQuery, selectedGenres, currentPage, pagination, isLoading, error } =
    useAppSelector((state) => state.anime);

  const fetchAnime = async (query: string, page: number, genres: number[]) => {
    try {
      dispatch(setLoading(true));

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
  };

  // Fetch anime when search query, page, or genres change
  useEffect(() => {
    fetchAnime(searchQuery, currentPage, selectedGenres);

    // Cleanup: cancel any pending requests when component unmounts
    return () => {
      cancelSearch();
    };
  }, [searchQuery, currentPage, selectedGenres]);

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleGenreChange = (genres: number[]) => {
    dispatch(setSelectedGenres(genres));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleRetry = () => {
    fetchAnime(searchQuery, currentPage, selectedGenres);
  };

  const featuredAnime = searchResults[0];

  // Filter out top 10 anime from the main grid when showing the hero banner
  const displayedAnime = !searchQuery && searchResults.length > 0
    ? searchResults.slice(10)
    : searchResults;

  return (
    <>
      {/* Netflix-style Full-Width Hero Banner with Top 10 Inside */}
      {!searchQuery && featuredAnime && !isLoading && (
        <div className="hero-banner-full" style={{ backgroundImage: `url(${featuredAnime.images.jpg.large_image_url})` }}>
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
                <button className="hero-button hero-button-play">▶ Watch Now</button>
                <button className="hero-button hero-button-info">ℹ More Info</button>
              </div>
            </div>

            {/* Top 10 Anime Carousel Inside Banner */}
            <div className="carousel-section-inside">
              <h2 className="carousel-title">Top 10 Anime</h2>
              <div className="carousel-container">
                <div className="carousel-track">
                  {searchResults.slice(0, 10).map((anime, index) => (
                    <Link key={anime.mal_id} to={`/anime/${anime.mal_id}`} className="carousel-card">
                      <div className="top-rank-badge">{index + 1}</div>
                      <div className="carousel-card-image">
                        <img src={anime.images.jpg.large_image_url} alt={anime.title} />
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
        <div className="search-controls">
          <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
          <GenreFilter selectedGenres={selectedGenres} onGenreChange={handleGenreChange} />
        </div>

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
