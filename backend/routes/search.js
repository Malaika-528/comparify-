const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const https = require('https');
require('dotenv').config();

const upload = multer({ dest: 'uploads/' });

// Category keywords - UPDATED with better matching
const categoryKeywords = {
  "Electronics": ["earphone", "headphone", "charger", "cable", "phone", "laptop", "tablet", "speaker", "bluetooth", "wireless", "digital", "electronic", "computer", "camera", "tv", "smart", "device"],
  "Makeup": ["lipstick", "foundation", "mascara", "eyeshadow", "blush", "concealer", "powder", "serum", "moisturizer", "makeup", "beauty", "cosmetic", "skincare"],
  "Home Decor": ["lamp", "vase", "curtain", "pillow", "rug", "candle", "frame", "clock", "decor", "home", "furniture", "wall"],
  "Bags": ["bag", "handbag", "purse", "backpack", "tote", "clutch", "wallet", "satchel"],
  "Clothes": ["shirt", "dress", "jeans", "jacket", "coat", "sweater", "kurta", "shalwar", "clothing", "wear", "fashion", "outfit", "pants", "top"],
  "Footwear": ["shoes", "boots", "sandals", "sneakers", "heels", "slippers", "loafers", "chappal", "footwear", "nike", "adidas", "puma"]
};

// Price format helper
function formatPrice(price) {
  if (!price) return 'N/A';
  if (typeof price === 'object') {
    return `${price.currency || ''} ${price.extracted_value || price.value || ''}`.trim();
  }
  return price;
}


function getPKRPrice(priceString) {
  if (!priceString || priceString === 'N/A') return null;
  const match = priceString.match(/[\d,.]+/);
  if (!match) return null;
  const usdAmount = parseFloat(match[0].replace(/,/g, ''));
  const pkrAmount = Math.round(usdAmount * 280);
  return `Rs ${pkrAmount.toLocaleString()}`;
}



// Helper function — SerpAPI call
function serpRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

// Helper function — Imgbb upload
function uploadToImgbb(imageBase64, imgbbKey) {
  return new Promise((resolve, reject) => {
    const postData = `image=${encodeURIComponent(imageBase64)}`;
    const options = {
      hostname: 'api.imgbb.com',
      path: `/1/upload?key=${imgbbKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req2 = https.request(options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log("Imgbb URL:", parsed.data?.url);
          resolve(parsed.data.url);
        } catch (e) { reject(e); }
      });
    });

    req2.on('error', reject);
    req2.write(postData);
    req2.end();
  });
}

// UPDATED: Text Search with better category restriction
router.post('/text', async (req, res) => {
  const { query, category } = req.body;
  console.log("Text search:", query, category);

  try {
    const key = process.env.SERPAPI_KEY;

    // Category check - IMPROVED LOGIC
    const keywords = categoryKeywords[category] || [];
    
    if (keywords.length > 0) {
      const queryLower = query.toLowerCase();
      let isMatch = false;
      
      // Check 1: Direct keyword match
      for (let keyword of keywords) {
        if (queryLower.includes(keyword)) {
          isMatch = true;
          break;
        }
      }
      
      // Check 2: Word by word match (for "ear phones" case)
      if (!isMatch) {
        const queryWords = queryLower.split(/\s+/);
        for (let word of queryWords) {
          for (let keyword of keywords) {
            if (word.includes(keyword) || keyword.includes(word)) {
              isMatch = true;
              break;
            }
          }
          if (isMatch) break;
        }
      }
      
      // Check 3: Special allowances for common cases
      if (!isMatch) {
        if (category === "Footwear" && (queryLower.includes("shoe") || queryLower.includes("boot") || queryLower.includes("heel") || queryLower.includes("sandal"))) {
          isMatch = true;
        }
        if (category === "Electronics" && (queryLower.includes("ear") || queryLower.includes("head") || queryLower.includes("phone") || queryLower.includes("charger"))) {
          isMatch = true;
        }
        if (category === "Clothes" && (queryLower.includes("shirt") || queryLower.includes("dress") || queryLower.includes("jeans"))) {
          isMatch = true;
        }
      }
      
      // Agar match nahi mila to error return karo
      if (!isMatch) {
  return res.json({
    success: false,
    wrongCategory: true,
    message: `"${query}" does not belong to ${category} category! Please search for ${category} related products only.`
  });
}
    }

    // Sahi category — SerpAPI call
    const q = encodeURIComponent(`${query} ${category}`);

    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${q}&api_key=${key}&num=20`;

    const results = await serpRequest(url);

    let products = results.shopping_results?.map(item => ({
      title: item.title,
      price: formatPrice(item.price),
      pricePKR: getPKRPrice(formatPrice(item.price)),
      source: item.source,
      link: item.product_link || item.link || "#",
      thumbnail: item.thumbnail,
      rating: item.rating?.value || item.rating || null,
      reviews: item.reviews
    })) || [];

    console.log("Results:", products.length);
    res.json({ success: true, products });

  } catch (error) {
    console.log("ERROR:", error.message);
    res.json({ success: false, message: error.message });
  }
});

// UPDATED: Image Search with category restriction
router.post('/image', upload.single('image'), async (req, res) => {
  console.log("Image search request received");
  
  // Category from frontend
  const { category } = req.body;
  console.log("Image search category:", category);

  try {
    const key = process.env.SERPAPI_KEY;
    const imgbbKey = process.env.IMGBB_KEY;
    const imagePath = req.file.path;

    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
    const imageUrl = await uploadToImgbb(imageBase64, imgbbKey);
    console.log("Image uploaded:", imageUrl);

   const serpUrl = `https://serpapi.com/search.json?engine=google_lens&url=${encodeURIComponent(imageUrl)}&api_key=${key}`;
   
    const results = await serpRequest(serpUrl);
    console.log("Visual matches:", results.visual_matches?.length);

    let products = results.visual_matches?.map(item => ({
      title: item.title,
      price: formatPrice(item.price),
      source: item.source,
      pricePKR: getPKRPrice(formatPrice(item.price)),
      link: item.product_link || item.link || "#",
      thumbnail: item.thumbnail,
      rating: item.rating?.value || item.rating || null,
      reviews: item.reviews
    })) || [];

    // OPTIONAL: Image ke liye bhi category filter laga sakte ho
    // Agar koi product title category se match nahi karta to hata do
    if (category && categoryKeywords[category]) {
      const keywords = categoryKeywords[category];
      products = products.filter(product => {
        const titleLower = (product.title || "").toLowerCase();
        return keywords.some(keyword => titleLower.includes(keyword));
      });
      console.log("After category filter:", products.length);
    }

    fs.unlinkSync(imagePath);
    res.json({ success: true, products });

  } catch (error) {
    console.log("ERROR:", error.message);
    res.json({ success: false, message: error.message });
  }
});

module.exports = router;