export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
}

export interface MovieResponse {
  results: Movie[];
  total_results: number;
  total_pages: number;
  page: number;
}
