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
    return json({ mostLikedEvent: null });
  }

  const mostLikedEvent = await mongoose.models.Event.findOne()
    .sort({ attendees: -1 }) // Sort by attendees array length in descending order
    .populate("creator") // Populate creator field
    .populate("attendees"); // Populate attendees field

  return json({ mostLikedEvent }); // Return the most liked event
}

export default function Index() {
  const { mostLikedEvent } = useLoaderData(); // Get the most liked event from the loader

  // Handle the case where there are no events
  if (!mostLikedEvent) {
    return (
      <div className="page">
        <DashboardData />
        <p>No events available at the moment.</p>
      </div>
    );
  }

  // Render the most liked event
  return (
    <div className="page">
      <DashboardData />
      <div className=" p-4">
        <Link
          key={mostLikedEvent._id}
          className="event-link"
          to={`/event/${mostLikedEvent._id}`}
        >
          <div className="md:hidden w-full flex justify-center">
            <EventListCards event={mostLikedEvent} />
          </div>
          <div className="hidden md:flex  w-full  justify-center">
            <EventCard event={mostLikedEvent} />
          </div>
        </Link>
      </div>
    </div>
  );
}
