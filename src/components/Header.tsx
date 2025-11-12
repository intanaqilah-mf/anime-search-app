import { Link } from 'react-router-dom';

interface HeaderProps {
  onGenreClick: (genreId: number) => void;
  onSearch: (query: string) => void;
  searchValue: string;
}

// Top 5 most popular anime genres
const TOP_GENRES = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 4, name: 'Comedy' },
  { id: 10, name: 'Fantasy' },
  { id: 22, name: 'Romance' },
];

export default function Header({ onGenreClick, onSearch, searchValue }: HeaderProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleClearSearch = () => {
    onSearch('');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Left: Logo */}
        <Link to="/" className="header-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">Animeflix</span>
        </Link>

        {/* Middle: Top 5 Genres */}
        <nav className="header-nav">
          {TOP_GENRES.map((genre) => (
            <button
              key={genre.id}
              className="nav-genre-btn"
              onClick={() => onGenreClick(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </nav>

        {/* Right: Search Bar */}
        <div className="header-search">
          <input
            type="text"
            className="header-search-input"
            placeholder="Search anime..."
            value={searchValue}
            onChange={handleSearchChange}
          />
          {searchValue && (
            <button
              className="header-search-clear"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
