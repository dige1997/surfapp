import { useEffect, useState } from "react";
import axios from "axios";
import { useLoaderData } from "@remix-run/react";

export default function EventList({ event, onCityUpdate }) {
  const [city, setCity] = useState(null);
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
      const results = response.data.results;
      if (results.length > 0) {
        const addressComponents = results[0].address_components;
        const nearestCity =
          addressComponents.find(
            (component) =>
              component.types.includes("locality") ||
              component.types.includes("administrative_area_level_1")
          )?.long_name ||
          addressComponents.find((component) =>
            component.types.includes("administrative_area_level_2")
          )?.long_name ||
          "Unknown location";

        const normalizedCity = normalizeCityName(nearestCity);
        setCity(normalizedCity);
        onCityUpdate(event._id, normalizedCity);
      } else {
        setCity("Unknown location");
      }
    } catch (error) {
      console.error("Error fetching city:", error);
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
        setCity("No location available");
      }
    }
  }, [event.location]);

  return (
    <article className="flex w-full items-center my-2 px-4 py-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
      <div
        className="w-16 h-16 rounded-md bg-cover bg-center flex-shrink-0"
        style={{
          backgroundImage: `url(${event?.image})`,
        }}
      ></div>
      <div className="ml-4 flex-1">
        <h2 className="text-sm font-semibold text-gray-800 truncate">
          {event.title}
        </h2>
        <p className="text-xs text-gray-500">
          By {event?.creator?.name} • {city || "Fetching city..."}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          <span className="font-medium">Date:</span>{" "}
          {new Date(event.date).toLocaleDateString("en-GB")}
        </p>
      </div>
      <div className="ml-4 text-right flex-shrink-0">
        <p className="mt-1 text-xs text-gray-500">
          Likes: {event.attendees?.length || 0}
        </p>
      </div>
    </article>
  );
}
