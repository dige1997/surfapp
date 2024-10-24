import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import PostCard from "../components/PostCard";
import { authenticator } from "../services/auth.server";

export function meta({ data }) {
  return [
    {
      title: `Remix Post App - ${data.post.caption || "Post"}`,
    },
  ];
}

export async function loader({ request, params }) {
  // Ensure the user is authenticated
  const authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  // Load the post and the user who created it
  const post = await mongoose.models.Post.findById(params.postId).populate("user");
  return json({ post, authUser });
}

export default function Post() {
  const { post, authUser } = useLoaderData();

  function confirmDelete(event) {
    const response = confirm("Please confirm you want to delete this post.");
    if (!response) {
      event.preventDefault();
    }
  }

  return (
    <div id="post-page" className="page">
      <h1>{post.caption}</h1>
      <PostCard post={post} />
      {authUser._id === post.user._id && (
        <div className="btns">
          <Form action="update">
            <button>Update</button>
          </Form>
          <Form action="destroy" method="post" onSubmit={confirmDelete}>
            <button>Delete</button>
          </Form>
        </div>
      )}
    </div>
  );
}
