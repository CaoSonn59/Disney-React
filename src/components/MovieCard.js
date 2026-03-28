import React from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import "/src/styles/MovieCard.css";

function MovieCard({
  movie,
  movieId,
  collection = "recommended",
  showProgress,
  progress,
  variant = "vertical",
}) {
  const navigate = useNavigate();
  const isHorizontal = variant === "horizontal";

  // Only fetch when there is no movie object
  const docRef =
    !movie && movieId
      ? firebase.firestore().doc(`${collection}/${movieId}`)
      : null;
  const [docData, loading] = useDocumentData(docRef, { idField: "id" });

  const data = movie || docData || {};
  const resolvedId = data.id || movieId;

  const getImageSrc = (img) =>
    typeof img === "string" ? img : img?.default || img;

  const handleClick = () => {
    if (!resolvedId) return;
    navigate(`/movie/${resolvedId}`);

    window.scrollTo(0, 0);
  };

  if (!movie && loading) {
    return (
      <div
        className={`movie-card movie-card-${variant}`}
        style={{ opacity: 0.6 }}
      >
        <div
          className={`movie-card-image-wrapper${
            isHorizontal ? " movie-card-image-horizontal" : ""
          }`}
        >
          <div
            className="movie-card-image"
            style={{ background: "#222", height: "100%" }}
          />
        </div>
        <div className="movie-card-info">
          <div className="movie-card-title">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`movie-card movie-card-${variant}`} onClick={handleClick}>
      <div
        className={`movie-card-image-wrapper${
          isHorizontal ? " movie-card-image-horizontal" : ""
        }`}
      >
        <img
          src={getImageSrc(data.image)}
          alt={data.title}
          className="movie-card-image"
        />
        {showProgress && (
          <div className="movie-card-progress-bar">
            <div
              className="movie-card-progress-bar-inner"
              style={{ width: `${progress || 0}%` }}
            />
          </div>
        )}
      </div>
      <div className="movie-card-info">
        {isHorizontal && data.timeLeft && (
          <div className="movie-card-timeleft">{data.timeLeft}</div>
        )}
        <div className="movie-card-title">{data.title}</div>
        <div className="movie-card-meta">
          {data.rating && (
            <span className="movie-card-rating">{data.rating}</span>
          )}
          {data.year && <span className="movie-card-year">{data.year}</span>}
          <br />
          {data.genres && (
            <span className="movie-card-genres">
              {(data.genres || []).join(", ")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
