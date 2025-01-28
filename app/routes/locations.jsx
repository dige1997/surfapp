import { useLoaderData } from "@remix-run/react";
import ShowAllLocations from "../components/ShowAllLocations"; // Adjust the import path
import mongoose from "mongoose";
import { json } from "@remix-run/node";

// Loader for fetching posts
export async function loader() {
  const posts = await mongoose.models.Post.find({});
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!posts || posts.length === 0) {
    throw json({ message: "No posts available." }, { status: 404 });
  }

  return json({ posts, googleMapsApiKey });
}

export default function LocationsPage() {
  const { posts, googleMapsApiKey } = useLoaderData();

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ShowAllLocations posts={posts} apiKey={googleMapsApiKey} />
    </div>
  );
}

// ErrorBoundary to handle errors
export function ErrorBoundary({ error }) {
  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h1>Oops!</h1>
      <p>{error?.message || "No posts available."}</p>
    </div>
  );
}
