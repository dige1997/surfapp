import mongoose from "mongoose";
import { json, redirect } from "@remix-run/node";
import { authenticator } from "../services/auth.server";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { hashPassword } from "../services/auth.server";

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

  const user = await mongoose.models.User.findById(params.userId);
  const userUpdated = await mongoose.models.User.findOneAndUpdate(
    user._id
  ).select("+password");
  return json({ user, userUpdated });
}

export default function UpdateProfile() {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  function handleCancel() {
    navigate(-1);
  }
  return (
    <div className="w-full flex-col gap-y-4 justify-center mt-4 mb-4 p-8">
      <h1 className="m-auto flex justify-center font-semibold text-2xl mb-6">
        Update Profile
      </h1>

      <Form
        method="post"
        className="rounded-lg font-semibold max-w-lg justify-center m-auto flex flex-col gap-y-4 p-4"
      >
        <label htmlFor="name"> Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          defaultValue={user.name}
          className="rounded-xl p-2  border-gray-400 border"
        />
        <label htmlFor="mail">Mail</label>
        <input
          type="text"
          id="mail"
          name="mail"
          placeholder="Mail"
          defaultValue={user.mail}
          className="rounded-xl p-2  border-gray-400 border"
        />
        <label htmlFor="password">New Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="New Password"
          className="rounded-xl p-2  border-gray-400 border"
        />

        <button className="bg-accent hover:bg-primary hover:text-background p-2 rounded-lg mt-4">
          Update
        </button>
        <button
          type="button"
          className="btn-cancel text-cancel"
          onClick={handleCancel}
        >
          cancel
        </button>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  const formData = new URLSearchParams(await request.text());
  const name = formData.get("name");
  const mail = formData.get("mail");
  const password = formData.get("password");

  try {
    let userToUpdate = await mongoose.models.User.findOne({
      _id: authUser._id,
    });

    if (!userToUpdate) {
      // Handle case where user is not found
      console.error("User not found");
      return redirect("/error-page"); // Redirect to an error page or handle as appropriate
    }

    if (mail !== userToUpdate.mail) {
      // Check if the new email is different from the current one
      const existingUser = await mongoose.models.User.findOne({ mail });

      if (existingUser) {
        // Email is already in use
        console.error("Email already in use");
        return redirect("/error-page"); // Redirect to an error page or handle as appropriate
      }
    }

    userToUpdate.name = name;
    userToUpdate.mail = mail;
    if (password) {
      userToUpdate.password = await hashPassword(password);
    }

    const updatedUser = await userToUpdate.save();
    if (updatedUser) {
      return redirect(`/profile/${updatedUser._id}`);
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return redirect("/error-page"); // Redirect to an error page or handle as appropriate
  }
}
