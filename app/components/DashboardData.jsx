import React, { useEffect, useState } from "react";

const DashboardData = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Loading...");
  const [country, setCountry] = useState(""); // State for country
  const [inputCity, setInputCity] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("wind"); // Track which tab is active
  const apiKey = "84c59fa875b07f0e54b6dd1ce011f187";

  // Fetch weather data based on city name
  const fetchWeatherData = async (city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${errorText}`);
      }
      const data = await response.json();
      setWeatherData(data);
      setError("");
      setCountry(data.city.country); // Set the country from API response
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Could not fetch weather data. Please try another city.");
    }
  };

  // Fetch city by coordinates
  const fetchCityByCoordinates = async (lat, lon) => {
    const reverseGeoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    try {
      const response = await fetch(reverseGeoUrl);
      const data = await response.json();
      if (data && data.length > 0) {
        setCity(data[0].name);
        setCountry(data[0].country); // Set country from reverse geocoding
      }
    } catch (error) {
      console.error("Error fetching city by coordinates:", error);
      setCity("Copenhagen");
      setCountry("DK"); // Default country fallback
    }
  };

  // Geolocation API - Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCityByCoordinates(latitude, longitude);
        },
        () => {
          setCity("Copenhagen"); // Fallback city if location fails
          setCountry("DK"); // Fallback country
        }
      );
    } else {
      setCity("Copenhagen"); // Fallback city if geolocation is unavailable
      setCountry("DK");
    }
  };

  useEffect(() => {
    getUserLocation(); // Get user's location on component mount
  }, []);

  useEffect(() => {
    if (city !== "Loading...") {
      fetchWeatherData(city); // Fetch weather data when the city changes
    }
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCity) {
      setCity(inputCity); // Update the city state to the user's input
      setInputCity(""); // Clear the input field
    }
  };

  const getWindDirection = (degrees) => {
    if (degrees >= 337.5 || degrees < 22.5) {
      return "N";
    } else if (degrees >= 22.5 && degrees < 67.5) {
      return "NE";
    } else if (degrees >= 67.5 && degrees < 112.5) {
      return "E";
    } else if (degrees >= 112.5 && degrees < 157.5) {
      return "SE";
    } else if (degrees >= 157.5 && degrees < 202.5) {
      return "S";
    } else if (degrees >= 202.5 && degrees < 247.5) {
      return "SW";
    } else if (degrees >= 247.5 && degrees < 292.5) {
      return "W";
    } else if (degrees >= 292.5 && degrees < 337.5) {
      return "NW";
    }
  };

  const getWeatherEmoji = (description) => {
    const lowerCaseDescription = description.toLowerCase();
    if (lowerCaseDescription.includes("clear")) return "☀️"; // Clear sky
    if (lowerCaseDescription.includes("clouds")) return "☁️"; // Cloudy
    if (lowerCaseDescription.includes("rain")) return "🌧️"; // Rain
    if (lowerCaseDescription.includes("thunderstorm")) return "⛈️"; // Thunderstorm
    if (lowerCaseDescription.includes("snow")) return "❄️"; // Snow
    if (
      lowerCaseDescription.includes("mist") ||
      lowerCaseDescription.includes("fog")
    )
      return "🌫️"; // Mist/Fog
    return "🌤️"; // Default emoji for other types
  };

  return (
    <div className="flex flex-col p-4">
      <form className="flex justify-center mt-20" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city name"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          className="bg-slate-50 p-2 w-72 rounded-l-2xl focus:outline-none"
        />
        <button className="bg-slate-50 rounded-r-2xl p-2" type="submit">
          🔍
        </button>
      </form>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-3/6 md:justify-center md:mx-auto">
          <div className="mt-4 flex justify-center flex-col">
            <div>
              <h1 className="text-7xl font-bold text-center mt-2 capitalize">
                {city}
              </h1>
              <p className="text-4xl font-semibold text-center"> {country}</p>
            </div>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          {weatherData ? (
            <div className="bg-s-100 rounded-xl w-full p-6 mt-4 mx-auto">
              <p className="text-3xl flex items-center gap-3">
                🌡 {weatherData.list[0].main.temp} °C
              </p>
              <p>Feels Like: {weatherData.list[0].main.feels_like} °C</p>
              <p>Min Temp: {weatherData.list[0].main.temp_min} °C</p>
              <p>Max Temp: {weatherData.list[0].main.temp_max} °C</p>
              <p className="text-3xl flex items-center gap-3">
                {getWeatherEmoji(weatherData.list[0].weather[0].description)}{" "}
                {weatherData.list[0].weather[0].description}
              </p>
              <p>
                Rain:{" "}
                {weatherData.list[0].rain ? weatherData.list[0].rain["3h"] : 0}{" "}
                mm
              </p>
              <p className="text-3xl flex items-center gap-3">
                💨 {weatherData.list[0].wind.speed} m/s
              </p>
              <p>
                Wind Direction: {getWindDirection(weatherData.list[0].wind.deg)}{" "}
                ({weatherData.list[0].wind.deg}°)
              </p>
            </div>
          ) : (
            <p className="text-center mt-4">Loading weather data...</p>
          )}
        </div>

        <div className="w-full h-96 px-4">
          <div className="flex mt-4">
            <button
              className={`p-2 rounded-t-md shadow-md ${
                activeTab === "wind"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 hover:bg-slate-400"
              }`}
              onClick={() => setActiveTab("wind")}
            >
              Wind Map
            </button>
            <button
              className={`p-2 rounded-t-md shadow-md ${
                activeTab === "swell"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 hover:bg-slate-400"
              }`}
              onClick={() => setActiveTab("swell")}
            >
              Swell Map
            </button>
            <button
              className={`p-2 rounded-t-md shadow-md ${
                activeTab === "temp"
                  ? "bg-slate-500 text-white"
                  : "bg-slate-100 hover:bg-slate-400"
              }`}
              onClick={() => setActiveTab("temp")}
            >
              Sea Temp
            </button>
          </div>

          {activeTab === "wind" && weatherData && (
            <iframe
              title="Windy Map"
              src={`https://embed.windy.com/embed.html?lat=${weatherData.city.coord.lat}&lon=${weatherData.city.coord.lon}&zoom=5&overlay=wind&metricTemp=°C&metricWind=m/s`}
              className="w-full h-full rounded-md"
              frameBorder="0"
            ></iframe>
          )}
          {activeTab === "swell" && weatherData && (
            <iframe
              title="Swell Map"
              src={`https://embed.windy.com/embed.html?lat=${weatherData.city.coord.lat}&lon=${weatherData.city.coord.lon}&zoom=5&overlay=swell1&product=ecmwfWaves&level=surface`}
              className="w-full h-full rounded-md"
              frameBorder="0"
            ></iframe>
          )}
          {activeTab === "temp" && weatherData && (
            <iframe
              title="Sea Temperature"
              src={`https://embed.windy.com/embed.html?lat=${weatherData.city.coord.lat}&lon=${weatherData.city.coord.lon}&zoom=5&overlay=sst&product=ecmwfAnalysis&level=surface`}
              className="w-full h-full rounded-md"
              frameBorder="0"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardData;
