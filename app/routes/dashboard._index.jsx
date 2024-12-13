import { useState } from "react"; // Import useState
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server";
import DashboardData from "../components/DashboardData";
import EventListCards from "../components/EventListCards";
import EventCard from "../components/EventCard";

export const meta = () => {
  return [{ title: "Remix Post App" }];
};

export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    return json({ mostLikedEvents: [] });
  }

  // Fetch the top 3 most liked events
  const mostLikedEvents = await mongoose.models.Event.find()
    .sort({ attendees: -1 }) // Sort by attendees array length in descending order
    .limit(3) // Limit to 3 events
    .populate("creator") // Populate creator field
    .populate("attendees"); // Populate attendees field

  return json({ mostLikedEvents }); // Return the most liked events
}

export default function Index() {
  const { mostLikedEvents } = useLoaderData();
  const [eventCities, setEventCities] = useState({}); // Initialize the state for event cities

  // Handle the case where there are no events
  if (!mostLikedEvents || mostLikedEvents.length === 0) {
    return (
      <div className="page">
        <DashboardData />
        <p>No events available at the moment.</p>
      </div>
    );
  }

  // Update city for a specific event
  const updateCity = (eventId, city) => {
    setEventCities((prev) => ({
      ...prev,
      [eventId]: city,
    }));
  };

  return (
    <div className="page">
      <DashboardData />
      <div className="md:p-8 p-4">
        <h2 className="font-bold text-2xl">Most liked posts</h2>
        {mostLikedEvents.map((event) => (
          <Link
            key={event._id}
            className="event-link"
            to={`/event/${event._id}`}
          >
            <div className="md:hidden w-full flex justify-center">
              <EventListCards event={event} />
            </div>
            <div className="hidden md:flex w-full justify-center">
              <EventCard event={event} onCityUpdate={updateCity} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
