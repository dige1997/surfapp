import { Form, useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import mongoose from "mongoose";
import { useEffect, useState } from "react";
import { authenticator } from "../services/auth.server";
import { GoogleMapLoader } from "../components/GoogleMapLoader";
import { GoogleMap, Marker } from "@react-google-maps/api";

const MAP_ID = "71f267d426ae7773"; // Replace with your actual Map ID

export async function loader() {
  let locations = [];

  try {
    const events = await mongoose.models.Event.find({}, "location").exec();

    if (events && events.length > 0) {
      locations = events
        .map((event) => {
          if (event.location) {
            const [lat, lng] = event.location.split(",").map(Number);
            console.log(
              `Event ID: ${event._id}, Latitude: ${lat}, Longitude: ${lng}`
            );
            // Ensure lat and lng are valid numbers
            if (!isNaN(lat) && !isNaN(lng)) {
              return { lat, lng };
            }
          }
          return null;
        })
        .filter((location) => location !== null); // Filter out null values which represent invalid or undefined locations
    } else {
      console.warn("No events found in the database.");
    }
  } catch (error) {
    console.error("Database query error:", error);
  }

  return json({ locations });
}

export default function ShowAllLocations() {
  const { locations = [] } = useLoaderData() || {};
  const [center, setCenter] = useState({ lat: 56.2639, lng: 9.5018 }); // Default to Denmark

  useEffect(() => {
    // Get the user's geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Geolocation error:", error);
      }
    );
  }, []);

  // Log the data
  console.log("Locations to display on the map:", locations);

  return (
    <GoogleMapLoader>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "500px" }}
        center={center}
        zoom={locations.length > 0 ? 10 : 5}
        options={{
          mapId: MAP_ID,
        }}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
          />
        ))}
      </GoogleMap>
    </GoogleMapLoader>
  );
}
