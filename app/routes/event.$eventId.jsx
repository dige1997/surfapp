import { Form, useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import mongoose from "mongoose";
import { useEffect, useState } from "react";
import { authenticator } from "../services/auth.server";
import { GoogleMapLoader } from "../components/GoogleMapLoader";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { NavLink } from "react-router-dom";

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

export default function Event() {
  const { event, authUser } = useLoaderData();
  const [city, setCity] = useState(null);

  const location = event?.location
    ? {
        lat: parseFloat(event.location.split(",")[0]),
        lng: parseFloat(event.location.split(",")[1]),
      }
    : null;

  useEffect(() => {
    if (location) {
      const fetchCityName = async () => {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${GOOGLE_MAPS_API_KEY}`;
        try {
          const response = await fetch(geocodeUrl);
          const data = await response.json();

          if (data.results.length > 0) {
            // Filter results to exclude Plus Codes
            const filteredResults = data.results.filter(
              (result) => !result.types.includes("plus_code")
            );

            // Find the best match for city or locality
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
              console.log("Parsed Location:", location);
            }

            // Fallback to administrative area or formatted address
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
      console.log("Parsed Location:", location);
      fetchCityName();
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
      <h3>{event.description}</h3>
      <div className="flex my-2">
        <p className="">{new Date(event.date).toLocaleDateString("en-GB")}</p>
      </div>
      <div className="flex my-2">
        <p className="">{city || "Fetching location..."}</p>
      </div>

      {/* Use GoogleMapLoader to wrap GoogleMap */}
      {location && (
        <GoogleMapLoader>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={location}
            zoom={12}
            options={{
              mapId: MAP_ID,
            }}
          >
            <Marker position={location} />
          </GoogleMap>
        </GoogleMapLoader>
      )}

      <p>{event.attendees.length} Like</p>
      {!attending && authUser ? (
        <Form method="post">
          <button name="_action" value="attend">
            Like
          </button>
        </Form>
      ) : authUser ? (
        <Form method="post">
          <button name="_action" value="unattend">
            Unlike
          </button>
        </Form>
      ) : null}

      {authUser?._id === event?.creator?._id && (
        <div className="flex py-4">
          <Form action="update">
            <button>Update</button>
          </Form>
          <Form action="destroy" method="post">
            <button className="ml-4 text-cancel">Delete this event</button>
          </Form>
        </div>
      )}
    </div>
  );
}
