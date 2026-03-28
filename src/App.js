import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/app.css";

import Navbar from "./components/Navbar.js";
import HeroCarousel from "./components/HeroCarousel.js";
import CategoryRow from "./components/CategoryRow";
import RowSection from "./components/RowSection";
import MovieDetail from "./components/MovieDetail";
import Watchlist from "./components/Watchlist";
import recommended from "./data/recommended";
import continueWatching from "./data/continueWatching";
import FooterNav from "./components/FooterNav";
import { WatchlistProvider } from "./contexts/WatchlistContext";
import Cards from "./components/Cards";

function App() {
  // Ask help from ChatGPT - Build a progress map for continue watching
  const progressMap = Object.fromEntries(
    continueWatching.map((item) => [item.id, item.progress])
  );
  //-------
  const HomePage = () => (
    <main>
      <HeroCarousel />
      <CategoryRow />
      <RowSection title="Recommended For You" movies={recommended} />
      <RowSection
        title="Continue Watching"
        movies={continueWatching}
        showProgress={true}
        progressMap={progressMap}
      />
    </main>
  );

  return (
    <WatchlistProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/movie/:movieId" element={<MovieDetail />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route
              path="/movies"
              element={<div>Movies Page (Coming Soon)</div>}
            />
            <Route
              path="/series"
              element={<div>Series Page (Coming Soon)</div>}
            />
            <Route
              path="/originals"
              element={<div>Originals Page (Coming Soon)</div>}
            />
          </Routes>
          <FooterNav />
        </div>
      </Router>
    </WatchlistProvider>
  );
}

export default App;
