import type { AnimeSearchResponse, AnimeDetailResponse } from '../types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

let abortController: AbortController | null = null;

export const searchAnime = async (
  query: string,
  page: number = 1,
  genres: number[] = []
): Promise<AnimeSearchResponse> => {
  // Cancel any in-flight request
  if (abortController) {
    abortController.abort();
  }

  // Create a new abort controller for this request
  abortController = new AbortController();

  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: '25',
    });

    // Add genre filters if any
    if (genres.length > 0) {
      params.append('genres', genres.join(','));
    }

    const response = await fetch(`${BASE_URL}/anime?${params}`, {
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: AnimeSearchResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request was cancelled');
      }
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
};

export const getAnimeById = async (id: number): Promise<AnimeDetailResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/anime/${id}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: AnimeDetailResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
};

export const getTopAnime = async (page: number = 1, genres: number[] = []): Promise<AnimeSearchResponse> => {
  try {
    // If genres are specified, use the anime endpoint with sfw and order_by parameters
    // Otherwise use top/anime endpoint
    const endpoint = genres.length > 0 ? 'anime' : 'top/anime';

    const params = new URLSearchParams({
      page: page.toString(),
      limit: '25',
    });

    // Add genre filters if any
    if (genres.length > 0) {
      params.append('genres', genres.join(','));
      params.append('order_by', 'popularity');
      params.append('sfw', 'true');
    }

    const response = await fetch(`${BASE_URL}/${endpoint}?${params}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: AnimeSearchResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
};

// Cancel any ongoing search request
export const cancelSearch = (): void => {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
};
