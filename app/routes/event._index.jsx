import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import EventListCards from "../components/EventListCards";
import { authenticator } from "../services/auth.server";
import EventCard from "../components/EventCard";
import { useState, useEffect } from "react";

export const meta = () => {
  return [{ title: "Evelation - Post" }];
};

export async function loader({ request }) {
  await authenticator.isAuthenticated(request);

  const event = await mongoose.models.Event.find()
    .populate("creator")
    .populate("attendees");

  return json({ event });
}

export default function Index() {
  const { event } = useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");
  const [eventCities, setEventCities] = useState({});
  const [displayedEventsCount, setDisplayedEventsCount] = useState(6);

  // Update the city in the eventCities state
  const updateCity = (eventId, city) => {
    setEventCities((prev) => ({
      ...prev,
      [eventId]: city,
    }));
  };

  const loadMoreEvents = () => {
    setDisplayedEventsCount((prevCount) => prevCount + 6);
  };

  const filteredEvents = event
    .filter((event) => {
      // Get the city from the eventCities state, ensuring it's lowercase for case-insensitivity
      const city = (eventCities[event._id] || "").toLowerCase();

      // Convert searchTerm to lowercase for case-insensitive matching
      const searchTermLower = searchTerm.toLowerCase();

      // Check if any of the event fields or the city includes the searchTerm
      return (
        Object.values(event).some((value) =>
          value.toString().toLowerCase().includes(searchTermLower)
        ) || city.includes(searchTermLower) // Include city in the search, case-insensitive
      );
    })
    .slice(0, displayedEventsCount); // Limit to displayedEventsCount

  return (
    <div className="page">
      <p className="text-gray-50 pb-4">Find and get inspired for surf</p>
      <Form
        className=" h-12  bg-background  flex items-center  gap-x-4  rounded-2xl my-2 "
        id="search-form"
        role="search"
      >
        <div className="w-full flex  justify-center">
          <div className="flex w-64 bg-slate-50 rounded-2xl items-center p-2 justify-between">
            <input
              className="bg-slate-50 flex"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts"
            />
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 24 24"
            >
              <path d="M 9 2 C 5.1458514 2 2 5.1458514 2 9 C 2 12.854149 5.1458514 16 9 16 C 10.747998 16 12.345009 15.348024 13.574219 14.28125 L 14 14.707031 L 14 16 L 20 22 L 22 20 L 16 14 L 14.707031 14 L 14.28125 13.574219 C 15.348024 12.345009 16 10.747998 16 9 C 16 5.1458514 12.854149 2 9 2 z M 9 4 C 11.773268 4 14 6.2267316 14 9 C 14 11.773268 11.773268 14 9 14 C 6.2267316 14 4 11.773268 4 9 C 4 6.2267316 6.2267316 4 9 4 z"></path>
            </svg>
          </div>
        </div>
      </Form>
      <div className="flex justify-center w-full flex-col">
        <div className="md:hidden p-6">
          <h2 className="font-bold text-4xl text-gray-950  ">
            Discover new surfspots
          </h2>
          <p className="text-gray-700 pb-4">Find spots</p>
          <h1 className="text-2xl font-semibold w-2/3  py-4">All spots</h1>
        </div>
        <section className="grid-cols-1 mt-8 ">
          {filteredEvents.map((event) => (
            <Link
              key={event._id}
              className="event-link"
              to={`/event/${event._id}`}
            >
              <div className=" md:hidden w-3/4">
                <EventListCards event={event} />
              </div>
              <div className="md:flex hidden w-2/3 m-auto">
                <EventCard event={event} onCityUpdate={updateCity} />
              </div>
            </Link>
          ))}
        </section>
        {event.length > displayedEventsCount && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md cursor-pointer m-auto mt-4"
            onClick={loadMoreEvents}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
