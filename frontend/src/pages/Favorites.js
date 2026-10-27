import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "./Results.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  // ✅ Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Load favorites from MongoDB
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/favorites/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setFavorites(data);

        // ✅ ALSO SAVE IN LOCALSTORAGE
        localStorage.setItem(
          `favorites_${user.email}`,
          JSON.stringify(data)
        );
      })
      .catch((err) => console.log(err));

  }, [user]);

  // ❌ If not logged in
  if (!user) {
    return (
      <>
        <Header />

        <div style={{ padding: "20px" }}>
          <h2>My Favorites</h2>
          <p>⚠️ Please Sign In to view your favorites</p>
        </div>

        <Footer />
      </>
    );
  }

  // ✅ Remove favorite
  const removeFavorite = async (id, link) => {
    try {

      // ✅ REMOVE FROM MONGODB
      await fetch(`http://localhost:5000/favorites/${id}`, {
        method: "DELETE",
      });

      // ✅ REMOVE FROM UI
      const updated = favorites.filter(
        (item) => item._id !== id
      );

      setFavorites(updated);

      // ✅ UPDATE LOCALSTORAGE ALSO
      localStorage.setItem(
        `favorites_${user.email}`,
        JSON.stringify(updated)
      );

      showToast("Removed from favorites ❌");

    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Toast
  const showToast = (msg) => {
    const toast = document.createElement("div");

    toast.innerText = msg;
    toast.className = "toast";

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2000);
  };

  return (
    <>
      <Header />

      <div style={{ padding: "20px" }}>
        <h2>My Favorites </h2>

        {favorites.length === 0 ? (
          <p>No favorite products yet </p>
        ) : (
          <div className="products-grid">

            {favorites.map((item, index) => (
              <div className="product-card" key={index}>

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="product-img"
                  />
                )}

                <h3 className="product-title">
                  {item.title}
                </h3>

                <p>
                  <b>Price:</b> {item.price}
                </p>

                <p>
                  <b>Rating:</b> {item.rating}
                </p>

                <p>
                  <b>Source:</b> {item.source}
                </p>

                <div className="btn-group">

                  {/* ⭐ REMOVE */}
                  <button
                    className="star-btn"
                    onClick={() =>
                      removeFavorite(item._id, item.link)
                    }
                  >
                    ★
                  </button>

                  {/* 🌐 WEBSITE */}
                  <button
                    onClick={() => {
                      if (
                        item.link &&
                        item.link !== "#"
                      ) {
                        window.location.href =
                          `/redirect?url=${encodeURIComponent(item.link)}`;
                      } else {
                        alert("Link not available");
                      }
                    }}
                  >
                    Go to Website
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Favorites;