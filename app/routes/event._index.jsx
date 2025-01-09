import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import EventListCards from "../components/EventListCards";
import { authenticator } from "../services/auth.server";
import EventCard from "../components/EventCard";
import { useState } from "react";
import EventList from "../components/EventList";

export const meta = () => {
  return [{ title: "Evelation - Post" }];
};

export async function loader({ request }) {
  await authenticator.isAuthenticated(request);
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  try {
    const events = await mongoose.models.Event.find()
      .populate("creator")
      .populate("attendees")
      .sort({ createdAt: -1 });

    return json({ events: events || [], googleMapsApiKey }); // Return an empty array if events is undefined
  } catch (error) {
    console.error("Error fetching events:", error);
    return json({ googleMapsApiKey, events: [] }); // Return empty array in case of an error
  }
}

export default function Index() {
  const { events, googleMapsApiKey } = useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");
  const [eventCities, setEventCities] = useState({});
  const [displayedEventsCount, setDisplayedEventsCount] = useState(6);
  const [sortOption, setSortOption] = useState("newest"); // Sorting options

  const updateCity = (eventId, city) => {
    setEventCities((prev) => ({
      ...prev,
      [eventId]: city,
    }));
  };

  const loadMoreEvents = () => {
    setDisplayedEventsCount((prevCount) => prevCount + 6);
  };

  // Sort and filter events
  const sortedAndFilteredEvents = events
    .filter((event) => {
      const city = (eventCities[event._id] || "").toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();

      return (
        Object.values(event).some(
          (value) =>
            value != null && // Ensure value is not null or undefined
            value.toString().toLowerCase().includes(searchTermLower)
        ) || city.includes(searchTermLower)
      );
    })

    .sort((a, b) => {
      if (sortOption === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOption === "mostLikes")
        return (b.attendees?.length || 0) - (a.attendees?.length || 0);
      return 0; // Default to no additional sorting
    })
    .slice(0, displayedEventsCount);

  return (
    <div className="page">
      <div className="w-full flex justify-center flex-col">
        <div className=" flex  flex-col mx-auto p-6">
          <h2 className="font-bold text-4xl text-gray-950">
            Discover new surfspots
          </h2>
          <p className="text-gray-700 pb-4">Find spots</p>
          <h1 className="text-2xl font-semibold w-2/3 py-4">All spots</h1>
        </div>
        <Form
          className="h-12 bg-background flex items-center gap-x-4 rounded-2xl my-2"
          id="search-form"
          role="search"
        >
          <div className="w-full flex justify-center">
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
                viewBox="0 0 24 24"
              >
                <path d="M 9 2 C 5.1458514 2 2 5.1458514 2 9 C 2 12.854149 5.1458514 16 9 16 C 10.747998 16 12.345009 15.348024 13.574219 14.28125 L 14 14.707031 L 14 16 L 20 22 L 22 20 L 16 14 L 14.707031 14 L 14.28125 13.574219 C 15.348024 12.345009 16 10.747998 16 9 C 16 5.1458514 12.854149 2 9 2 z M 9 4 C 11.773268 4 14 6.2267316 14 9 C 14 11.773268 11.773268 14 9 14 C 6.2267316 14 4 11.773268 4 9 C 4 6.2267316 6.2267316 4 9 4 z"></path>
              </svg>
            </div>
          </div>
        </Form>

        {/* Sorting Options */}
        <div className="w-11/12 flex flex-col justify-center mx-auto">
          <div className="flex justify-end items-center gap-x-4 mt-4">
            <label htmlFor="sort" className="text-gray-700">
              Sort by:
            </label>
            <select
              id="sort"
              className="bg-slate-50 rounded-md px-2 py-1"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="mostLikes">Most Likes</option>
            </select>
          </div>

          <div className="flex justify-center w-full flex-col">
            <section className="grid-cols-1 ">
              {sortedAndFilteredEvents.map((event) => (
                <Link
                  key={event._id}
                  className="event-link"
                  to={`/event/${event._id}`}
                >
                  <div className="flex m-auto">
                    <EventList
                      event={event}
                      onCityUpdate={updateCity}
                      apiKey={googleMapsApiKey}
                    />
                  </div>
                </Link>
              ))}
            </section>
            {events.length > displayedEventsCount && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md cursor-pointer m-auto mt-4"
                onClick={loadMoreEvents}
              >
                Load More
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
