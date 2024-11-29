import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { authenticator } from "../services/auth.server";
import mongoose from "mongoose";
import { redirect } from "@remix-run/node";

const GOOGLE_MAPS_API_KEY = "AIzaSyC8mGRx4SS4NLfyl7AIOhktrM_F9EOHWYQ";

const mapLibraries = ["marker"];
const MAP_ID = "71f267d426ae7773"; // Replace with your actual Map ID

export async function loader({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
}

export default function AddEvent() {
  const [image, setImage] = useState(
    "https://placehold.co/600x400?text=Add+your+amazing+image"
  );
  const [location, setLocation] = useState(null);
  const [center] = useState({ lat: 41.0082, lng: 28.9784 }); // Istanbul coordinates
  const mapRef = useRef();
  const navigate = useNavigate();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: mapLibraries,
  });

  const handleMapClick = (event) => {
    setLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleCancel = () => navigate("/dashboard");

  useEffect(() => {
    if (location && mapRef.current && window.google) {
      const map = mapRef.current;

      // Check if AdvancedMarkerElement is available
      if (google.maps.marker.AdvancedMarkerElement) {
        const markerContent = document.createElement("div");
        markerContent.style.fontSize = "24px";

        new google.maps.marker.AdvancedMarkerElement({
          position: location,
          map: map,
          content: markerContent,
        });
      } else {
        console.warn("AdvancedMarkerElement is not available.");
      }
    }
  }, [location]);

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page w-full flex-col gap-y-4 justify-center mt-4 mb-4 p-8">
      <h1 className="m-auto flex justify-center font-semibold text-2xl mb-6">
        Create New Event
      </h1>
      <Form
        id="event-form"
        method="post"
        className="rounded-lg font-semibold max-w-lg justify-center m-auto flex flex-col gap-y-4 p-4"
      >
        <label htmlFor="title">Event Title</label>
        <input
          required
          id="title"
          name="title"
          type="text"
          placeholder="Write a title..."
          className="rounded-xl p-2 border-gray-400 border"
        />

        <label htmlFor="description">Description</label>
        <textarea
          required
          id="description"
          name="description"
          placeholder="Write a description..."
          className="rounded-xl p-2 border-gray-400 border"
        />

        <label htmlFor="date">Date</label>
        <input
          required
          id="date"
          name="date"
          type="date"
          className="rounded-xl p-2 border-gray-400 border"
        />

        <label htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          type="text"
          readOnly
          placeholder="Click on the map to select a location"
          value={location ? `${location.lat}, ${location.lng}` : ""}
          className="rounded-xl p-2 border-gray-400 border"
        />

        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={center}
          zoom={12}
          onClick={handleMapClick}
          onLoad={(map) => {
            mapRef.current = map;
            map.setOptions({
              mapId: MAP_ID,
            });
          }}
        >
          {location && <Marker position={location} title="Selected Location" />}
        </GoogleMap>

        <label htmlFor="image">Image URL</label>
        <input
          required
          id="image"
          name="image"
          type="url"
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

export async function action({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  const formData = await request.formData();
  const event = Object.fromEntries(formData);

  event.creator = user._id;

  await mongoose.models.Event.create(event);

  return redirect("/dashboard");
}
