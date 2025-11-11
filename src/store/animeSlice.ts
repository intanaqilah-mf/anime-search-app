import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Anime, AnimePagination } from '../types/anime';

interface AnimeState {
  searchResults: Anime[];
  searchQuery: string;
  currentPage: number;
  pagination: AnimePagination | null;
  isLoading: boolean;
  error: string | null;
  selectedAnime: Anime | null;
}

const initialState: AnimeState = {
  searchResults: [],
  searchQuery: '',
  currentPage: 1,
  pagination: null,
  isLoading: false,
  error: null,
  selectedAnime: null,
};

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to page 1 when search query changes
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<{ data: Anime[]; pagination: AnimePagination }>) => {
      state.searchResults = action.payload.data;
      state.pagination = action.payload.pagination;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setSelectedAnime: (state, action: PayloadAction<Anime | null>) => {
      state.selectedAnime = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setSearchQuery,
  setCurrentPage,
  setSearchResults,
  setLoading,
  setError,
  setSelectedAnime,
  clearError,
} = animeSlice.actions;

export default animeSlice.reducer;
