const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 4000;

app.get("/api/hello", async (req, res) => {
  try {
    const locationResponse = await axios.get("http://ip-api.com/json/");
    const locationData = locationResponse.data;
    const clientIp = locationData.query;

    console.log("Received request from IP:", clientIp);

    const weatherResponse = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.OPENWEATHERMAP_API_KEY}&q=${locationData.city}&aqi=yes`
    );

    const weatherData = weatherResponse.data;

    const visitorName = req.query.visitor_name;

    res.json({
      client_ip: clientIp,
      location: locationData.city,
      greeting: `Hello, ${visitorName}!, the temperature is ${weatherData.current.temp_f} degrees Celsius in ${locationData.city}`,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
