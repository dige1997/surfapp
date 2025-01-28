import { useState } from "react";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server";
import DashboardData from "../components/DashboardData";
import EventListCards from "../components/EventListCards";
import EventCard from "../components/EventCard";

export const meta = () => {
  return [{ title: "Remix Post App" }];
};

export const loader = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/main-dashboard",
  });

  const openWeatherApiKey = process.env.OPEN_WEATHER_API_KEY;
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  // Fetch posts and API keys
  const mostLikedPosts = await mongoose.models.Post.find()
    .sort({ attendees: -1 })
    .limit(3)
    .populate("creator")
    .populate("attendees");

  return json({
    mostLikedPosts,
    openWeatherApiKey,
    googleMapsApiKey, // API keys securely passed here
  });
};

export default function Index() {
  const { mostLikedPosts, openWeatherApiKey, googleMapsApiKey } =
    useLoaderData();
  const [postCities, setPostCities] = useState({}); // Initialize the state for post cities

  // Handle the case where there are no posts
  if (!mostLikedPosts || mostLikedPosts.length === 0) {
    return (
      <div className="page">
        <DashboardData />
        <p>Signup to see posts.</p>
      </div>
    );
  }

  // Update city for a specific post
  const updateCity = (postId, city) => {
    setPostCities((prev) => ({
      ...prev,
      [postId]: city,
    }));
  };

  return (
    <div className="page">
      <DashboardData apiKey={openWeatherApiKey} />{" "}
      <div className="md:p-8 p-4">
        <h2 className="font-bold text-2xl">Most liked posts</h2>
        {mostLikedPosts.map((post) => (
          <Link key={post._id} className="post-link" to={`/post/${post._id}`}>
            <div className="md:hidden w-full flex justify-center">
              <EventListCards post={post} />
            </div>
            <div className="hidden md:flex w-full justify-center">
              <EventCard
                post={post}
                onCityUpdate={updateCity}
                apiKey={googleMapsApiKey}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
