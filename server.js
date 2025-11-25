require("dotenv").config();
const express = require("express");
const cors = require("cors");
const weatherRoutes = require("./routes/weather");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "歡迎使用 CWA 天氣預報 API",
    version: "1.0.0",
    description: "提供台灣六都 36 小時天氣預報",
    endpoints: {
      taipei: "/api/weather/taipei", // 台北市
      newTaipei: "/api/weather/newtaipei", // 新北市
      taoyuan: "/api/weather/taoyuan", // 桃園市
      taichung: "/api/weather/taichung", // 台中市
      tainan: "/api/weather/tainan", // 台南市
      kaohsiung: "/api/weather/kaohsiung", // 高雄市
      health: "/api/health", // 健康檢查
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/weather", weatherRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "伺服器錯誤",
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "找不到此路徑",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 伺服器運行在 http://localhost:${PORT}`);
  console.log(`📍 環境: ${process.env.NODE_ENV || "development"}`);
});
