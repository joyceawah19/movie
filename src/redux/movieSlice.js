import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY = "4d23298b";

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async ({ searchTerm, page = 1 }) => {
    // If no search term, we use a default one to show movies on load
    const query = searchTerm.trim() === "" ? "movie" : searchTerm;
    
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${page}`
    );
    const data = await res.json();

    if (data.Response === "False") {
      throw new Error(data.Error || "No results found");
    }

    // Fetch full details for each movie to get the Rating/Genre
    const detailedMovies = await Promise.all(
      (data.Search || []).map(async (movie) => {
        const res2 = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
        );
        return await res2.json();
      })
    );

    return { 
      movies: detailedMovies, 
      totalResults: parseInt(data.totalResults) || 0 
    };
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    loading: false,
    error: null,
    totalResults: 0,
  },
  reducers: {
    clearMovies: (state) => {
      state.movies = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.movies;
        state.totalResults = action.payload.totalResults;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.movies = [];
        state.totalResults = 0;
      });
  },
});

export const { clearMovies } = movieSlice.actions;
export default movieSlice.reducer;