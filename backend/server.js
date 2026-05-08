const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend berjalan",
  });
});

app.post("/api/detect", (req, res) => {
  const image = req.body.image;

  console.log("Image Received");

  res.json({
    result: "ASLI",
    confidence: 90,
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
