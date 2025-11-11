import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import DetailPage from './pages/DetailPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/anime/:id" element={<DetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
