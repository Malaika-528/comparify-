import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const products = location.state?.products || [];
  const [sortBy, setSortBy] = useState("default");
  const [showPKR, setShowPKR] = useState(false);



  const [favorites, setFavorites] = useState([]);
const [user, setUser] = useState(null);

useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  setUser(storedUser);
}, []);

useEffect(() => {
  if (!user) return;
  fetch(`http://localhost:5000/favorites/${user.email}`)
    .then((res) => res.json())
    .then((data) => setFavorites(data))
    .catch((err) => console.log(err));
}, [user]);

const isFavorite = (product) => {
  return favorites.some((item) => item.link === product.link);
};

const showToast = (message) => {
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.className = "toast";
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 2000);
};

const toggleFavorite = async (product) => {
  if (!user) {
    showToast("⚠️ Please Sign In first!");
    return;
  }
  try {
    const existing = favorites.find((item) => item.link === product.link);
    if (existing) {
      await fetch(`http://localhost:5000/favorites/${existing._id}`, { method: "DELETE" });
      const updated = favorites.filter((item) => item.link !== product.link);
      setFavorites(updated);
      showToast("Removed from favorites ❌");
    } else {
      const response = await fetch("http://localhost:5000/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          title: product.title,
          price: product.price,
          rating: product.rating,
          image: product.thumbnail,
          link: product.link,
          source: product.source,
        }),
      });
      const data = await response.json();
      setFavorites([...favorites, data]);
      showToast("Added to favorites ⭐");
    }
  } catch (error) {
    console.log(error);
  }
};




  const renderStars = (rating) => {
    if (!rating) return null;
    const num = parseFloat(rating);
    const full = Math.floor(num);
    const half = num % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <span className="stars">
        {"★".repeat(full)}
        {half ? "½" : ""}
        {"☆".repeat(empty)}
        <span className="rating-num">{num.toFixed(1)}</span>
      </span>
    );
  };

  const sorted = [...products].sort((a, b) => {
    if (sortBy === "price-low") {
      const pa = parseFloat(a.price?.replace(/[^0-9.]/g, "")) || 9999;
      const pb = parseFloat(b.price?.replace(/[^0-9.]/g, "")) || 9999;
      return pa - pb;
    }
    if (sortBy === "price-high") {
      const pa = parseFloat(a.price?.replace(/[^0-9.]/g, "")) || 0;
      const pb = parseFloat(b.price?.replace(/[^0-9.]/g, "")) || 0;
      return pb - pa;
    }
    if (sortBy === "rating") {
      const ra = parseFloat(a.rating) || 0;
      const rb = parseFloat(b.rating) || 0;
      return rb - ra;
    }
    return 0;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --bg: #ecedf3;
          --card: #0b132b;
          --card-hover: #1e1e1e;
          --accent: #f0b429;
          --accent2: #e85d4a;
          --text: #0b132b;
          --muted: #888;
          --border: #2a2a2a;
        }

        body { background: var(--bg); }

        .results-page {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          padding-bottom: 80px;
        }

        /* TOP BAR */
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 48px;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          background: rgba(13,13,13,0.95);
          backdrop-filter: blur(12px);
          z-index: 10;
        }

        .logo {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 900;
          color: var(--accent);
          letter-spacing: -1px;
          cursor: pointer;
        }

        .back-btn {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--muted);
          padding: 8px 20px;
          border-radius: 100px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          transition: all 0.2s;
        }
        .back-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        /* HERO SECTION */
        .hero {
          padding: 60px 48px 40px;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(240,180,41,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-label {
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 12px;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 900;
          line-height: 1.05;
          margin-bottom: 16px;
        }

        .hero-title span {
          color: var(--accent);
        }

        .hero-sub {
          color: var(--muted);
          font-size: 15px;
          font-weight: 300;
        }

        /* CONTROLS */
        .controls {
          padding: 0 48px 32px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .sort-label {
          font-size: 13px;
          color: var(--muted);
          margin-right: 4px;
        }

        .sort-btn {
          background: var(--card);
          border: 1px solid var(--border);
          color: var(--muted);
          padding: 8px 16px;
          border-radius: 100px;
          cursor: pointer;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .sort-btn:hover, .sort-btn.active {
          border-color: var(--accent);
          color: var(--accent);
          background: rgba(240,180,41,0.08);
        }

        .count-badge {
          margin-left: auto;
          background: var(--card);
          border: 1px solid var(--border);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 13px;
          color: var(--muted);
        }
        .count-badge span { color: var(--accent); font-weight: 500; }

        /* GRID */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          padding: 0 48px;
        }

        /* CARD */
        .product-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: fadeUp 0.5s ease both;
          display: flex;
          flex-direction: column;
        }
        .product-card:hover {
          transform: translateY(-6px);
          border-color: rgba(240,180,41,0.3);
          background: var(--card-hover);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-img-wrap {
          position: relative;
          height: 200px;
          background: #1a1a1a;
          overflow: hidden;
        }
        .card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 16px;
          transition: transform 0.4s ease;
        }
        .product-card:hover .card-img-wrap img {
          transform: scale(1.06);
        }

        .source-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(13,13,13,0.85);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border);
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          color: var(--muted);
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .no-img {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          opacity: 0.2;
        }

        .card-body {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .card-title {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.5;
          color: #f5f5f0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .stars {
          color: var(--accent);
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .rating-num {
          color: var(--muted);
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
        }

        .reviews-count {
          font-size: 12px;
          color: var(--muted);
          margin-top: -6px;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }

        .price {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--accent);
        }
        .price.no-price {
          font-size: 14px;
          color: var(--muted);
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
        }

        .visit-btn {
          background: var(--accent);
          color: #0d0d0d;
          border: none;
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-block;
        }
        .visit-btn:hover {
          background: #f5c842;
          transform: scale(1.04);
        }

        /* EMPTY STATE */
        .empty-state {
          text-align: center;
          padding: 100px 48px;
        }
        .empty-icon { font-size: 72px; opacity: 0.3; margin-bottom: 24px; }
        .empty-state h3 {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          margin-bottom: 12px;
        }
        .empty-state p { color: var(--muted); font-size: 15px; }
        .try-again-btn {
          margin-top: 32px;
          background: var(--accent);
          color: #0d0d0d;
          border: none;
          padding: 12px 32px;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }

        @media (max-width: 768px) {
          .top-bar, .hero, .controls, .products-grid { padding-left: 20px; padding-right: 20px; }
          .products-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
        }
        @media (max-width: 480px) {
          .products-grid { grid-template-columns: 1fr; }
        }
          .toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 12px 24px;
  border-radius: 100px;
  font-size: 14px;
  z-index: 9999;
}
      `}</style>

      <div className="results-page">
        <Header />
        

        {/* HERO */}
        <div className="hero">
          <p className="hero-label">Search Results</p>
          <h1 className="hero-title">
            We found <span>{products.length}</span><br />
            matches for you
          </h1>
          <p className="hero-sub">Compare prices across multiple stores and grab the best deal.</p>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No results found</h3>
            <p>Try a different description or image.</p>
            <button className="try-again-btn" onClick={() => navigate(-1)}>Try Again</button>
          </div>
        ) : (
          <>
            {/* CONTROLS */}
            <div className="controls">
              <span className="sort-label">Sort by:</span>
              {["default", "price-low", "price-high", "rating"].map(opt => (
                <button
                  key={opt}
                  className={`sort-btn ${sortBy === opt ? "active" : ""}`}
                  onClick={() => setSortBy(opt)}
                >
                  {opt === "default" && "Default"}
                  {opt === "price-low" && "Price: Low to High"}
                  {opt === "price-high" && "Price: High to Low"}
                  {opt === "rating" && "⭐ Top Rated"}
                </button>
              ))}



              {/* ← YEH NAYA BUTTON ADD KIYA */}
  <button
  className={`sort-btn ${showPKR ? "active" : ""}`}
  onClick={() => setShowPKR(!showPKR)}
>
  {showPKR ? "Show in USD" : "Show in PKR"}
</button>
              <div className="count-badge"><span>{products.length}</span> results</div>
            </div>

            {/* GRID */}
            <div className="products-grid">
              {sorted.map((product, i) => (
                <div
                  className="product-card"
                  key={i}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="card-img-wrap">
                    {product.thumbnail
                      ? <img src={product.thumbnail} alt={product.title} />
                      : <div className="no-img">🛍️</div>
                    }
                    {product.source && (
                      <span className="source-badge">{product.source}</span>
                    )}
                  </div>

                  <div className="card-body">
                    <p className="card-title">{product.title || "Product"}</p>

                    {product.rating && (
                      <>
                        {renderStars(product.rating)}
                        {product.reviews && (
                          <p className="reviews-count">{product.reviews} reviews</p>
                        )}
                      </>
                    )}

                    <div className="card-footer">
                      {product.price
                        ? <span className="price">{showPKR && product.pricePKR ? product.pricePKR : product.price}</span>
                        : <span className="price no-price">Price N/A</span>
                      }
                      <div style={{display:"flex", gap:"8px", alignItems:"center"}}>
    <button
      onClick={() => toggleFavorite(product)}
      style={{background:"transparent", border:"none", fontSize:"22px", cursor:"pointer", color: isFavorite(product) ? "#f0b429" : "#888"}}
    >
      {isFavorite(product) ? "★" : "☆"}
    </button> </div>

                      
                      {product.link && (
                        <a
                          className="visit-btn"
                          href={product.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Visit 
                        </a>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Results;