import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useWatchlist } from "../contexts/WatchlistContext";
import MovieCard from "./MovieCard";
import "/src/styles/Watchlist.css";

function Watchlist() {
  const { removeFromWatchlist } = useWatchlist();
  const navigate = useNavigate();

  // Mock userId for now (can be replaced with real auth later)
  const userId = "guest";
  const watchlistRef = firebase
    .firestore()
    .collection("watchlist")
    .where("userId", "==", userId);
  const [remoteItems = [], loading] = useCollectionData(watchlistRef, {
    idField: "_docId",
  });

  const items = remoteItems; // Only Firebase data

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    window.scrollTo(0, 0);
  };

  const handleRemoveFromWatchlist = async (e, movieId) => {
    e.stopPropagation();
    // Optional: update local context if used elsewhere
    try {
      removeFromWatchlist(movieId);
    } catch (_) {}
    try {
      await firebase
        .firestore()
        .collection("watchlist")
        .doc(`${userId}_${movieId}`)
        .delete();
    } catch (_) {}
  };

  if (loading) {
    return (
      <div className="watchlist-container">
        <div className="watchlist-empty">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="watchlist-container">
        <div className="watchlist-empty">
          <h1>Your Watchlist</h1>
          <p>Your watchlist is empty. Start adding movies to see them here!</p>
          <button className="btn-browse" onClick={() => navigate("/")}>
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <div className="watchlist-header">
        <h1>Your Watchlist</h1>
        <p>
          {items.length} {items.length === 1 ? "movie" : "movies"} in your list
        </p>
      </div>

      <div className="watchlist-grid">
        {items.map((movie) => (
          <div key={movie.id} className="watchlist-item">
            <div
              className="watchlist-movie-card"
              onClick={() => handleMovieClick(movie.id)}
            >
              <MovieCard movie={movie} />
            </div>
            <button
              className="btn-remove"
              onClick={(e) => handleRemoveFromWatchlist(e, movie.id)}
              aria-label={`Remove ${movie.title} from watchlist`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Watchlist;
