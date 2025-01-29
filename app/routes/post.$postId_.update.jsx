import { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"; // Use Marker instead of AdvancedMarkerElement
import { authenticator } from "../services/auth.server";
import mongoose from "mongoose";
import { json, redirect } from "@remix-run/node";

const MAP_ID = "71f267d426ae7773";

export async function loader({ request, params }) {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  const post = await mongoose.models.Post.findById(params.postId).populate(
    "creator"
  );

  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }

  if (post.creator._id.toString() !== user._id.toString()) {
    return redirect("/dashboard");
  }

  return json({ post, googleMapsApiKey });
}

export default function UpdateEvent() {
  const { post, googleMapsApiKey } = useLoaderData();
  const [image, setImage] = useState(post.image);
  const [location, setLocation] = useState(
    post.location
      ? Array.isArray(post.location)
        ? post.location
        : post.location.split(",").map((coord) => parseFloat(coord.trim()))
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

  // Create the Marker after map loads
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Initialize the marker and set the position
    const marker = new window.google.maps.Marker({
      map: mapRef.current,
      position: center,
      title: "Selected Location",
    });

    markerRef.current = marker;

    // Update marker position when center changes
    if (markerRef.current) {
      markerRef.current.setPosition(center);
    }

    return () => {
      // Cleanup marker on unmount
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [center]);

  const parsedLocation = location
    ? { lat: location[0], lng: location[1] }
    : { lat: 41.0082, lng: 28.9784 };

  return (
    <div className="page w-full flex-col gap-y-4 justify-center mt-4 mb-4 p-8">
      <h1 className="m-auto flex justify-center font-semibold text-2xl mb-6">
        Update Post
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
          defaultValue={post.title}
          placeholder="Write a title..."
          className="rounded-xl p-2 border-gray-400 border"
        />

        <label htmlFor="description">Description</label>
        <textarea
          required
          id="description"
          name="description"
          defaultValue={post.description}
          placeholder="Write a description..."
          className="rounded-xl p-2 border-gray-400 border"
        />

        <label htmlFor="date">Date</label>
        <input
          required
          id="date"
          name="date"
          type="date"
          defaultValue={post.date.split("T")[0]}
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

        <LoadScript googleMapsApiKey={googleMapsApiKey}>
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
            {/* You can use the Marker here */}
            <Marker position={parsedLocation} title="Selected Location" />
          </GoogleMap>
        </LoadScript>
        <label htmlFor="image">Image URL</label>
        <input
          required
          id="image"
          name="image"
          type="url"
          defaultValue={post.image}
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

  const postToUpdate = await mongoose.models.Post.findById(params.postId);

  if (
    !postToUpdate ||
    postToUpdate.creator.toString() !== authUser._id.toString()
  ) {
    return redirect(`/dashboard`);
  }

  const formData = await request.formData();
  const updatedPost = Object.fromEntries(formData);

  Object.assign(postToUpdate, updatedPost);
  postToUpdate.location = updatedPost.location;

  await postToUpdate.save();

  return redirect(`/post/${params.postId}`);
}
