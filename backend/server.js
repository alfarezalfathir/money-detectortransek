const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));

// ================= API =================

app.post("/api/detect", (req, res) => {
  console.log("Image Received");

  res.json({
    result: "ASLI",
    confidence: 90,
  });
});

// ================= FRONTEND =================

app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// ================= SERVER =================

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
