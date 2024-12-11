import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import EventCard from "../components/EventCard";
import mongoose from "mongoose";
import EventListCards from "../components/EventListCards";
import { Link } from "react-router-dom";
import { useState } from "react";

export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  const userUpdated = await mongoose.models.User.findOne({ _id: user._id })
    .populate("followers", "_id name")
    .populate("following", "_id name");

  const events = await mongoose.models.Event.find({ creator: user._id })
    .populate("creator")
    .populate("attendees");

  const eventsAttending = await mongoose.models.Event.find({
    attendees: user._id,
  })
    .populate("creator")
    .populate("attendees");

  return { user: userUpdated, events, eventsAttending };
}

export default function Profile() {
  const { user, events, eventsAttending } = useLoaderData();
  const [cityUpdates, setCityUpdates] = useState({});
  const [displayedEventsCount, setDisplayedEventsCount] = useState(3);
  const [popupList, setPopupList] = useState({
    visible: false,
    users: [],
    type: "",
  });

  const handleCityUpdate = (eventId, cityName) => {
    setCityUpdates((prev) => ({
      ...prev,
      [eventId]: cityName,
    }));
    console.log(`City updated for event ${eventId}: ${cityName}`);
  };

  const loadMoreEvents = () => {
    setDisplayedEventsCount((prev) => prev + 3);
  };

  const togglePopup = (type) => {
    setPopupList((prev) => ({
      visible: !prev.visible,
      users: type === "followers" ? user.followers : user.following,
      type,
    }));
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
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <div className="py-2">
              <p className="font-semibold">Name: </p>
              <p>{user?.name}</p>
            </div>
            <div>
              <p className="font-semibold">Lastname: </p>
              <p>{user?.lastname}</p>
            </div>
            <div className="py-2">
              <p className="font-semibold">Mail: </p>
              <p>{user?.mail}</p>
            </div>
          </div>
          <div className="flex">
            <div
              className="py-2 cursor-pointer"
              onClick={() => togglePopup("followers")}
            >
              <p className="font-semibold">Followers </p>
              <p className="flex justify-center">{user.followers.length}</p>
            </div>
            <div
              className="p-2 cursor-pointer"
              onClick={() => togglePopup("following")}
            >
              <p className="font-semibold">Following </p>
              <p className="flex justify-center">{user.following.length}</p>
            </div>
          </div>
        </div>

        <Form
          method="post"
          className="items-center w-1/2 bg-gray-100 hover:bg-gray-200 rounded-xl p-2 m-auto"
        >
          <button className="text-cancel flex flex-row font-semibold w-full justify-center">
            Logout
          </button>
        </Form>
      </div>
      <div className="py-6">
        <h2 className="text-2xl font-semibold">Liked posts</h2>
      </div>
      <div>
        {eventsAttending.slice(0, displayedEventsCount).map((event) => (
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
        {eventsAttending.length > displayedEventsCount && (
          <button className="load-more-button" onClick={loadMoreEvents}>
            Load More
          </button>
        )}
      </div>
      <div className="mb-16">
        <h2 className="text-lg font-medium pt-6">Posts by me</h2>
        {events.slice(0, displayedEventsCount).map((event) => (
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
        <div className="flex w-full">
          {events.length > displayedEventsCount && (
            <button
              className="bg-slate-500 justify-center mt-4 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md cursor-pointer m-auto"
              onClick={loadMoreEvents}
            >
              Load More
            </button>
          )}
        </div>
      </div>

      {popupList.visible && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm shadow-lg p-4 z-50">
          <div className="w-96 bg-white shadow-lg p-4 rounded-lg relative max-h-96 overflow-hidden">
            <div className="flex flex-row justify-between">
              <h3 className="text-xl font-semibold ">
                {popupList.type === "followers" ? "Followers" : "Following"}
              </h3>
              <button
                onClick={() =>
                  setPopupList((prev) => ({ ...prev, visible: false }))
                }
                className=" bg-red-500 text-white px-2 py-1 rounded "
              >
                X
              </button>
            </div>
            <ul className="list-disc ml-6">
              {popupList.users.map((user) => (
                <li key={user._id}>{user.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export async function action({ request }) {
  await authenticator.logout(request, { redirectTo: "/main-dashboard" });
}
