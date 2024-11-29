import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import mongoose from "mongoose";
import { useState } from "react";
import { authenticator } from "../services/auth.server";

export function meta() {
  return [
    {
      title: "Trailblaze - Update event",
    },
  ];
}

export async function loader({ request, params }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  const event = await mongoose.models.Event.findById(params.eventId).populate("creator");
  return json({ event });
}

export default function UpdateEvent() {
  const { event } = useLoaderData();
  const [image, setImage] = useState(event.image);
  const navigate = useNavigate();

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="page w-full flex-col gap-y-4 justify-center mt-4 mb-4 p-8 ">
      <h1 className="m-auto flex justify-center font-semibold text-2xl mb-6">Update Event</h1>
      <Form id="event-form" method="post" className="rounded-lg font-semibold max-w-lg justify-center m-auto flex flex-col gap-y-4 p-4">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          defaultValue={event.title}
          name="title"
          type="text"
          aria-label="title"
          placeholder="Write a title..."
          className="rounded-xl p-2  border-gray-400 border"
        />
       
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          type="text"
          aria-label="description"
          placeholder="Write a description..."
          defaultValue={event.description}
          className="rounded-xl p-2  border-gray-400 border" 
        />
        <label htmlFor="location">Location</label>
        <input 
        id="location"
        name="location"
        type="text"
        aria-label="location"
        placeholder="Write a location..."
        defaultValue={event.location}
        className="rounded-xl p-2  border-gray-400 border" />


        <label htmlFor="date">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          aria-label="date"
          defaultValue={new Date(event.date).toISOString().split("T")[0]}
          className="rounded-xl p-2  border-gray-400 border"
        />

<label htmlFor="image">Image URL</label>
        <input
          name="image"
          defaultValue={event.image}
          type="url"
          onChange={(e) => setImage(e.target.value)}
          placeholder="Paste an image URL..."
          className="rounded-xl p-2  border-gray-400 border" 
        />

        <label htmlFor="image-preview">Image Preview</label>
        <img
          id="image-preview"
          className="m-auto rounded-xl"
          src={image ? image : "https://placehold.co/600x400?text=Paste+an+image+URL"}
          alt="Choose"
          onError={(e) => (e.target.src = "https://placehold.co/600x400?text=Error+loading+image")}
        />

        <input name="uid" type="text" defaultValue={event.uid} hidden />
        <div className="btns ">
          <button className="bg-accent hover:bg-primary hover:text-background p-2 rounded-lg mr-6">Save</button>
          <button type="button" className="btn-cancel text-cancel" onClick={handleCancel}>
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
  const eventToUpdate = await mongoose.models.Event.findById(params.eventId);

  if (eventToUpdate.creator.toString() !== authUser._id.toString()) {
    // User is not the creator of the post, redirect
    return redirect(`/event/${params.eventId}`);
  }

  // User is authenticated and is the creator, proceed to update the post
  const formData = await request.formData();
  const event = Object.fromEntries(formData);

  // Since postToUpdate is already the document you want to update,
  // you can directly modify and save it, which can be more efficient than findByIdAndUpdate
  eventToUpdate.title = event.title;
  eventToUpdate.image = event.image;
  eventToUpdate.description = event.description;
  eventToUpdate.date = event.date;
  eventToUpdate.location = event.location;
  
  await eventToUpdate.save();

  return redirect(`/event/${params.eventId}`);
}
