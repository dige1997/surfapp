import React, { useEffect, useState } from "react";

const DashboardData = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Loading...");
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
      }
    } catch (error) {
      console.error("Error fetching city by coordinates:", error);
      setCity("Copenhagen");
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
        () => setCity("Copenhagen") // Fallback city if location fails
      );
    } else {
      setCity("Copenhagen"); // Fallback city if geolocation is unavailable
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

  return (
    <div className="flex md:flex-row flex-col p-4 ">
      <div className=" md:w-3/6 md:justify-center md:mx-auto ">
        <div className="mt-4 flex justify-center flex-col">
          <form className="flex justify-center" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter city name"
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              className="bg-slate-50 p-2 rounded-l-2xl focus:outline-none "
            />
            <button className="bg-slate-50 rounded-r-2xl p-2" type="submit">
              🔍
            </button>
          </form>
          <h1 className="text-7xl font-bold text-center mt-2 capitalize">
            {city}
          </h1>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {weatherData ? (
          <div className="bg-s-100 rounded-xl w-full p-6 mt-4 mx-auto">
            <p className="text-3xl flex items-center gap-3">
              🌡 {weatherData.list[0].main.temp} °C
            </p>
            <p>Feels Like: {weatherData.list[0].main.feels_like} °C</p>
            <p className="text-3xl flex items-center gap-3">
              🌤 {weatherData.list[0].weather[0].description}
            </p>
            <p className="text-3xl flex items-center gap-3">
              💨 {weatherData.list[0].wind.speed} m/s
            </p>
          </div>
        ) : (
          <p className="text-center mt-4">Loading weather data...</p>
        )}
      </div>
      <div className="w-full px-4">
        <div className="flex justify-center mt-4">
          <button
            className={`p-2 mx-2 rounded-xl shadow-md ${
              activeTab === "wind"
                ? "bg-blue-500 text-white"
                : "bg-slate-100 hover:bg-slate-400"
            }`}
            onClick={() => setActiveTab("wind")}
          >
            Wind Map
          </button>
          <button
            className={`p-2 mx-2 rounded-xl shadow-md ${
              activeTab === "swell"
                ? "bg-blue-500 text-white"
                : "bg-slate-100 hover:bg-slate-400"
            }`}
            onClick={() => setActiveTab("swell")}
          >
            Swell Map
          </button>
        </div>

        {activeTab === "wind" ? (
          <iframe
            title="Windy Map"
            src={`https://embed.windy.com/embed.html?lat=${
              weatherData?.city?.coord?.lat || 55.615
            }&lon=${
              weatherData?.city?.coord?.lon || 12.347
            }&zoom=5&overlay=wind&metricTemp=°C&metricWind=m/s`}
            className=" w-full h-full m-4 mx-auto border-0 rounded-xl"
          ></iframe>
        ) : (
          <iframe
            title="Windy Map Swell"
            src={`https://embed.windy.com/embed.html?lat=${
              weatherData?.city?.coord?.lat || 55.615
            }&lon=${
              weatherData?.city?.coord?.lon || 12.347
            }&zoom=5&overlay=swell1&product=ecmwfWaves&level=surface`}
            className="w-full h-full m-4 mx-auto border-0 rounded-xl"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default DashboardData;
