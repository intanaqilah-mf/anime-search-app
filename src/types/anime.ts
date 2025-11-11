export interface AnimeImage {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface AnimeImages {
  jpg: AnimeImage;
  webp: AnimeImage;
}

export interface AnimeTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
}

export interface AnimeBroadcast {
  day: string | null;
  time: string | null;
  timezone: string | null;
  string: string | null;
}

export interface AnimeTitle {
  type: string;
  title: string;
}

export interface Anime {
  mal_id: number;
  url: string;
  images: AnimeImages;
  trailer: AnimeTrailer;
  approved: boolean;
  titles: AnimeTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string | null;
  source: string | null;
  episodes: number | null;
  status: string | null;
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
    prop: {
      from: { day: number | null; month: number | null; year: number | null };
      to: { day: number | null; month: number | null; year: number | null };
    };
    string: string | null;
  };
  duration: string | null;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  broadcast: AnimeBroadcast;
  producers: Array<{ mal_id: number; type: string; name: string; url: string }>;
  licensors: Array<{ mal_id: number; type: string; name: string; url: string }>;
  studios: Array<{ mal_id: number; type: string; name: string; url: string }>;
  genres: Array<{ mal_id: number; type: string; name: string; url: string }>;
  explicit_genres: Array<{ mal_id: number; type: string; name: string; url: string }>;
  themes: Array<{ mal_id: number; type: string; name: string; url: string }>;
  demographics: Array<{ mal_id: number; type: string; name: string; url: string }>;
}

export interface AnimePagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface AnimeSearchResponse {
  pagination: AnimePagination;
  data: Anime[];
}

export interface AnimeDetailResponse {
  data: Anime;
}
