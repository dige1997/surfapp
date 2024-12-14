import React, { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyAJRJzkSO54nHodtQJF-xAPcEwL5q7_NHA";
const MAP_ID = "71f267d426ae7773";

export default function ShowAllLocations({ events }) {
  const [locations, setLocations] = useState([]);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null); // Reference for the InfoWindow
  const geocoderRef = useRef(null); // Reference for Geocoding

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (events) {
      const eventLocations = events.map((event) => {
        const [lat, lng] = event.location.split(",").map(Number);
        return { lat, lng, title: event.title || "Event Location" };
      });
      setLocations(eventLocations);
    }
  }, [events]);

  useEffect(() => {
    if (isLoaded && locations.length > 0 && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: locations[0], // Center map at the first location
        zoom: 8,
        mapId: MAP_ID,
      });

      // Initialize InfoWindow and Geocoder
      infoWindowRef.current = new window.google.maps.InfoWindow();
      geocoderRef.current = new window.google.maps.Geocoder();

      // Add markers with click event listeners
      locations.forEach((location) => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map,
          title: location.title,
        });

        // Add a click listener to show the InfoWindow with city name
        marker.addListener("click", () => {
          geocoderRef.current.geocode(
            { location: { lat: location.lat, lng: location.lng } },
            (results, status) => {
              if (status === "OK" && results[0]) {
                const city = results.find((result) =>
                  result.types.includes("locality")
                )?.formatted_address;

                const infoContent = `
                  <div>
                    <h3>${location.title}</h3>
                    <p>City: ${city || "Unknown"}</p>
                    <p>Latitude: ${location.lat}</p>
                    <p>Longitude: ${location.lng}</p>
                  </div>
                `;
                infoWindowRef.current.setContent(infoContent);
                infoWindowRef.current.open(map, marker);
              } else {
                console.error("Geocoder failed:", status);
                infoWindowRef.current.setContent(`
                  <div>
                    <h3>${location.title}</h3>
                    <p>Latitude: ${location.lat}</p>
                    <p>Longitude: ${location.lng}</p>
                    <p>City: Unable to fetch</p>
                  </div>
                `);
                infoWindowRef.current.open(map, marker);
              }
            }
          );
        });
      });
    }
  }, [isLoaded, locations]);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}
