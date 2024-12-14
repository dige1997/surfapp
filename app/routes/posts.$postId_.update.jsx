import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import mongoose from "mongoose";
import { useState } from "react";
import { authenticator } from "../services/auth.server";

export function meta() {
  return [
    {
      title: "Remix Post App - Update",
    },
  ];
}

export async function loader({ request, params }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  const post = await mongoose.models.Post.findById(params.postId).populate("user");
  return json({ post });
}

export default function UpdatePost() {
  const { post } = useLoaderData();
  const [image, setImage] = useState(post.image);
  const navigate = useNavigate();

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="page">
      <h1>Update Post</h1>
      <Form id="post-form" method="post">
        <label htmlFor="caption">Caption</label>
        <input
          id="caption"
          defaultValue={post.caption}
          name="caption"
          type="text"
          aria-label="caption"
          placeholder="Write a caption..."
        />
        <label htmlFor="image">Image URL</label>
        <input
          name="image"
          defaultValue={post.image}
          type="url"
          onChange={(e) => setImage(e.target.value)}
          placeholder="Paste an image URL..."
        />

        <label htmlFor="image-preview">Image Preview</label>
        <img
          id="image-preview"
          className="image-preview"
          src={image ? image : "https://placehold.co/600x400?text=Paste+an+image+URL"}
          alt="Choose"
          onError={(e) => (e.target.src = "https://placehold.co/600x400?text=Error+loading+image")}
        />

        <input name="uid" type="text" defaultValue={post.uid} hidden />
        <div className="btns">
          <button>Save</button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request, params }) {
  // Protect the route
  const authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  // Fetch the post to check if the current user is the creator
  const postToUpdate = await mongoose.models.Post.findById(params.postId);

  if (postToUpdate.user.toString() !== authUser._id.toString()) {
    // User is not the creator of the post, redirect
    return redirect(`/posts/${params.postId}`);
  }

  // User is authenticated and is the creator, proceed to update the post
  const formData = await request.formData();
  const post = Object.fromEntries(formData);

  // Since postToUpdate is already the document you want to update,
  // you can directly modify and save it, which can be more efficient than findByIdAndUpdate
  postToUpdate.caption = post.caption;
  postToUpdate.image = post.image;
  await postToUpdate.save();

  return redirect(`/posts/${params.postId}`);
}
