import React, { useEffect, useState } from "react";
import { IframeDisplay } from "./IframeDisplay"; // Import the IframeDisplay component

const DashboardData = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Loading...");
  const [country, setCountry] = useState("");
  const [inputCity, setInputCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("wind");
  const [isOffline, setIsOffline] = useState(false);

  const apiKey = "84c59fa875b07f0e54b6dd1ce011f187";

  useEffect(() => {
    // Run only on the client side
    if (typeof window !== "undefined" && navigator) {
      setIsOffline(!navigator.onLine);

      const handleNetworkChange = () => {
        const isOnline = navigator.onLine;
        setIsOffline(!isOnline);
        if (!isOnline) {
          setError(
            "You are offline. Data displayed is from the last fetched information."
          );
          const cachedData = localStorage.getItem(city);
          if (cachedData) {
            setWeatherData(JSON.parse(cachedData));
            setLoading(false);
          }
        } else {
          setError("");
        }
      };

      // Add event listeners for online and offline states
      window.addEventListener("online", handleNetworkChange);
      window.addEventListener("offline", handleNetworkChange);

      return () => {
        // Cleanup listeners on component unmount
        window.removeEventListener("online", handleNetworkChange);
        window.removeEventListener("offline", handleNetworkChange);
      };
    }
  }, [city]);

  const fetchWeatherData = async (city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    setLoading(true);
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${errorText}`);
      }
      const data = await response.json();
      setWeatherData(data);
      setError("");
      setCountry(data.city.country);
      localStorage.setItem(city, JSON.stringify(data)); // Only store data when it’s successfully fetched
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Could not fetch weather data. Please try another city.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCityByCoordinates = async (lat, lon) => {
    const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    try {
      const response = await fetch(reverseGeoUrl);
      const data = await response.json();
      if (data && data.length > 0) {
        setCity(data[0].name);
        setCountry(data[0].country);
      }
    } catch (error) {
      console.error("Error fetching city by coordinates:", error);
      setCity("Copenhagen");
      setCountry("DK");
    }
  };

  const getUserLocation = () => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCityByCoordinates(latitude, longitude);
        },
        () => {
          setCity("Copenhagen");
          setCountry("DK");
        }
      );
    } else {
      setCity("Copenhagen");
      setCountry("DK");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      getUserLocation();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedData = localStorage.getItem(city);
      if (cachedData && isOffline) {
        setWeatherData(JSON.parse(cachedData));
        setError("");
        setLoading(false);
      } else if (city !== "Loading...") {
        fetchWeatherData(city); // Only fetch if data is not in local storage or user is online
      }
    }
  }, [city, isOffline]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCity) {
      setCity(inputCity);
      setInputCity(""); // Clear input after search
    }
  };

  const getWindDirection = (degrees) => {
    if (degrees >= 337.5 || degrees < 22.5) return "N";
    if (degrees >= 22.5 && degrees < 67.5) return "NE";
    if (degrees >= 67.5 && degrees < 112.5) return "E";
    if (degrees >= 112.5 && degrees < 157.5) return "SE";
    if (degrees >= 157.5 && degrees < 202.5) return "S";
    if (degrees >= 202.5 && degrees < 247.5) return "SW";
    if (degrees >= 247.5 && degrees < 292.5) return "W";
    if (degrees >= 292.5 && degrees < 337.5) return "NW";
  };

  const getWeatherEmoji = (description) => {
    const lowerCaseDescription = description.toLowerCase();
    if (lowerCaseDescription.includes("clear")) return "☀️";
    if (lowerCaseDescription.includes("clouds")) return "☁️";
    if (lowerCaseDescription.includes("rain")) return "🌧️";
    if (lowerCaseDescription.includes("thunderstorm")) return "⛈️";
    if (lowerCaseDescription.includes("snow")) return "❄️";
    if (
      lowerCaseDescription.includes("mist") ||
      lowerCaseDescription.includes("fog")
    )
      return "🌫️";
    return "🌤️";
  };

  return (
    <div className="flex flex-col p-4">
      {isOffline && (
        <div className="bg-yellow-200 text-yellow-800 p-4 mb-4 rounded-lg">
          ⚠️ You are offline. Displayed data may be outdated.
        </div>
      )}

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="flex flex-col md:p-4" id="outer-container">
          <form className="flex justify-center mt-10" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter city name"
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              className="bg-slate-50 p-2 w-72 rounded-l-2xl focus:outline-none"
            />
            <button className="bg-slate-50 rounded-r-2xl p-2" type="submit">
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
          <div className="mt-10 p-4 flex flex-col justify-between items-center rounded-xl shadow-md h-full">
            <div className="flex gap-10 pb-8 px-8 md:w-3/5 md:justify-between md:flex-row flex-col">
              <div>
                <h1 className="text-5xl font-semibold mb-6 text-gray-800">
                  {city}, {country}
                </h1>
                <div className="flex flex-row items-center ">
                  <p className="text-6xl">
                    {weatherData &&
                      getWeatherEmoji(
                        weatherData.list[0].weather[0].description
                      )}
                  </p>
                  <h2 className="text-5xl ml-4 font-bold">
                    {weatherData && Math.round(weatherData.list[0].main.temp)}°C
                  </h2>
                  <div className="pl-2 leading-5 items-center">
                    <div className="flex-row flex gap-1">
                      <p>Min: </p>
                      <p>
                        {weatherData &&
                          Math.round(weatherData.list[0].main.temp_min)}
                        °C
                      </p>
                    </div>
                    <div className="flex-row flex gap-1">
                      <p>Max: </p>
                      <p>
                        {weatherData &&
                          Math.round(weatherData.list[0].main.temp_max)}
                        °C
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xl text-gray-600">
                  {weatherData &&
                    weatherData.list[0].weather[0].description.toUpperCase()}
                </p>
              </div>
              <div className="flex flex-row gap-20 justify-center md:flex-row md:gap-4 text-center ">
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600">Wind</p>
                  <p className="font-bold">
                    {weatherData && Math.round(weatherData.list[0].wind.speed)}{" "}
                    m/s
                  </p>
                  <p className="text-sm text-gray-600">Gust</p>
                  <p className="font-bold">
                    {weatherData && Math.round(weatherData.list[0].wind.gust)}{" "}
                    m/s
                  </p>
                  <p text-sm text-gray-600>
                    Wind <br />
                    direction
                  </p>
                  <p className="font-bold">
                    {weatherData &&
                      getWindDirection(weatherData.list[0].wind.deg)}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className="font-bold">
                    {weatherData && weatherData.list[0].main.humidity}%
                  </p>
                  <p className="text-sm text-gray-600">Sea level</p>
                  <p className="font-bold">
                    {weatherData && weatherData.list[0].main.sea_level}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <button
                className={`${
                  activeTab === "wind" ? "bg-blue-700" : "bg-blue-500"
                } text-white p-2 rounded-t-lg`}
                onClick={() => setActiveTab("wind")}
              >
                Wind
              </button>
              <button
                className={`${
                  activeTab === "swell" ? "bg-blue-700" : "bg-blue-500"
                } text-white p-2 rounded-t-lg`}
                onClick={() => setActiveTab("swell")}
              >
                Swell
              </button>
              <button
                className={`${
                  activeTab === "temp" ? "bg-blue-700" : "bg-blue-500"
                } text-white p-2 rounded-t-lg`}
                onClick={() => setActiveTab("temp")}
              >
                Temperature
              </button>
            </div>
            <IframeDisplay activeTab={activeTab} weatherData={weatherData} />
          </div>
        </div>
      )}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default DashboardData;
