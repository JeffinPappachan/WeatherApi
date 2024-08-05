const express = require('express');
require('dotenv').config();
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.WEATHER_API_KEY

const validStyleOptions = [
    "CloudAtNight", "CloudySunny", "Cloudy", "CloudyRain", "Fog", "HeavyRain",
    "HeavySnow", "MiddleRain", "MinSnow", "Moon", "RainSnow", "Sunny",
    "SunnySnow", "Thunder", "ThunderRain", "Tornado", "Wind", "Temperature"
];

const styleMap = {
    "clear": "Moon",
    "partly cloudy": "CloudAtNight",
    "overcast": "LightRain",
    "mist": "LightRain",
    "patchy rain possible": "MinSnow",
    "patchy sleet possible": "MinSnow",
    "patchy freezing drizzle possible": "LightSnow",
    "thundery outbreaks possible": "ThunderRain",
    "blowing snow": "LightSnow",
    "blizzard": "HeavySnow",
    "freezing fog": "Fog",
    "patchy light drizzle": "LightRain",
    "light drizzle": "LightRain"
};

app.get('/weather', async (req, res) => {
    const location = req.query.location || 'Geelong, Australia';
    
    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=no`;
        const response = await axios.get(url);
        const weatherData = response.data;

        let style = weatherData.current.condition.text.toLowerCase();
        style = validStyleOptions.includes(style) ? style : (styleMap[style] || "Temperature");

        const data = {
            style: style,
            temp: weatherData.current.temp_c,
            location: location
        };

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
