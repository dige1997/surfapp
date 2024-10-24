import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import PostCard from "../components/PostCard";
import { authenticator } from "../services/auth.server";
import DashboardData from "../components/DashboardData";

export const meta = () => {
  return [{ title: "Remix Post App" }];
};

export async function loader({ request }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  const posts = await mongoose.models.Post.find().sort({ createdAt: -1 }).populate("user");

  return json({ posts });
}

export default function Index() {
  const { posts } = useLoaderData();
  return (
    <div className="page">
      <h1>Posts</h1>
      <DashboardData />
    </div>
  );
}
