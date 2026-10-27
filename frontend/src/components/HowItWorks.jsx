import React from "react";
import { FiSearch } from "react-icons/fi"; // Search icon
import { BiGitCompare } from "react-icons/bi"; // Compare icon
import { FiDollarSign } from "react-icons/fi"; // Money/savings icon

const HowItWorks = () => {
  return (
    <section className="how" id="how-it-works">
      <h2>How It Works</h2>
      <p>
        Finding the best deals is simple with SmartShop. Follow these three easy
        steps to start saving money on your favorite products today.
      </p>

      <div className="steps">
        <div className="step">
          <div className="step-icon">
            <FiSearch size={35} />
          </div>
          <h3>Search for a Product</h3>
          <p>
            Enter the name of a product you're looking for and instantly see
            price listings.
          </p>
        </div>

        <div className="step">
          <div className="step-icon">
            <BiGitCompare size={35} />
          </div>
          <h3>Compare Prices</h3>
          <p>
            Instantly see prices from thousands of retailers, all in one place.
          </p>
        </div>

        <div className="step">
          <div className="step-icon">
            <FiDollarSign size={35} />
          </div>
          <h3>Save Money</h3>
          <p>
            Once you've found the best offer, go directly to the retailer and
            buy at the lowest price.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;