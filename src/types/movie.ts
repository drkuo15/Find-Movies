import type { Timestamp } from 'firebase/firestore';

export interface MovieListItem {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
}

export interface MovieListResponse {
  results: MovieListItem[];
  total_results: number;
  total_pages: number;
  page: number;
}

export interface MovieDetailResponse {
  id: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
  overview: string;
  poster_path: string | null;
  release_date: string;
  runtime: number;
  tagline: string | null;
  title: string;
  vote_average: number;
}

export interface MovieDetailAndCreditResponse extends MovieDetailResponse {
  credits: {
    cast: Array<{
      id: number;
      name: string;
      profile_path: string | null;
      character: string;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
    }>;
  };
}

export interface MovieReview {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
}

export interface MovieReviewsResponse {
  id: number;
  page: number;
  results: MovieReview[];
  total_pages: number;
  total_results: number;
}

export interface WatchListMovie extends MovieDetailResponse {
  addedAt: Timestamp;
}
