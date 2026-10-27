import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/comparify.jpg";

function Header() {
  const [active, setActive] = useState("home");
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isResultsPage = location.pathname === "/results";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [location]);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Comparify Logo" className="logo" />
        <h1 className="site-name">Comparify</h1>
      </div>

      <nav className="nav">

        {isResultsPage && (
          <button
            onClick={() => { setActive("back"); navigate(-1); }}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              marginRight: "20px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.3s",
              padding: "0",
              fontFamily: "Poppins, sans-serif"
            }}
            onMouseEnter={(e) => e.target.style.color = "#155fa0"}
            onMouseLeave={(e) => e.target.style.color = "white"}
          >
            ← Back to Search
          </button>
        )}

        <a
          href="/#how-it-works"
          onClick={() => setActive("how")}
          className={active === "how" ? "active-link" : ""}
        >
          How It Works
        </a>

        <Link
          to="/favorites"
          onClick={() => setActive("favorites")}
          className={active === "favorites" ? "active-link" : ""}
        >
          Favorites
        </Link>

        {user ? (
          <>
            <span style={{ color: "white", marginRight: "20px", fontSize: "14px" }}>
              👋 {user.name || user.email}
            </span>
            <button
              onClick={handleSignOut}
              style={{
                background: "transparent",
                border: "1px solid white",
                color: "white",
                padding: "6px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: "Poppins, sans-serif",
                transition: "0.3s"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "white";
                e.target.style.color = "#0b132b";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "white";
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/signin"
              onClick={() => setActive("signin")}
              className={active === "signin" ? "active-link" : ""}
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              onClick={() => setActive("signup")}
              className={active === "signup" ? "active-link" : ""}
            >
              Sign Up
            </Link>
          </>
        )}

      </nav>
    </header>
  );
}

export default Header;