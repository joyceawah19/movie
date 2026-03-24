// src/redux/movieSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const API_KEY = "4d23298b";

// Fetch movies from API
// export const fetchMovies = createAsyncThunk(
//   "movies/fetchMovies",
//   async (searchTerm) => {
//     const res = await fetch(
//       `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`
//     );

//     const data = await res.json();
//     return data.Search; // array of movies
//   }
// );



export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (search) => {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`
    );
    const data = await res.json();

    // 🔥 fetch full details (includes imdbRating)
    const detailedMovies = await Promise.all(
      (data.Search || []).map(async (movie) => {
        const res2 = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
        );
        return await res2.json();
      })
    );

    return detailedMovies;
  }
);



const movieSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch movies";
      });
  },
});

export default movieSlice.reducer;