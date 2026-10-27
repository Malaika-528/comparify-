import React from "react";
import "./Category.css";
import CategoryCard from "./CategoryCard";
import Header from "./header";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";

// Import images
import bags from "../assets/bags.jpg";
import clothes from "../assets/clothes.jpg";
import makeup from "../assets/makeup.jpg";
import electronics from "../assets/electronics.jpg";
import footwear from "../assets/Footwear.jpg";
import decor from "../assets/decor.jpg";

const Category = () => {

  const navigate = useNavigate();

  const categories = [
    { title: "Bags", image: bags },
    { title: "Clothes", image: clothes },
    { title: "Makeup", image: makeup },
    { title: "Electronics", image: electronics },
    { title: "Footwear", image: footwear },
    { title: "Home Decor", image: decor },
  ];

  // ✅ Category ke hisab se page decide karo
  const handleCategoryClick = (title) => {
    console.log("Category clicked:", title); // Debug
    
    // Pehli 3 categories: Image + Description dono
    const imageAndDescCategories = ["Bags", "Clothes", "Footwear"];
    // Aakhri 3 categories: Sirf Description
    const onlyDescCategories = ["Electronics", "Makeup", "Home Decor"];
    
    if (imageAndDescCategories.includes(title)) {
      // Upload page (Image + Description dono)
      navigate("/upload", { state: { category: title } });
    } 
    else if (onlyDescCategories.includes(title)) {
      // Description only page - ✅ SAHI PATH
      navigate("/description", { state: { category: title } });
    }
  };

  return (
    <div className="category-page">
      <Header />

      <section className="categories-section">
        <h2 className="section-heading">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <CategoryCard 
              key={cat.title} 
              image={cat.image} 
              title={cat.title}
              onClick={() => handleCategoryClick(cat.title)} 
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Category;