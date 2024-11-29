import { useLoaderData } from "@remix-run/react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect, useRef } from "react";
import { json } from "@remix-run/node";
import mongoose from "mongoose";
import EventListCards from "../components/EventListCards";
import EventCard from "../components/EventCard";

const GOOGLE_MAPS_API_KEY = "AIzaSyC8mGRx4SS4NLfyl7AIOhktrM_F9EOHWY";
const MAP_ID = "71f267d426ae7773"; // Replace with your actual Map ID

export const meta = () => {
  return [{ title: "Evelation - Post" }];
};

export async function loader({ request }) {
  const event = await mongoose.models.Event.find()
    .populate("creator")
    .populate("attendees");

  return json({ event });
}

export default function Index() {
  const { event } = useLoaderData();
  const [center] = useState({ lat: 41.0082, lng: 28.9784 }); // Default center (Istanbul)
  const mapRef = useRef();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page">
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={center}
          zoom={6}
          onLoad={(map) => {
            mapRef.current = map;
            map.setOptions({
              mapId: MAP_ID,
            });
          }}
        >
          {event.map(
            (evt) =>
              evt.location && ( // Ensure the event has location data
                <Marker
                  key={evt._id}
                  position={{
                    lat: evt.location.lat,
                    lng: evt.location.lng,
                  }}
                  title={evt.title}
                />
              )
          )}
        </GoogleMap>
      </div>
      <section className="events-list">
        {event.map((evt) => (
          <div key={evt._id} className="event-item">
            <EventCard event={evt} />
          </div>
        ))}
      </section>
    </div>
  );
}
