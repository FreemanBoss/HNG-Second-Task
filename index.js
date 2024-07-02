const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 4000;

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log("Received request from IP:", clientIp);

  try {
    const locationResponse = await axios.get("http://ip-api.com/json/");
    const locationData = locationResponse.data;
    console.log("Location data received:", locationData);

    const weatherResponse = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.OPENWEATHERMAP_API_KEY}&q=${locationData.city}&aqi=yes`
    );

    const weatherData = weatherResponse.data;

    res.json({
      client_ip: clientIp,
      location: locationData.city,
      greeting: `Hello, ${visitorName}!, the temperature is ${weatherData.current.temp_c} degrees Celsius in ${locationData.city}`,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
