import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/header";
import Hero from "./components/hero";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/footer";
import Category from "./components/Category";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/Signup";  
import UploadProduct from "./pages/UploadProduct";
import DescriptionOnly from "./pages/DescriptionOnly";
import Results from "./pages/Results";
import Favorites from "./pages/Favorites";   // ✅ ADD THIS

import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>

          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <main>
                  <Hero />
                  <HowItWorks />
                </main>
                <Footer />
              </>
            }
          />

          {/* Category Page */}
          <Route path="/category" element={<Category />} />

          {/* Sign In Page */}
          <Route path="/signin" element={<SignIn />} />

          {/* Sign Up Page */}
          <Route path="/signup" element={<SignUp />} />

          {/* Upload Product Page */}
          <Route path="/upload" element={<UploadProduct />} />

          {/* DescriptionOnly page */}
          <Route path="/description" element={<DescriptionOnly />} />

          {/* Results Page */}
          <Route path="/results" element={<Results />} />

        

          {/* ✅ FAVORITES PAGE */}
          <Route path="/favorites" element={<Favorites />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;