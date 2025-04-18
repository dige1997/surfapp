import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { authenticator } from "../services/auth.server";
import mongoose from "mongoose";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

const MAP_ID = "71f267d426ae7773";

export async function loader({ request }) {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  // Check if the API key is present to avoid issues
  if (!googleMapsApiKey) {
    throw new Error("Google Maps API Key is missing.");
  }

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  return { googleMapsApiKey, user };
}

export default function AddEvent() {
  const [image, setImage] = useState(
    "https://placehold.co/600x400?text=Add+your+amazing+image"
  );
  const [location, setLocation] = useState(null);
  const [center] = useState({ lat: 41.0082, lng: 28.9784 }); // Istanbul coordinates
  const mapRef = useRef();
  const navigate = useNavigate();
  const { googleMapsApiKey } = useLoaderData(); // API key passed from loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey, // Use the key here
  });
  const handleMapClick = (post) => {
    setLocation({
      lat: post.latLng.lat(),
      lng: post.latLng.lng(),
    });
  };

  const handleCancel = () => navigate("/dashboard");

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.panTo(location);
    }
  }, [location]);

  return (
    <div className="page w-full flex-col gap-y-4 justify-center mt-4 mb-4 p-8">
      <h1 className="m-auto flex justify-center font-semibold text-2xl mb-6">
        Create New Post
      </h1>
      <Form
        id="post-form"
        method="post"
        className="rounded-lg font-semibold max-w-lg justify-center m-auto flex flex-col gap-y-4 p-4"
      >
        <label htmlFor="title">Post Title</label>
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

        <div>
          <p>Click on the map to select a location.</p>
        </div>

        {isLoaded ? (
          <GoogleMap
            apiKey={googleMapsApiKey}
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
            {location && (
              <Marker position={location} title="Selected Location" />
            )}
          </GoogleMap>
        ) : (
          <p>Loading map...</p>
        )}

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
  const post = Object.fromEntries(formData);

  post.creator = user._id;

  await mongoose.models.Post.create(post);

  return redirect("/dashboard");
}
