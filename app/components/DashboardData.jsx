import React, { useEffect, useState } from "react";

const DashboardData = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Loading..."); // Default state until location is determined
  const [inputCity, setInputCity] = useState(""); // State for input field
  const apiKey = "84c59fa875b07f0e54b6dd1ce011f187"; // Replace with your OpenWeatherMap API key

  // Function to fetch weather data based on city name
  const fetchWeatherData = async (city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // Function to fetch the user's location and get the city name
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
    }
  };

  // Function to get the user's coordinates using the browser's Geolocation API
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCityByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setCity("London"); // Fallback city in case of error
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setCity("London"); // Fallback city if geolocation is unavailable
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
    e.preventDefault(); // Prevent default form submission behavior
    if (inputCity) {
      setCity(inputCity); // Update the city state to the user's input
      setInputCity(""); // Clear the input field
    }
  };

  return (
    <div>
      <h1>Weather in {city}</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city name"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {weatherData ? (
        <div>
          {weatherData.list && weatherData.list.length > 0 ? (
            <>
              <p>Temperature: {weatherData.list[0].main.temp} °C</p>
              <p>Feels Like: {weatherData.list[0].main.feels_like} °C</p>
              <p>Weather: {weatherData.list[0].weather[0].description}</p>
              <p>Humidity: {weatherData.list[0].main.humidity}%</p>
              <p>Wind Speed: {weatherData.list[0].wind.speed} m/s</p>
            </>
          ) : (
            <p>No weather data available.</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DashboardData;
