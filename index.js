const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 4000;

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;

  try {
    // Fetch public IP address
    const ipResponse = await axios.get("http://api64.ipify.org?format=json");
    const clientIp = ipResponse.data.ip;
    console.log("Client IP:", clientIp);

    // Fetch location data
    const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
    const locationData = locationResponse.data;

    if (locationData.status !== "success") {
      console.error("Location API error response:", locationData);
      throw new Error("Failed to fetch location data");
    }

    console.log("Location data received:", locationData);

    // Fetch weather data
    const weatherResponse = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.OPENWEATHERMAP_API_KEY}&q=${locationData.city}&aqi=yes`
    );

    const weatherData = weatherResponse.data;
    console.log("Weather data received:", weatherData.location.name);

    res.json({
      client_ip: clientIp,
      location: weatherData.location.name,
      greeting: `Hello, ${visitorName}!, the temperature is ${weatherData.current.temp_c} degrees Celsius in ${weatherData.location.name}`,
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
