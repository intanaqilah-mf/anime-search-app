import { useEffect } from 'react';
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

  return (
    <div className="search-page">
      <header className="search-header">
        <h1 className="search-title">Anime Search</h1>
        <p className="search-subtitle">
          {searchQuery ? `Search results for "${searchQuery}"` : 'Discover top anime'}
        </p>
      </header>

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
        ) : searchResults.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No anime found</h3>
            <p>Try searching for something else</p>
          </div>
        ) : (
          <>
            <div className="anime-grid">
              {searchResults.map((anime) => (
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
  );
}
