"use client";
import { useState, useEffect } from "react";
import { fetchMovies } from "../../redux/movieSlice";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

export default function MovieApp() {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  const { movies, loading, error } = useSelector(
    (state) => state.movies
  );

  // 🔥 trending on load
  useEffect(() => {
    dispatch(fetchMovies("avengers"));
  }, [dispatch]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    dispatch(fetchMovies(value));
  };

  // remove duplicates
  const uniqueMovies = movies?.filter(
    (movie, index, self) =>
      index === self.findIndex((m) => m.imdbID === movie.imdbID)
  );

  // 🔥 sort by rating
  const sortedMovies = uniqueMovies
    ?.filter((movie) => movie.imdbRating !== "N/A")
    ?.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Search */}
      <div className="mx-auto mb-8 flex  w-full justify-between items-center text-center">
        <p className="lg:text-lg text-[10px] text-yellow-600 font-bold" >MovieBox </p>
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={handleChange}
          className="w-[40%] p-3 rounded-xl text-[10px] lg:text-lg bg-gray-800 border border-gray-700"
        />
        <p className="lg:text-lg text-[10px] font-semibold cursor-not-allowed hover:blur-[1px] " >Login</p>
        {/* <Image scr={"/vercel.svg"} height={50} width={50} className={"border border-black"} /> */}
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center">{error}</p>}

      {/* Movies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedMovies?.map((movie, index) => (
          <div
            key={`${movie.imdbID}-${index}`}
            className="bg-gray-800 rounded-2xl overflow-hidden"
          >
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-full h-72 object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold">
                {movie.Title}
              </h2>

              <p className="text-gray-400">{movie.Genre}</p>

              <span className="text-yellow-400 font-bold">
                ⭐ {movie.imdbRating}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!loading && sortedMovies?.length === 0 && (
        <p className="text-center mt-10">No movies found...</p>
      )}
    </div>
  );
}