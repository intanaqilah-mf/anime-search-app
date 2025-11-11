import { useEffect, useState, useCallback } from 'react';
import { debounce } from '../utils/debounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
}

export default function SearchBar({ onSearch, initialValue = '', placeholder = 'Search anime...' }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(initialValue);

  // Create a debounced version of the onSearch callback
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 250),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(inputValue);
  }, [inputValue, debouncedSearch]);

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {inputValue && (
          <button
            className="search-clear-button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
