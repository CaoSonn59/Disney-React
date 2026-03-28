import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { useCollectionData } from "react-firebase-hooks/firestore";
import localSlides from "/src/data/slides.js";
import "/src/styles/HeroCarousel.css";

function HeroCarousel() {
  const navigate = useNavigate();

  const slidesRef = firebase.firestore().collection("slides");
  const [slidesDocs = [], loading] = useCollectionData(slidesRef, {
    idField: "id",
  });

  const [resolvedSlides, setResolvedSlides] = useState([]);
  // ask CHATGPT for help
  useEffect(() => {
    const toUrl = async (image) => {
      if (!image) return image;
      if (/^https?:\/\//i.test(image)) return image;
      try {
        if (image.startsWith("gs://")) {
          return await firebase.storage().refFromURL(image).getDownloadURL();
        }
        return await firebase.storage().ref(image).getDownloadURL();
      } catch {
        return image;
      }
    };

    const resolveAll = async () => {
      const base =
        slidesDocs && slidesDocs.length > 0 ? slidesDocs : localSlides;
      const mapped = await Promise.all(
        base.map(async (s) => ({
          ...s,
          image: await toUrl(s.image),
        }))
      );
      setResolvedSlides(mapped);
      setIndex(0);
    };

    resolveAll();
  }, [slidesDocs]);

  // When rendering, use resolvedSlides (if available) instead of slides
  const slides = resolvedSlides.length
    ? resolvedSlides
    : slidesDocs?.length
    ? slidesDocs
    : localSlides;
  const [index, setIndex] = useState(0);
  const count = slides.length || 1;

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + count) % count),
    [count]
  );
  const goTo = (i) => setIndex(i);

  // Reset index when slides list changes
  useEffect(() => {
    setIndex(0);
  }, [count]);

  // optional auto-advance
  useEffect(() => {
    const t = setInterval(next, 8000);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[index] || {};

  const handleSlideClick = () => {
    if (!slide?.id) return;
    navigate(`/movie/${slide.id}`);
    window.scrollTo(0, 0);
  };

  const customSubtitles = {
    "the simpsons": "Catch up on the Series",
    "the office": "All seasons now streaming",
    "washington black": "New series now streaming",
  };

  const subtitle = customSubtitles[slide.id] || slide.subtitle;

  return (
    <section className="hero-carousel">
      <div className="hero-carousel-wrapper">
        <button
          aria-label="Previous slide"
          className="hero-carousel-arrow hero-carousel-arrow-left"
          onClick={prev}
        >
          ◀
        </button>
        <figure className="hero-carousel-slide" onClick={handleSlideClick}>
          <div className="hero-carousel-overlay" />
          <img
            src={slide.image}
            alt={slide.title}
            className="hero-carousel-image"
          />
          <figcaption className="hero-carousel-caption">
            <h1>{slide.title || (loading ? "Loading..." : "Featured")}</h1>
            {subtitle && (
              <div className="hero-carousel-subtitle">{subtitle}</div>
            )}
            <div className="hero-carousel-meta">
              {slide.rating && (
                <span className="hero-carousel-rating">{slide.rating}</span>
              )}
              {slide.year && (
                <span className="hero-carousel-year">{slide.year}</span>
              )}
              {slide.genres && (
                <>
                  <span className="hero-carousel-dotsep">•</span>
                  <span className="hero-carousel-genres">
                    {(slide.genres || []).join(", ")}
                  </span>
                </>
              )}
            </div>
          </figcaption>
        </figure>
        <button
          aria-label="Next slide"
          className="hero-carousel-arrow hero-carousel-arrow-right"
          onClick={next}
        >
          ▶
        </button>
      </div>
      <div
        className="hero-carousel-dots"
        role="tablist"
        aria-label="Select slide"
      >
        {slides.map((s, i) => (
          <button
            key={s.id || i}
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to slide: ${s.title || i + 1}`}
            className={`hero-carousel-dot ${i === index ? "is-active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroCarousel;
