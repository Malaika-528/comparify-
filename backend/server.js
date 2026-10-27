require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const searchRoutes = require('./routes/search');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/search', searchRoutes);

// ================= DEBUG =================
console.log("SERP API KEY:", !!process.env.SERPAPI_KEY);
console.log("IMGBB KEY:", !!process.env.IMGBB_KEY);

mongoose.connect(
    "mongodb+srv://comparifyUser:BQ7W56KaGJ4bdD@cluster0.5jj3ctm.mongodb.net/comparify?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.log(err));

// ================= MODELS =================

const User = mongoose.model("User", new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

const Favorite = mongoose.model("Favorite", new mongoose.Schema({
  userEmail: { type: String, required: true },
  title: String,
  price: String,
  rating: String,
  image: String,
  link: String,
  source: String,
}));

// ================= AUTH ROUTES =================

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({ name, email, password: hashedPassword }).save();

    res.json({ message: "Signup successful" });

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.json({ message: "Login successful" });

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= FAVORITES ROUTES =================

// Add Favorite
app.post("/favorites", async (req, res) => {
  try {
    const { userEmail, title, price, rating, image, link, source } = req.body;

    const exists = await Favorite.findOne({ userEmail, link });
    if (exists) return res.json({ message: "Already in favorites" });

    const favorite = new Favorite({ userEmail, title, price, rating, image, link, source });
    await favorite.save();

    res.json(favorite);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get User Favorites
app.get("/favorites/:email", async (req, res) => {
  try {
    const favorites = await Favorite.find({ userEmail: req.params.email });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Remove Favorite
app.delete("/favorites/:id", async (req, res) => {
  try {
    await Favorite.findByIdAndDelete(req.params.id);
    res.json({ message: "Favorite removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= DEFAULT ROUTE =================

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

// ================= SERVER =================

app.listen(5000, () => console.log("Server running on port 5000"));