import { useLoaderData } from "@remix-run/react";
import ShowAllLocations from "../components/ShowAllLocations"; // Adjust the import path
import mongoose from "mongoose";
import { json } from "@remix-run/node";

// Loader for fetching events
export async function loader() {
  const events = await mongoose.models.Event.find({});
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  return json({ events, googleMapsApiKey });
}

export default function LocationsPage() {
  const { events, googleMapsApiKey } = useLoaderData();

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ShowAllLocations events={events} apiKey={googleMapsApiKey} />
    </div>
  );
}
