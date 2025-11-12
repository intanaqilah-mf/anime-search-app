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
    // Toggle genre selection
    if (selectedGenres.includes(genreId)) {
      dispatch(setSelectedGenres(selectedGenres.filter(id => id !== genreId)));
    } else {
      dispatch(setSelectedGenres([genreId]));
    }
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
