import { Form, useLoaderData, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import mongoose from "mongoose";
import { useEffect, useState, useRef } from "react";
import { authenticator } from "../services/auth.server";
import { GoogleMapLoader } from "../components/GoogleMapLoader";
import { NavLink } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = "AIzaSyAJRJzkSO54nHodtQJF-xAPcEwL5q7_NHA";
const MAP_ID = "71f267d426ae7773"; // Replace with your actual Map ID

export function meta({ data }) {
  return [
    {
      title: `Evelation - ${data.event.title || "Event"}`,
    },
  ];
}

export async function loader({ request, params }) {
  const authUser = await authenticator.isAuthenticated(request);
  const event = await mongoose.models.Event.findById(params.eventId)
    .populate("attendees")
    .populate("creator");
  return json({ event, authUser });
}

export async function action({ request, params }) {
  const formData = new URLSearchParams(await request.text());
  const action = formData.get("_action");
  const authUser = await authenticator.isAuthenticated(request);

  if (!authUser) {
    throw new Error("User not authenticated");
  }

  const eventId = params.eventId;
  const Event = mongoose.models.Event;

  if (action === "attend") {
    await Event.findByIdAndUpdate(eventId, {
      $addToSet: { attendees: authUser._id },
    });
  } else if (action === "unattend") {
    await Event.findByIdAndUpdate(eventId, {
      $pull: { attendees: authUser._id },
    });
  }

  return redirect(`/event/${eventId}`);
}

export default function Event() {
  const { event, authUser } = useLoaderData();
  const [city, setCity] = useState(null);
  const mapRef = useRef(null);

  const location = event?.location
    ? {
        lat: parseFloat(event.location.split(",")[0]),
        lng: parseFloat(event.location.split(",")[1]),
      }
    : null;

  useEffect(() => {
    if (location) {
      const fetchCityName = async () => {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${GOOGLE_MAPS_API_KEY}
`;
        try {
          const response = await fetch(geocodeUrl);
          const data = await response.json();

          if (data.results.length > 0) {
            const filteredResults = data.results.filter(
              (result) => !result.types.includes("plus_code")
            );
            const cityResult = filteredResults.find((result) =>
              result.types.includes("locality")
            );

            if (cityResult) {
              const cityComponent = cityResult.address_components.find(
                (component) => component.types.includes("locality")
              );
              if (cityComponent) {
                setCity(cityComponent.long_name);
                return;
              }
            }

            const fallbackResult = filteredResults[0];
            setCity(fallbackResult?.formatted_address || "Unknown Location");
          } else {
            setCity("Unknown Location");
          }
        } catch (error) {
          console.error("Error fetching city name:", error);
          setCity("Error fetching location");
        }
      };
      fetchCityName();
    }
  }, [location]);

  useEffect(() => {
    if (location && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 12,
        mapId: MAP_ID,
      });

      if (window.google.maps.marker?.AdvancedMarkerView) {
        const advancedMarker = new window.google.maps.marker.AdvancedMarkerView(
          {
            position: location,
            map,
            content: `<div style="background-color: #fff; border: 2px solid #007BFF; border-radius: 8px; padding: 8px; font-size: 14px; text-align: center;">Event Location</div>`,
          }
        );

        advancedMarker.addListener("click", () => {
          alert("You clicked the marker!");
        });
      } else {
        console.warn("AdvancedMarkerView is not available.");
        new window.google.maps.Marker({
          position: location,
          map,
          title: "Event Location",
        });
      }
    }
  }, [location]);

  const attending = event?.attendees?.some(
    (attendee) => attendee._id === authUser?._id
  );

  return (
    <div
      id="event-page"
      className="page max-w-5xl flex flex-col justify-center m-auto p-6"
    >
      <div
        className="h-96 w-full flex rounded-xl"
        style={{
          backgroundImage: `url(${event?.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="my-4">
        <h1 className="text-3xl">{event.title}</h1>
        <p className="text-gray-500">
          Post by:{" "}
          <NavLink
            to={`/userProfile/${event?.creator?._id}`}
            className="text-blue-500 hover:underline"
          >
            {event?.creator?.name}
          </NavLink>
        </p>
      </div>
      <h3 className="text-gray-500 font-bold">Description</h3>
      <p>{event.description}</p>
      <div className="flex flex-col my-2">
        <p>Date</p>
        <p className="">{new Date(event.date).toLocaleDateString("en-GB")}</p>
      </div>
      <div className="flex my-2">
        <p className="">{city || "Fetching location..."}</p>
      </div>

      {location && (
        <GoogleMapLoader>
          <div ref={mapRef} style={{ width: "100%", height: "400px" }}></div>
        </GoogleMapLoader>
      )}
      <div className="flex items-center gap-4 mt-4 justify-between">
        <div className="flex gap-2 items-center">
          <p>💙 {event.attendees.length}</p>
          {!attending && authUser ? (
            <Form method="post">
              <button
                type="submit"
                name="_action"
                value="attend"
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Like
              </button>
            </Form>
          ) : authUser ? (
            <Form method="post">
              <button
                type="submit"
                name="_action"
                value="unattend"
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                Unlike
              </button>
            </Form>
          ) : null}
        </div>
        <div>
          {authUser?._id === event?.creator?._id && (
            <div className="flex py-4">
              <Form action="update">
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600">
                  Update
                </button>
              </Form>
              <Form action="destroy" method="post">
                <button
                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  onClick={(e) => {
                    if (
                      !window.confirm(
                        "Are you sure you want to delete this post?"
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                >
                  Delete this event
                </button>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
