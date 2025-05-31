import axios from 'axios';
import type {Movie} from '../types/movie';

axios.defaults.baseURL = 'https://api.themoviedb.org/';

const TOKEN: string = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZTJhZTczODllMzk1MTRlNGQzNjA5NWVhMTYzNzY0YyIsIm5iZiI6MTc0ODAyODMwNy41ODcwMDAxLCJzdWIiOiI2ODMwY2I5MzFkOWM3OTc4MzZhODYwN2QiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.fBYgNheBU3Qt8z93hIsbR6aXqULljJKSVhR01E8aBWI'

interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const url = `3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US`;

  const config = {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  };
    try {
       const response = await axios.get<MovieSearchResponse>(url, config);

         return response.data.results || [];

    } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};