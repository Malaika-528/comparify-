import React from "react";
import "./hero.css";
import BlurText from "./blurtext"; // animation wala component
import { useNavigate } from "react-router-dom"; // navigation hook

const Hero = () => {
  const navigate = useNavigate(); // hook initialize

  const handleGetStarted = () => {
    navigate("/category"); // user ko Category page pe bheje
  };

  return (
    <section
      className="hero-section"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          <BlurText text="Compare and Save Big." delay={0.05}/>
        </h1>

        <p className="hero-subtitle">
          <BlurText text="We scan thousands of stores so you don’t have to." delay={0.03}/>
        </p>

        <button className="hero-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;
