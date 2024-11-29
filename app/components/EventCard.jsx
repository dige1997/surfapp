import { useEffect, useState } from "react";
import axios from "axios";

export default function EventCard({ event }) {
  const [city, setCity] = useState(null);

  const fetchCityFromCoordinates = async (lat, lng) => {
    const apiKey = "AIzaSyC8mGRx4SS4NLfyl7AIOhktrM_F9EOHWYQ"; // Replace with your Google API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      console.log("Google Maps API Response:", response.data); // Log the full response for inspection

      const results = response.data.results;
      if (results.length > 0) {
        const addressComponents = results[0].address_components;
        console.log("Address Components:", addressComponents); // Log the address components for debugging

        // Try finding 'locality', 'administrative_area_level_1', or other components
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

        console.log("Nearest City:", nearestCity); // Log the found city name
        setCity(nearestCity); // Set city state
      } else {
        console.log("No results found for coordinates.");
        setCity("Unknown location"); // Fallback if no city is found
      }
    } catch (error) {
      console.error("Error fetching city:", error);
      setCity("Error fetching location"); // Handle error
    }
  };

  useEffect(() => {
    if (event.location) {
      // Split the coordinates string into an array of [lat, lng]
      const [lat, lng] = event.location
        .split(",")
        .map((coord) => parseFloat(coord.trim()));

      // Check if lat and lng are valid numbers
      if (!isNaN(lat) && !isNaN(lng)) {
        console.log("Event Coordinates:", lat, lng); // Log coordinates to check
        fetchCityFromCoordinates(lat, lng);
      } else {
        console.log("Invalid event coordinates:", event.location); // Log if coordinates are invalid
        setCity("No location available");
      }
    } else {
      console.log("No location data found for event.");
      setCity("No location available");
    }
  }, [event.location]);

  useEffect(() => {
    console.log("City state updated:", city); // Log the updated city
  }, [city]);

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
