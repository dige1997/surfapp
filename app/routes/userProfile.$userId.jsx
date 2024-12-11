import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";
import { authenticator } from "../services/auth.server";
import mongoose from "mongoose";

export async function loader({ request, params }) {
  const authUser = await authenticator.isAuthenticated(request);

  if (!authUser) {
    return redirect("/login");
  }

  const userProfile = await mongoose.models.User.findById(params.userId)
    .populate("followers", "_id name") // Populate followers for the profile user
    .populate("following", "_id name"); // Populate following for the profile user

  if (!userProfile) {
    throw new Response("User not found", { status: 404 });
  }

  return json({ userProfile, authUser });
}

export async function action({ request, params }) {
  const authUser = await authenticator.isAuthenticated(request);
  if (!authUser) {
    return redirect("/login");
  }

  const userToFollow = await mongoose.models.User.findById(params.userId); // User being followed/unfollowed
  if (!userToFollow) {
    throw new Response("User not found", { status: 404 });
  }

  const formData = new URLSearchParams(await request.text());
  const actionType = formData.get("action"); // "follow" or "unfollow"

  const authUserDoc = await mongoose.models.User.findById(authUser._id); // Fetch logged-in user

  if (actionType === "follow") {
    if (!authUserDoc.following.includes(userToFollow._id)) {
      authUserDoc.following.push(userToFollow._id); // Add to "following" list
      userToFollow.followers.push(authUserDoc._id); // Add to "followers" list

      await authUserDoc.save();
      await userToFollow.save();
    }
  } else if (actionType === "unfollow") {
    authUserDoc.following = authUserDoc.following.filter(
      (id) => id.toString() !== userToFollow._id.toString()
    );
    userToFollow.followers = userToFollow.followers.filter(
      (id) => id.toString() !== authUserDoc._id.toString()
    );

    await authUserDoc.save();
    await userToFollow.save();
  }

  return json({ success: true });
}

export default function UserProfile() {
  const { userProfile, authUser } = useLoaderData();

  const [followersCount, setFollowersCount] = useState(
    userProfile.followers.length
  );
  const [isFollowing, setIsFollowing] = useState(
    authUser.following.some(
      (followingUser) => followingUser.toString() === userProfile._id.toString()
    )
  );

  const handleFollowAction = async (actionType) => {
    const response = await fetch(`/userProfile/${userProfile._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ action: actionType }),
    });

    if (response.ok) {
      if (actionType === "follow") {
        setFollowersCount((prev) => prev + 1);
        setIsFollowing(true);
      } else if (actionType === "unfollow") {
        setFollowersCount((prev) => prev - 1);
        setIsFollowing(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={userProfile.avatarUrl || "/default-avatar.png"}
            alt={`${userProfile.name}'s avatar`}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold">{userProfile.name}</h1>
            <p className="text-gray-600">{userProfile.mail}</p>
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <p className="text-lg">
            {followersCount} <span className="text-gray-500">Followers</span>
          </p>
          <p className="text-lg">
            {userProfile.following.length}{" "}
            <span className="text-gray-500">Following</span>
          </p>
        </div>

        {authUser && authUser._id !== userProfile._id && (
          <div className="flex items-center space-x-4">
            {isFollowing ? (
              <button
                onClick={() => handleFollowAction("unfollow")}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={() => handleFollowAction("follow")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                Follow
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
