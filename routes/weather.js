const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

// 台灣六都天氣預報路由
router.get("/taipei", weatherController.getTaipeiWeather);
router.get("/newtaipei", weatherController.getNewTaipeiWeather);
router.get("/taoyuan", weatherController.getTaoyuanWeather);
router.get("/taichung", weatherController.getTaichungWeather);
router.get("/tainan", weatherController.getTainanWeather);
router.get("/kaohsiung", weatherController.getKaohsiungWeather);

module.exports = router;
