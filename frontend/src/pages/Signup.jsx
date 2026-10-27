import React, { useState } from "react";
import "./SignUp.css";

import Header from "../components/header";
import Footer from "../components/footer";
import BlurText from "../components/blurtext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.message === "Signup successful") {
        toast.success("Account created successfully!");

        // ✅ AUTO LOGIN (IMPORTANT)
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: name,
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

  return (
    <>
      <Header />

      <ToastContainer position="top-left" autoClose={3000} />

      <div className="signup-container">

        <div className="signup-left">
          <h1>
            <BlurText text="Compare and save big." delay={0.03} />
          </h1>
          <p>
            <BlurText text="Unlock the best deals." delay={0.05} />
          </p>
        </div>

        <div className="signup-right">
          <h2>Sign Up</h2>
          <p className="welcome-text">Create your smart shopping account</p>

          <form onSubmit={handleSignUp}>
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
                className="password-input"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
              </button>
            </div>

            <label>Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="password-input"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-icon"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
              </button>
            </div>

            <button type="submit" className="signup-btn">
              Create Account
            </button>
          </form>

          <p className="signin-text">
            Already have an account? <a href="/signin">Sign In</a>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SignUp;