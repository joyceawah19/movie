"use client";
import { useState, useEffect } from "react";
import { fetchMovies } from "../../redux/movieSlice";
import { useDispatch, useSelector } from "react-redux";

export default function MovieApp() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const { movies, loading, error, totalResults } = useSelector((state) => state.movies);
  
  // OMDB returns 10 results per page
  const totalPages = Math.ceil(totalResults / 10);

  // Trigger fetch on initial load and whenever page or search changes
  useEffect(() => {
    // Use a timeout to debounce search so it doesn't fire on every keystroke
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchMovies({ searchTerm: search, page }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, search, page]);

  const handleChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 when searching
  };

  const nextPage = () => { if (page < totalPages) setPage(prev => prev + 1); };
  const prevPage = () => { if (page > 1) setPage(prev => prev - 1); };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Search Header */}
      <div className="mx-auto mb-8 flex w-full justify-between items-center">
        <p className="text-yellow-600 font-bold">MovieBox</p>
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={handleChange}
          className="w-[40%] p-3 rounded-xl bg-gray-800 border border-gray-700"
        />
        <p className="cursor-pointer">Login</p>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {!loading && movies.map((movie) => (
          <div key={movie.imdbID} className="bg-gray-800 rounded-2xl overflow-hidden hover:scale-105 transition-transform">
            <img 
              src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster"} 
              alt={movie.Title} 
              className="w-full h-72 object-cover" 
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold truncate">{movie.Title}</h2>
              <p className="text-gray-400 text-sm">{movie.Genre?.split(',')[0]}</p>
              <span className="text-yellow-400 font-bold">⭐ {movie.imdbRating}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-6">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className="px-6 py-2 bg-yellow-600 rounded-lg disabled:opacity-30 font-bold"
          >
            Prev
          </button>
          <span className="font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={page === totalPages}
            className="px-6 py-2 bg-yellow-600 rounded-lg disabled:opacity-30 font-bold"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}