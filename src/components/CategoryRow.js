import React from "react";
import "/src/styles/CategoryRow.css";
import brands from "/src/data/brands.js";

function CategoryRow() {
  const localBrands = brands;

  const getLogoSrc = (logo) =>
    typeof logo === "string" ? logo : logo?.default || logo;

  return (
    <section className="dplus-brands">
      <div className="dplus-brands-row">
        {localBrands.map((b) => (
          <button
            key={b.name}
            className="dplus-brand-card"
            style={{ "--brand-bg": b.bg }}
            title={b.name}
            aria-label={b.name}
            onClick={() => console.log(`Clicked ${b.name}`)}
          >
            <img src={getLogoSrc(b.logo)} alt="" aria-hidden="true" />
            <span className="sr-only">{b.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategoryRow;
