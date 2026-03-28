import React from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import MovieCard from "/src/components/MovieCard.js";
import "../styles/RowSection.css";

function RowSection({ title, movies, showProgress, progressMap, collection }) {
  // Determine collection automatically if not provided
  const effectiveCollection =
    collection ||
    (title?.toLowerCase().includes("continue")
      ? "continueWatching"
      : "recommended");
  const colRef = firebase.firestore().collection(effectiveCollection);
  const [docs = [], loading, error] = useCollectionData(colRef, {
    idField: "id",
  });

  const list = docs;

  // Use horizontal for Continue Watching, vertical for others
  const variant = title.toLowerCase().includes("continue")
    ? "horizontal"
    : "vertical";

  return (
    <section className="row-section">
      <h2 className="row-section-title">{title}</h2>
      <div className="row-section-row">
        {loading && (
          <div style={{ color: "#fff", opacity: 0.8 }}>Loading...</div>
        )}
        {error && <div style={{ color: "#f66" }}>Error: {error.message}</div>}
        {list.map((movie, idx) => (
          <MovieCard
            key={movie.id || movie.title || idx}
            movie={movie}
            collection={effectiveCollection}
            showProgress={showProgress}
            progress={progressMap ? progressMap[movie.id] : undefined}
            variant={variant}
          />
        ))}
      </div>
    </section>
  );
}

export default RowSection;
