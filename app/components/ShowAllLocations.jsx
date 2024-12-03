import { GoogleMap, Marker } from "@react-google-maps/api";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import mongoose from "mongoose";
import { GoogleMapLoader } from "../components/GoogleMapLoader";

const MAP_ID = "71f267d426ae7773";

export async function loader() {
  const events = await mongoose.models.Event.find({}, "location title").exec();

  // Log raw data
  console.log("Fetched Events:", events);

  // Transform location strings into lat/lng objects
  const locations = events
    .filter((event) => event.location) // Ensure the location exists
    .map((event) => {
      const [lat, lng] = event.location.split(",").map(Number);
      return { name: event.title, lat, lng };
    });

  // Log transformed data
  console.log("Transformed Locations:", locations);

  return json({ locations });
}

export default function ShowAllLocations() {
  const { locations = [] } = useLoaderData() || {};

  // Log the data
  console.log("Locations to display on the map:", locations);

  return (
    <GoogleMapLoader>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "500px" }}
        center={
          locations.length > 0
            ? { lat: locations[0].lat, lng: locations[0].lng }
            : { lat: 41.015137, lng: 28.97953 } // Default to Istanbul
        }
        zoom={locations.length > 0 ? 10 : 5}
        options={{
          mapId: "71f267d426ae7773",
        }}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.name}
          />
        ))}
      </GoogleMap>
    </GoogleMapLoader>
  );
}
