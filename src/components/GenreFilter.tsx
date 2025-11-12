import { useState } from 'react';

export interface Genre {
  id: number;
  name: string;
}

// Common anime genres based on MAL genre IDs
export const ANIME_GENRES: Genre[] = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 4, name: 'Comedy' },
  { id: 8, name: 'Drama' },
  { id: 10, name: 'Fantasy' },
  { id: 14, name: 'Horror' },
  { id: 7, name: 'Mystery' },
  { id: 22, name: 'Romance' },
  { id: 24, name: 'Sci-Fi' },
  { id: 36, name: 'Slice of Life' },
  { id: 30, name: 'Sports' },
  { id: 37, name: 'Supernatural' },
  { id: 41, name: 'Thriller' },
  { id: 9, name: 'Ecchi' },
  { id: 49, name: 'Erotica' },
  { id: 12, name: 'Hentai' },
];

interface GenreFilterProps {
  selectedGenres: number[];
  onGenreChange: (genres: number[]) => void;
}

export default function GenreFilter({ selectedGenres, onGenreChange }: GenreFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleGenre = (genreId: number) => {
    if (selectedGenres.includes(genreId)) {
      onGenreChange(selectedGenres.filter((id) => id !== genreId));
    } else {
      onGenreChange([...selectedGenres, genreId]);
    }
  };

  const clearAll = () => {
    onGenreChange([]);
  };

  return (
    <div className="genre-filter">
      <button
        className="genre-filter-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="filter-icon">🎭</span>
        <span className="filter-label">
          Filter by Genre
          {selectedGenres.length > 0 && (
            <span className="filter-count">{selectedGenres.length}</span>
          )}
        </span>
        <span className={`filter-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="genre-filter-dropdown">
          <div className="genre-filter-header">
            <span className="genre-filter-title">Select Genres</span>
            {selectedGenres.length > 0 && (
              <button className="genre-clear-btn" onClick={clearAll}>
                Clear all
              </button>
            )}
          </div>
          <div className="genre-list">
            {ANIME_GENRES.map((genre) => {
              const isSelected = selectedGenres.includes(genre.id);
              return (
                <button
                  key={genre.id}
                  className={`genre-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleGenre(genre.id)}
                >
                  <span className="genre-checkbox">
                    {isSelected && '✓'}
                  </span>
                  <span className="genre-name">{genre.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
