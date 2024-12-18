import { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { authenticator } from "../services/auth.server";
import mongoose from "mongoose";
import { json, redirect } from "@remix-run/node";
import { GoogleMapLoader } from "../components/GoogleMapLoader";

const MAP_ID = "71f267d426ae7773";

export async function loader({ request, params }) {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  const event = await mongoose.models.Event.findById(params.eventId).populate(
    "creator"
  );

  if (!event) {
    throw new Response("Event not found", { status: 404 });
  }

  if (event.creator._id.toString() !== user._id.toString()) {
    return redirect("/dashboard");
  }

  return json({ event, googleMapsApiKey });
}

export default function UpdateEvent() {
  const { event, googleMapsApiKey } = useLoaderData();
  const [image, setImage] = useState(event.image);
  const [location, setLocation] = useState(
    event.location
      ? Array.isArray(event.location)
        ? event.location
        : event.location.split(",").map((coord) => parseFloat(coord.trim()))
      : null
  );
  const [center, setCenter] = useState(
    location
      ? { lat: location[0], lng: location[1] }
      : { lat: 41.0082, lng: 28.9784 }
  );
  const mapRef = useRef(null);
  const markerRef = useRef(null); // Ref for marker instance
  const navigate = useNavigate();

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    if (typeof lat === "number" && typeof lng === "number") {
      setLocation([lat, lng]);
      setCenter({ lat, lng });
    } else {
      console.error("Invalid coordinates:", lat, lng);
    }
  };

  const handleCancel = () => navigate("/dashboard");

  useEffect(() => {
    if (location && mapRef.current) {
      const [lat, lng] = location;
      if (typeof lat === "number" && typeof lng === "number") {
        mapRef.current.panTo({ lat, lng });
      } else {
        console.error("Invalid location:", location);
      }
    }
  }, [location]);

  // Handle marker creation and update
  useEffect(() => {
    if (!mapRef.current) return;

    if (!markerRef.current) {
      // Create the marker if it doesn't exist
      markerRef.current = new google.maps.Marker({
        map: mapRef.current,
        position: center,
        title: "Selected Location",
      });
    } else {
      // Update marker position if it exists
      markerRef.current.setPosition(center);
    }
  }, [center]); // Trigger when center changes

  const parsedLocation = location
    ? { lat: location[0], lng: location[1] }
    : { lat: 41.0082, lng: 28.9784 };

  return (
    <div className="page w-full flex-col gap-y-4 justify-center mt-4 mb-4 p-8">
      <h1 className="m-auto flex justify-center font-semibold text-2xl mb-6">
        Update Event
      </h1>
      <Form
        id="event-form"
        method="post"
        className="rounded-lg font-semibold max-w-lg justify-center m-auto flex flex-col gap-y-4 p-4"
      >
        <label htmlFor="title">Post Title</label>
        <input
          required
          id="title"
          name="title"
          type="text"
          defaultValue={event.title}
          placeholder="Write a title..."
          className="rounded-xl p-2 border-gray-400 border"
        />

        <label htmlFor="description">Description</label>
        <textarea
          required
          id="description"
          name="description"
          defaultValue={event.description}
          placeholder="Write a description..."
          className="rounded-xl p-2 border-gray-400 border"
        />

        <label htmlFor="date">Date</label>
        <input
          required
          id="date"
          name="date"
          type="date"
          defaultValue={event.date.split("T")[0]}
          className="rounded-xl p-2 border-gray-400 border"
        />

        <label htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          type="text"
          readOnly
          placeholder="Click on the map to select a location"
          value={location ? location.join(", ") : ""}
          className="rounded-xl p-2 border-gray-400 border"
        />

        <GoogleMapLoader apiKey={googleMapsApiKey}>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={parsedLocation}
            zoom={12}
            onClick={handleMapClick}
            onLoad={(map) => {
              mapRef.current = map;
              map.setOptions({
                mapId: MAP_ID,
              });
            }}
          >
            {/* Map overlay */}
          </GoogleMap>
        </GoogleMapLoader>

        <label htmlFor="image">Image URL</label>
        <input
          required
          id="image"
          name="image"
          type="url"
          defaultValue={event.image}
          placeholder="Paste an image URL..."
          onChange={(e) => setImage(e.target.value)}
          className="rounded-xl p-2 border-gray-400 border"
        />

        <label htmlFor="image-preview">Image Preview</label>
        <img
          id="image-preview"
          src={image}
          alt="Preview"
          className="image-preview m-auto rounded-xl"
        />

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-accent hover:bg-primary hover:text-background p-2 rounded-lg"
          >
            Save
          </button>
          <button
            type="button"
            className="text-cancel p-2 rounded-lg"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request, params }) {
  const authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  const eventToUpdate = await mongoose.models.Event.findById(params.eventId);

  if (
    !eventToUpdate ||
    eventToUpdate.creator.toString() !== authUser._id.toString()
  ) {
    return redirect(`/dashboard`);
  }

  const formData = await request.formData();
  const updatedEvent = Object.fromEntries(formData);

  Object.assign(eventToUpdate, updatedEvent);
  eventToUpdate.location = updatedEvent.location;

  await eventToUpdate.save();

  return redirect(`/event/${params.eventId}`);
}
