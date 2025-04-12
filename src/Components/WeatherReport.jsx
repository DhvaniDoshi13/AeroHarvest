import React, { useState } from "react";
import axios from "axios";

const WeatherReport = () => {
    const [location, setLocation] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState("");

    const API_KEY = import.meta.env.VITE_API_KEY;

    const fetchWeather = async () => {
        setError("");
        setWeatherData(null);

        try {
            const geoRes = await axios.get(
                `https://api.openweathermap.org/geo/1.0/direct?q=${location},IN&limit=1&appid=${API_KEY}`
            );

            if (geoRes.data.length === 0) {
                setError("❌ Location not found!");
                return;
            }

            const { lat, lon } = geoRes.data[0];

            const weatherRes = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );

            setWeatherData(weatherRes.data);
        } catch (err) {
            console.error("❌ API Error:", err);
            setError("Failed to fetch weather data. Check API key or location.");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "40px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ marginBottom: "30px" }}>🌦 Weather Report</h2>

            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Enter village/city"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                        padding: "12px",
                        width: "280px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        fontSize: "16px"
                    }}
                />
                <button
                    onClick={fetchWeather}
                    style={{
                        padding: "12px 20px",
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "16px"
                    }}
                >
                    Get Weather
                </button>
            </div>

            {error && <p style={{ color: "red", marginBottom: "20px" }}>{error}</p>}

            {weatherData && (
                <div
                    style={{
                        margin: "auto",
                        backgroundColor: "#f0f8ff",
                        padding: "25px",
                        borderRadius: "10px",
                        maxWidth: "400px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                    }}
                >
                    <h3 style={{ marginBottom: "15px" }}>📍 {weatherData.name}</h3>
                    <p style={{ marginBottom: "10px" }}>
                        🌡 <strong>Temperature:</strong> {weatherData.main.temp}°C
                    </p>
                    <p style={{ marginBottom: "10px" }}>
                        💧 <strong>Humidity:</strong> {weatherData.main.humidity}%
                    </p>
                    <p>
                        🌦 <strong>Condition:</strong> {weatherData.weather[0].description}
                    </p>
                </div>
            )}
        </div>
    );
};

export default WeatherReport;
