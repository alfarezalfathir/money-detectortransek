const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const { spawn } = require("child_process");

app.use(cors());

app.use(express.json({ limit: "50mb" }));

// ================= API =================

app.post("/api/detect", (req, res) => {
  const image = req.body.image;

  // ambil base64
  const base64Data = image.replace(/^data:image\/png;base64,/, "");

  // simpan image sementara
  const filePath = "temp.png";

  fs.writeFileSync(filePath, base64Data, "base64");

  // jalankan python
  const python = spawn("python", ["python/detect.py", filePath]);

  let result = "";

  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.log("Python Error:", data.toString());
  });

  python.on("close", () => {
    result = result.trim();

    console.log("Detection:", result);

    res.json({
      result: result,
      confidence: result.includes("ASLI") ? 90 : 40,
    });

    // hapus file sementara
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
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
