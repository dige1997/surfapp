import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import EventCard from "../components/EventCard";
import mongoose from "mongoose";
import EventListCards from "../components/EventListCards";
import { Link } from "react-router-dom";
import { useState } from "react";

export async function loader({ request }) {
  // Fetch user
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  // Fetch events created by the user
  const events = await mongoose.models.Event.find({ creator: user._id })
    .populate("creator")
    .populate("attendees");

  // Fetch events the user is attending
  const eventsAttending = await mongoose.models.Event.find({
    attendees: user._id,
  })
    .populate("creator")
    .populate("attendees");

  const userUpdated = await mongoose.models.User.findOne({ _id: user._id })
    .populate("followers", "_id name")
    .populate("following", "_id name");

  // Return user, events created by the user, and events the user is attending
  return { user: userUpdated, events, eventsAttending };
}

export default function Profile() {
  const { user, events, eventsAttending } = useLoaderData();
  const [cityUpdates, setCityUpdates] = useState({});
  const handleCityUpdate = (eventId, cityName) => {
    setCityUpdates((prev) => ({
      ...prev,
      [eventId]: cityName,
    }));
    console.log(`City updated for event ${eventId}: ${cityName}`);
  };

  return (
    <div className="page flex flex-col justify-center m-auto w-4/6">
      <div className="w-full flex flex-col justify-center m-auto my-8">
        <div className="flex justify-between">
          <h1 className="font-semibold text-xl">Profile</h1>
          <Form>
            <Link to={`/profile/${user._id}/update`}>
              <button>
                <svg
                  width="30px"
                  height="30px"
                  className="hover:stroke-gray-400 stroke-black"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Complete">
                    <g id="edit">
                      <g>
                        <path
                          d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                        <polygon
                          fill="none"
                          points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              </button>
            </Link>
          </Form>
        </div>
        <div className="flex flex-col">
          <div className="py-2">
            <p className="font-semibold">Name: </p>
            <p>{user?.name}</p>
          </div>
          <div className="py-2">
            <p className="font-semibold">Mail: </p>
            <p>{user?.mail}</p>
          </div>
          <div className="py-2">
            <p className="font-semibold">Followers: </p>
            <p>{user.followers.length}</p>
          </div>
          <div className="py-2">
            <p className="font-semibold">Following: </p>
            <p>{user.following.length}</p>
          </div>
        </div>

        <Form
          method="post"
          className="items-center w-1/2 bg-gray-100 hover:bg-gray-200 rounded-xl p-2 m-auto"
        >
          <div className="">
            <button className="text-cancel flex flex-row font-semibold w-full justify-center">
              Logout
            </button>
          </div>
        </Form>
      </div>
      <div className="py-6">
        <h2 className="text-2xl font-semibold">Liked posts</h2>
      </div>
      <div>
        {eventsAttending.map((event) => (
          <div key={event._id}>
            <Link className="event-link" to={`/event/${event._id}`}>
              <div className=" md:hidden ">
                <EventListCards event={event} />
              </div>
              <div className="hidden md:block">
                <EventCard event={event} />
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="mb-16">
        <h2 className="text-lg font-medium pt-6">Posts by me</h2>
        {events.map((event) => (
          <div key={event._id}>
            <Link className="event-link" to={`/event/${event._id}`}>
              <div className=" md:hidden ">
                <EventListCards event={event} />
              </div>
              <div className="hidden md:block">
                <EventCard event={event} onCityUpdate={handleCityUpdate} />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function action({ request }) {
  await authenticator.logout(request, { redirectTo: "/main-dashboard" });
}
