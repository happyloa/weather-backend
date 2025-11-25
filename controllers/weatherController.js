const axios = require("axios");

// CWA API 設定
const CWA_API_BASE_URL = "https://opendata.cwa.gov.tw/api";
const CWA_API_KEY = process.env.CWA_API_KEY;

/**
 * 通用的城市天氣預報取得函數
 * @param {string} cityName - 城市名稱（如：台北市、高雄市）
 * @param {object} res - Express response 物件
 */
const getCityWeather = async (cityName, res) => {
  try {
    // 檢查是否有設定 API Key
    if (!CWA_API_KEY) {
      return res.status(500).json({
        error: "伺服器設定錯誤",
        message: "請在 .env 檔案中設定 CWA_API_KEY",
      });
    }

    // 呼叫 CWA API - 一般天氣預報（36小時）
    // API 文件: https://opendata.cwa.gov.tw/dist/opendata-swagger.html
    const response = await axios.get(
      `${CWA_API_BASE_URL}/v1/rest/datastore/F-C0032-001`,
      {
        params: {
          Authorization: CWA_API_KEY,
          locationName: cityName,
        },
      }
    );

    // 取得城市的天氣資料
    const locationData = response.data.records.location[0];

    if (!locationData) {
      return res.status(404).json({
        error: "查無資料",
        message: `無法取得${cityName}天氣資料`,
      });
    }

    // 整理天氣資料
    const weatherData = {
      city: locationData.locationName,
      updateTime: response.data.records.datasetDescription,
      forecasts: [],
    };

    // 解析天氣要素
    const weatherElements = locationData.weatherElement;
    const timeCount = weatherElements[0].time.length;

    for (let i = 0; i < timeCount; i++) {
      const forecast = {
        startTime: weatherElements[0].time[i].startTime,
        endTime: weatherElements[0].time[i].endTime,
        weather: "",
        rain: "",
        minTemp: "",
        maxTemp: "",
        comfort: "",
        windSpeed: "",
      };

      weatherElements.forEach((element) => {
        const value = element.time[i].parameter;
        switch (element.elementName) {
          case "Wx":
            forecast.weather = value.parameterName;
            break;
          case "PoP":
            forecast.rain = value.parameterName + "%";
            break;
          case "MinT":
            forecast.minTemp = value.parameterName + "°C";
            break;
          case "MaxT":
            forecast.maxTemp = value.parameterName + "°C";
            break;
          case "CI":
            forecast.comfort = value.parameterName;
            break;
          case "WS":
            forecast.windSpeed = value.parameterName;
            break;
        }
      });

      weatherData.forecasts.push(forecast);
    }

    res.json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    console.error(`取得${cityName}天氣資料失敗:`, error.message);

    if (error.response) {
      // API 回應錯誤
      return res.status(error.response.status).json({
        error: "CWA API 錯誤",
        message: error.response.data.message || "無法取得天氣資料",
        details: error.response.data,
      });
    }

    // 其他錯誤
    res.status(500).json({
      error: "伺服器錯誤",
      message: "無法取得天氣資料，請稍後再試",
    });
  }
};

/**
 * 取得台北市天氣預報
 */
const getTaipeiWeather = async (req, res) => {
  return getCityWeather("臺北市", res);
};

/**
 * 取得新北市天氣預報
 */
const getNewTaipeiWeather = async (req, res) => {
  return getCityWeather("新北市", res);
};

/**
 * 取得桃園市天氣預報
 */
const getTaoyuanWeather = async (req, res) => {
  return getCityWeather("桃園市", res);
};

/**
 * 取得台中市天氣預報
 */
const getTaichungWeather = async (req, res) => {
  return getCityWeather("臺中市", res);
};

/**
 * 取得台南市天氣預報
 */
const getTainanWeather = async (req, res) => {
  return getCityWeather("臺南市", res);
};

/**
 * 取得高雄市天氣預報
 */
const getKaohsiungWeather = async (req, res) => {
  return getCityWeather("高雄市", res);
};

module.exports = {
  getTaipeiWeather,
  getNewTaipeiWeather,
  getTaoyuanWeather,
  getTaichungWeather,
  getTainanWeather,
  getKaohsiungWeather,
};
