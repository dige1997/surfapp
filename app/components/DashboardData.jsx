import React, { useEffect, useState } from "react";

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
  const debounceDelay = 500; // Delay in ms to debounce input

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

  // Debounced search function
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputCity) {
        setCity(inputCity);
        setInputCity("");
      }
    }, debounceDelay);

    return () => clearTimeout(timer); // Cleanup the timeout if the input changes before the delay
  }, [inputCity]);

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
    const reverseGeoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
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
      if (cachedData) {
        setWeatherData(JSON.parse(cachedData));
        setError("");
        setLoading(false);
      } else if (city !== "Loading...") {
        fetchWeatherData(city); // Only fetch if data is not in local storage
      }
    }
  }, [city]);

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
        <div className="flex flex-col p-4" id="outer-container">
          <form className="flex justify-center mt-20" onSubmit={handleSearch}>
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
              >
                <path d="M 9 2 C 5.1458514 2 2 5.1458514 2 9 C 2 12.854149 5.1458514 16 9 16 C 10.747998 16 12.345009 15.348024 13.574219 14.28125 L 14 14.707031 L 14 16 L 20 22 L 22 20 L 16 14 L 14.707031 14 L 14.28125 13.574219 C 15.348024 12.345009 16 10.747998 16 9 C 16 5.1458514 12.854149 2 9 2 z M 9 4 C 11.773268 4 14 6.2267316 14 9 C 14 11.773268 11.773268 14 9 14 C 6.2267316 14 4 11.773268 4 9 C 4 6.2267316 6.2267316 4 9 4 z"></path>
              </svg>
            </button>
          </form>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-3/6 md:justify-center md:mx-auto">
              <div className="mt-4 flex justify-center flex-col">
                <div>
                  <h1 className="text-7xl font-bold text-center mt-2 capitalize">
                    {city}
                  </h1>
                  <p className="text-4xl font-semibold text-center">
                    {country}
                  </p>
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
                    {getWeatherEmoji(
                      weatherData.list[0].weather[0].description
                    )}{" "}
                    {weatherData.list[0].weather[0].description}
                  </p>
                  <p>
                    Rain:{" "}
                    {weatherData.list[0].rain
                      ? weatherData.list[0].rain["3h"]
                      : 0}{" "}
                    mm
                  </p>
                  <p className="text-3xl flex items-center gap-3">
                    💨 {weatherData.list[0].wind.speed} m/s
                  </p>
                  <p>
                    Wind Direction:{" "}
                    {getWindDirection(weatherData.list[0].wind.deg)} (
                    {weatherData.list[0].wind.deg}°)
                  </p>
                </div>
              ) : (
                <p className="text-center mt-4">Loading weather data...</p>
              )}
            </div>
            <div className="w-full h-96 p-4">
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
      )}
    </div>
  );
};

export default DashboardData;
