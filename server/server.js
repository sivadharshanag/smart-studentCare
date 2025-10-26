const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const authRoutes = require("./routes/authRoutes"); // optional
const uploadRoutes = require("./routes/uploadRoutes");


app.use("/api/auth", authRoutes); // optional
app.use("/api/upload", uploadRoutes);


// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => app.listen(process.env.PORT || 5000, () => {
  console.log("✅ Server running on port", process.env.PORT || 5000);
}))
.catch(err => console.log("❌ MongoDB connection error:", err));
