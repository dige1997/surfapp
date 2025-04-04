import { useEffect, useState } from "react";
import axios from "axios";

export default function EventCard({ post, onCityUpdate, apiKey }) {
  const [city, setCity] = useState("Fetching...");

  const normalizeCityName = (cityName) => {
    return cityName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const fetchCityFromCoordinates = async (lat, lng) => {
    if (!apiKey) {
      console.error("API key is not defined.");
      setCity("API key not available");
      return;
    }

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
        onCityUpdate(post._id, normalizedCity);
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
    if (post.location) {
      const [lat, lng] = post.location
        .split(",")
        .map((coord) => parseFloat(coord.trim()));

      if (!isNaN(lat) && !isNaN(lng)) {
        fetchCityFromCoordinates(lat, lng);
      } else {
        console.error("Invalid coordinates:", post.location);
        setCity("Invalid location data");
      }
    } else {
      setCity("No location available");
    }
  }, [post.location]);

  return (
    <article className="flex my-2 flex-col md:flex-row w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg">
      <div
        className="md:w-1/3 h-48 md:h-auto bg-cover bg-center "
        style={{
          backgroundImage: `url(${post?.image})`,
        }}
      ></div>
      <div className="flex flex-col w-full p-4">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold max-w-80 text-gray-800 truncate">
            {post.title}
          </h2>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {city}
          </span>
        </div>
        <p className="text-gray-500 mt-1 text-sm">
          Created by {post?.creator?.name}
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4">
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(post.date).toLocaleDateString("en-GB")}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">Location:</span> {city}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 mb-1">Description:</h3>
          <p className="text-sm text-gray-600 line-clamp-3">
            {post.description || "No description provided."}
          </p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-700">
            Likes: {post.likes?.length || 0}
          </p>
          <button className="text-sm text-blue-500 hover:underline">
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
