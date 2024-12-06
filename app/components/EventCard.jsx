import { useEffect, useState } from "react";
import axios from "axios";

export default function EventCard({ event, onCityUpdate }) {
  const [city, setCity] = useState(null);

  const normalizeCityName = (cityName) => {
    // Normalize the string by removing diacritical marks (accents) and making the name lowercase
    return cityName
      .normalize("NFD") // Decompose combined characters into base characters + diacritics
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .toLowerCase(); // Convert to lowercase for consistency
  };

  const fetchCityFromCoordinates = async (lat, lng) => {
    const apiKey = "AIzaSyC8mGRx4SS4NLfyl7AIOhktrM_F9EOHWYQ"; // Replace with your Google API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

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

        const normalizedCity = normalizeCityName(nearestCity); // Normalize the city name
        setCity(normalizedCity);
        onCityUpdate(event._id, normalizedCity); // Update the parent with the city
      } else {
        const normalizedCity = normalizeCityName("Unknown location");
        setCity(normalizedCity);
        onCityUpdate(event._id, normalizedCity);
      }
    } catch (error) {
      console.error("Error fetching city:", error);
      const normalizedCity = normalizeCityName("Error fetching location");
      setCity(normalizedCity);
      onCityUpdate(event._id, normalizedCity);
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
        const normalizedCity = normalizeCityName("No location available");
        setCity(normalizedCity);
        onCityUpdate(event._id, normalizedCity);
      }
    }
  }, [event.location]);

  return (
    <article className="flex p-4 rounded-xl shadow-lg w-full bg-slate-50">
      <div
        className="w-full rounded-xl"
        style={{
          backgroundImage: `url(${event?.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="flex flex-col w-full">
        <div className="p-2 ml-4">
          <h2 className="text-xl font-bold mb-2">{event.title}</h2>
          <p className="text-gray-500">{event?.creator?.name}</p>
        </div>
        <div className="flex flex-col flex-grow ml-4">
          <div className="flex p-2">
            <div className="col-span-2">
              <div className="flex items-center">
                <h3 className="font-semibold mr-1">Date: </h3>
                <p>{new Date(event.date).toLocaleDateString("en-GB")}</p>
              </div>
              <div className="flex items-center">
                <h3 className="mr-1 font-semibold">Location: </h3>
                <p>{city || "Fetching city..."}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 mt-4 ml-2">
            <h3 className="mb-2 font-semibold">Description:</h3>
            <p className="truncate">{event.description}</p>
            <p className="mt-4 flex items-center font-semibold">
              Likes: {event.attendees?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
