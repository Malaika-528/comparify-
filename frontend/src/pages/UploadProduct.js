import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UploadProduct.css";

const UploadProduct = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category || "";

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image && !description) {
      toast.error("Please upload an image OR write a description!");
      return;
    }

    setLoading(true);

    try {
      let response;

      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("category", category);

        response = await axios.post(
          "http://localhost:5000/api/search/image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/api/search/text",
          {
            query: description,
            category: category
          }
        );

        if (response.data.wrongCategory) {
          toast.error(response.data.message);
          setLoading(false);
          return;
        }
      }

      if (response.data.products && response.data.products.length > 0) {
        navigate("/results", {
          state: { products: response.data.products }
        });
      } else {
        toast.error("No products found in " + category + " category!");
      }

    } catch (error) {
      console.log("Error:", error);
      toast.error("Error fetching products. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <div className="upload-container">
        <h2 className="title">Search in {category}</h2>
        <p className="subtitle">Upload image OR describe what you want in {category} category.</p>

        <form onSubmit={handleSubmit}>
          <div className="upload-box">
            <p className="upload-text">Upload a Picture of the Product (Optional)</p>
            <input type="file" onChange={handleImageChange} accept="image/*" />
            {image && <p style={{color: "green", marginTop: "10px"}}>✓ Image selected: {image.name}</p>}
          </div>

          <div className="description-box">
            <p>Add a Comment or Description (Optional)</p>
            <textarea
              placeholder={`Example: ${category === "Footwear" ? "black leather formal shoes size 9" : category === "Clothes" ? "blue denim jeans for men" : category === "Bags" ? "leather backpack for laptop" : "describe the product..."}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Submit"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default UploadProduct;