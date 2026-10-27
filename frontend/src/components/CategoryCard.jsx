import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ image, title }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    if (title === "Bags" || title === "Clothes" || title === "Footwear") {
      navigate("/upload", { state: { category: title } }); // ← category pass
    } else if (title === "Makeup" || title === "Electronics" || title === "Home Decor") {
      navigate("/description", { state: { category: title } }); // ← category pass
    }
  };

  return (
    <div className="category-card" onClick={handleClick}>
      <img src={image} alt={title} className="category-img" />
      <h3 className="category-title">{title}</h3>
    </div>
  );
};

export default CategoryCard;