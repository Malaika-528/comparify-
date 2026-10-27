import React, { useState } from "react";
import "./SignIn.css";

import Header from "../components/header";
import Footer from "../components/footer";
import BlurText from "../components/blurtext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.message === "Login successful") {
        toast.success(data.message);

        // ✅ SAVE USER (IMPORTANT)
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: email,
          })
        );

        // redirect after 2 sec
        setTimeout(() => {
          navigate("/category");
        }, 2000);

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error("Server error. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Header />

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="signin-container">
        <div className="signin-left">
          <h1>
            <BlurText text="Compare and save big." delay={0.03} />
          </h1>
          <p>
            <BlurText text="Unlock the best deals." delay={0.05} />
          </p>
        </div>

        <div className="signin-right">
          <h2>Sign In</h2>
          <p className="welcome-text">Welcome back, savvy shopper!</p>

          <form onSubmit={handleSignIn}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="password-input"
              />

              <button
                type="button"
                className="eye-icon"
                onClick={togglePasswordVisibility}
              >
                {/* Eye icon placeholder */}
              </button>
            </div>

            <button type="submit" className="signin-btn">
              Sign In
            </button>
          </form>

          <p className="signup-text">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SignIn;