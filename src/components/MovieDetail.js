import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { useWatchlist } from "../contexts/WatchlistContext";
import "/src/styles/MovieDetail.css";

function MovieDetail() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [movie, setMovie] = useState(null);
  const [activeTab, setActiveTab] = useState("suggested");

  // Firestore document refs (compat)
  const recDocRef = firebase.firestore().doc(`recommended/${movieId}`);
  const contDocRef = firebase.firestore().doc(`continueWatching/${movieId}`);

  const [recDoc, recLoading] = useDocumentData(recDocRef, { idField: "id" });
  const [contDoc, contLoading] = useDocumentData(contDocRef, { idField: "id" });

  // Fetch lists for suggestions from Firestore
  const recListRef = firebase.firestore().collection("recommended");
  const contListRef = firebase.firestore().collection("continueWatching");
  const [recListDocs = [], recListLoading] = useCollectionData(recListRef, {
    idField: "id",
  });
  const [contListDocs = [], contListLoading] = useCollectionData(contListRef, {
    idField: "id",
  });

  // Firestore watchlist state for this movie
  const userId = "guest";
  const watchlistDocRef = firebase
    .firestore()
    .doc(`watchlist/${userId}_${movieId}`);
  const [watchlistDoc] = useDocumentData(watchlistDocRef);

  useEffect(() => {
    // Only use Firestore data
    if (recDoc || contDoc) {
      setMovie(recDoc || contDoc);
    } else if (!recLoading && !contLoading) {
      // Not found in either collection
      setMovie(null);
    }

    // Scroll to the top of the page when the component mounts / movie changes    window.scrollTo(0, 0);
  }, [movieId, recDoc, contDoc, recLoading, contLoading]);

  // Calculate a random suggested list (excluding the current movie) from Firestore
  const suggestedMovies = useMemo(() => {
    const pool = [...recListDocs, ...contListDocs].filter(
      (m) => m.id !== movieId
    );
    // Fisher-Yates shuffle
    const arr = pool.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 8);
  }, [movieId, recListDocs, contListDocs]);

  if ((recLoading || contLoading) && !movie) {
    return <div className="movie-detail-loading">Loading...</div>;
  }

  if (!movie) {
    return <div className="movie-detail-loading">Not found</div>;
  }

  const handlePlay = () => {
    console.log("Playing movie:", movie.title);
  };

  const handleTrailer = () => {
    console.log("Playing trailer for:", movie.title);
  };

  const handleAddToList = async () => {
    if (!movie) return;
    try {
      if (watchlistDoc) {
        // Remove from Firestore and optionally local context
        try {
          removeFromWatchlist(movie.id);
        } catch (_) {}
        await firebase
          .firestore()
          .collection("watchlist")
          .doc(`${userId}_${movie.id}`)
          .delete();
      } else {
        // Add to Firestore and optionally local context
        try {
          addToWatchlist(movie);
        } catch (_) {}
        await firebase
          .firestore()
          .collection("watchlist")
          .doc(`${userId}_${movie.id}`)
          .set({ userId, ...movie }, { merge: true });
      }
    } catch (e) {
      console.error("Failed to toggle watchlist:", e?.message || e);
    }
  };

  const handleMovieClick = (clickedMovieId) => {
    navigate(`/movie/${clickedMovieId}`);
    window.scrollTo(0, 0);
  };

  return (
    <div
      className="movie-detail movie-detail-fullscreen"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${movie.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Hero Section */}
      <div className="movie-detail-hero">
        <div className="movie-detail-container">
          <div className="movie-detail-content">
            <div className="movie-detail-header">
              <h1 className="movie-detail-title">{movie.title}</h1>

              <div className="movie-detail-badges">
                <span className="movie-badge">{movie.rating}</span>
                <span className="movie-badge">HD</span>
                <span className="movie-badge">CC</span>
                <span className="movie-badge">AD</span>
              </div>

              <div className="movie-detail-meta">
                <span>{movie.year}</span>
                <span>•</span>
                <span>2h 21m</span>
                <span>•</span>
                <span>{(movie.genres || []).join(", ")}</span>
              </div>

              <p className="movie-detail-synopsis">
                {movie.synopsis ||
                  `${movie.title} is a captivating story that will take you on an unforgettable journey.`}
              </p>

              <div className="movie-detail-actions">
                <button className="btn-play" onClick={handlePlay}>
                  <span className="play-icon">▶</span>
                  PLAY
                </button>
                <button className="btn-trailer" onClick={handleTrailer}>
                  TRAILER
                </button>
                <button
                  className={`btn-add ${watchlistDoc ? "in-watchlist" : ""}`}
                  onClick={handleAddToList}
                >
                  <span className="add-icon">{watchlistDoc ? "✓" : "+"}</span>
                </button>
              </div>
            </div>

            <div className="movie-detail-tabs">
              <button
                className={`tab ${activeTab === "suggested" ? "active" : ""}`}
                onClick={() => setActiveTab("suggested")}
              >
                SUGGESTED
              </button>
              <button
                className={`tab ${activeTab === "extras" ? "active" : ""}`}
                onClick={() => setActiveTab("extras")}
              >
                EXTRAS
              </button>
              <button
                className={`tab ${activeTab === "details" ? "active" : ""}`}
                onClick={() => setActiveTab("details")}
              >
                DETAILS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="movie-detail-content-section">
        <div className="movie-detail-container">
          {activeTab === "suggested" && (
            <div className="suggested-content">
              <div className="suggested-grid">
                {suggestedMovies.map((suggestedMovie) => (
                  <div
                    key={suggestedMovie.id}
                    className="suggested-item"
                    onClick={() => handleMovieClick(suggestedMovie.id)}
                  >
                    <img
                      src={suggestedMovie.image}
                      alt={suggestedMovie.title}
                      className="suggested-image"
                    />
                    <div className="suggested-info">
                      <h4>{suggestedMovie.title}</h4>
                      <p>
                        {suggestedMovie.year} •{" "}
                        {(suggestedMovie.genres || []).join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "extras" && (
            <div className="extras-content">
              <p>Extras content coming soon...</p>
            </div>
          )}

          {activeTab === "details" && (
            <div className="details-content">
              <div className="detail-item">
                <h4>Cast</h4>
                <p>Emma Watson, Dan Stevens, Luke Evans, Josh Gad</p>
              </div>
              <div className="detail-item">
                <h4>Director</h4>
                <p>Bill Condon</p>
              </div>
              <div className="detail-item">
                <h4>Genre</h4>
                <p>{(movie.genres || []).join(", ")}</p>
              </div>
              <div className="detail-item">
                <h4>Release Date</h4>
                <p>{movie.year}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
