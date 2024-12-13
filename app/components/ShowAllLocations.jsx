import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { GoogleMapLoader } from "./GoogleMapLoader";
import mongoose from "mongoose";

// Assuming mongoose connection is set up elsewhere in your project
const ShowAllLocations = () => {
  const apiKey = "AIzaSyAJRJzkSO54nHodtQJF-xAPcEwL5q7_NHA"; // Replace with your Google Maps API Key

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Make sure mongoose models are properly set up and connected
        if (!mongoose.models.Event) {
          throw new Error("Mongoose model 'Event' is not defined");
        }

        const Event = mongoose.models.Event; // Access your Event model
        const events = await Event.find({}, { location: 1 }); // Only fetch location field
        const coordinates = events.map((event) => {
          // Assuming location string format: "latitude,longitude"
          const [lat, lng] = event.location.split(",").map(Number);
          return { lat, lng };
        });
        setLocations(coordinates);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchLocations();
  }, []); // No dependencies array means it will run once on mount

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <GoogleMap
        center={{ lat: 0, lng: 0 }} // Center point for the map
        zoom={3} // Zoom level
        mapContainerStyle={{ width: "100%", height: "100%" }}
      >
        {locations.map((location, index) => (
          <Marker key={index} position={location} />
        ))}
      </GoogleMap>
    </div>
  );
};

export default ShowAllLocations;
