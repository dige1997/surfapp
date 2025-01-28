import { useEffect, useState } from "react";
import axios from "axios";
import { useLoaderData } from "@remix-run/react";

export default function EventCard({ post }) {
  const [city, setCity] = useState("Fetching...");
  const { googleMapsApiKey } = useLoaderData();
  const normalizeCityName = (cityName) => {
    return cityName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const fetchCityFromCoordinates = async (lat, lng) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`;

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

  if (!post) {
    return <p>No post found.</p>;
  }

  return (
    <article className="flex flex-col my-2 p-4 rounded-lg shadow-md w-full bg-white overflow-hidden">
      <img
        className="rounded-lg w-full h-48 object-cover"
        src={post?.image}
        alt={post?.title || "Event image"}
      />

      {/* Post Details */}
      <div className="mt-4 space-y-2">
        {/* Creator */}
        <p className="text-sm text-gray-600">
          Organized by:{" "}
          <span className="font-semibold text-gray-800">
            {post?.creator?.name || "Unknown"}
          </span>
        </p>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900">{post.title}</h2>

        {/* Date */}
        <p className="text-sm text-gray-600">
          📅 Date:{" "}
          <span className="font-medium">
            {new Date(post.date).toLocaleDateString("en-GB")}
          </span>
        </p>

        {/* Location */}
        <p className="text-sm text-gray-600">
          📍 Location: <span className="font-medium">{city}</span>
        </p>

        {/* Description */}
        <p className="text-sm text-gray-700 line-clamp-3">
          {post.description || "No description available."}
        </p>

        {/* Likes */}
        <p className="mt-4 text-sm text-gray-800 font-medium flex items-center">
          ❤️ Likes: {post.attendees?.length || 0}
        </p>
      </div>

      {/* Call to Action */}
      <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 rounded-lg">
        View Details
      </button>
    </article>
  );
}
