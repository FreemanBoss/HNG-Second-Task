const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 4000;

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;

  try {
    // Fetch public IP address information
    const ipResponse = await axios.get("http://ipinfo.io?token=90ce3f25338f13");
    const clientIp = ipResponse.data.ip;
    const locationData = ipResponse.data;

    // Fetch weather data
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
    console.error("Error fetching data:", error.message);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
