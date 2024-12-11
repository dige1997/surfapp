import { useEffect, useState } from "react";
import axios from "axios";

export default function EventCard({ event, onCityUpdate }) {
  const [city, setCity] = useState("Fetching...");
  const apiKey = "AIzaSyAJRJzkSO54nHodtQJF-xAPcEwL5q7_NHA";

  const normalizeCityName = (cityName) => {
    return cityName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const fetchCityFromCoordinates = async (lat, lng) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await axios.get(url);

      if (response.data && response.data.results.length > 0) {
        const addressComponents = response.data.results[0].address_components;
        const nearestCity =
          addressComponents.find((component) =>
            component.types.includes("locality")
          )?.long_name ||
          addressComponents.find((component) =>
            component.types.includes("administrative_area_level_1")
          )?.long_name ||
          "Unknown location";

        const normalizedCity = normalizeCityName(nearestCity);
        setCity(normalizedCity);
        onCityUpdate(event._id, normalizedCity);
      } else {
        console.error("No results found in API response:", response.data);
        setCity("Unknown location");
      }
    } catch (error) {
      console.error("Error fetching city:", error.message);
      setCity("Error fetching location");
    }
  };

  useEffect(() => {
    if (event.location) {
      const [lat, lng] = event.location
        .split(",")
        .map((coord) => parseFloat(coord.trim()));

      if (!isNaN(lat) && !isNaN(lng)) {
        fetchCityFromCoordinates(lat, lng);
      } else {
        console.error("Invalid coordinates:", event.location);
        setCity("Invalid location data");
      }
    } else {
      setCity("No location available");
    }
  }, [event.location]);

  return (
    <article className="flex my-4 flex-col md:flex-row w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg">
      <div
        className="md:w-1/3 h-48 md:h-auto bg-cover bg-center"
        style={{
          backgroundImage: `url(${event?.image})`,
        }}
      ></div>
      <div className="flex flex-col w-full p-4">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-gray-800 truncate">
            {event.title}
          </h2>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {city}
          </span>
        </div>
        <p className="text-gray-500 mt-1 text-sm">
          Created by {event?.creator?.name}
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4">
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(event.date).toLocaleDateString("en-GB")}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">Location:</span> {city}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md">
              Attend
            </button>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 mb-1">Description:</h3>
          <p className="text-sm text-gray-600 line-clamp-3">
            {event.description || "No description provided."}
          </p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-700">
            Likes: {event.attendees?.length || 0}
          </p>
          <button className="text-sm text-blue-500 hover:underline">
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
