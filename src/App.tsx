import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setSearchQuery, setSelectedGenres } from './store/animeSlice';
import Header from './components/Header';
import SearchPage from './pages/SearchPage';
import DetailPage from './pages/DetailPage';
import './App.css';

function AppContent() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { searchQuery, selectedGenres } = useAppSelector((state) => state.anime);

  const handleGenreClick = (genreId: number) => {
    // If same genre is clicked, clear it. Otherwise, set new genre
    if (selectedGenres.length === 1 && selectedGenres[0] === genreId) {
      dispatch(setSelectedGenres([]));
    } else {
      dispatch(setSelectedGenres([genreId]));
    }

    // Scroll to anime grid after data loads - use multiple attempts
    const scrollToGrid = () => {
      const animeGrid = document.querySelector('.anime-grid');
      if (animeGrid) {
        const headerHeight = 80;
        const elementPosition = animeGrid.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    // Try scrolling at different intervals to ensure it works
    setTimeout(scrollToGrid, 300);
    setTimeout(scrollToGrid, 600);
    setTimeout(scrollToGrid, 1000);
  };

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  // Only show header on search page
  const showHeader = location.pathname === '/';

  return (
    <div className="app">
      {showHeader && (
        <Header
          onGenreClick={handleGenreClick}
          onSearch={handleSearch}
          searchValue={searchQuery}
          selectedGenres={selectedGenres}
        />
      )}
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/anime/:id" element={<DetailPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
