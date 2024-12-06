import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";
import { authenticator } from "../services/auth.server";
import mongoose from "mongoose";

// Loader function to fetch the user profile data
export async function loader({ request, params }) {
  const authUser = await authenticator.isAuthenticated(request);
  const userProfile = await mongoose.models.User.findById(params.userId)
    .populate("followers")
    .populate("following");

  return json({ userProfile, authUser });
}

// Action function to handle follow/unfollow
export async function action({ request, params }) {
  const authUser = await authenticator.isAuthenticated(request);
  if (!authUser) {
    return redirect("/login"); // Redirect to login if not authenticated
  }

  const userToUpdate = await mongoose.models.User.findById(params.userId);
  if (!userToUpdate) {
    return redirect("/404"); // Redirect if the user doesn't exist
  }

  const formData = new URLSearchParams(await request.text());
  const actionType = formData.get("action"); // "follow" or "unfollow"

  if (actionType === "follow") {
    // Add to following and followers lists
    if (!authUser.following.includes(userToUpdate._id)) {
      authUser.following.push(userToUpdate._id);
      userToUpdate.followers.push(authUser._id);

      // Save both users with updated relationships
      await authUser.save();
      await userToUpdate.save();
    }
  } else if (actionType === "unfollow") {
    // Remove from following and followers lists
    authUser.following = authUser.following.filter(
      (id) => id.toString() !== userToUpdate._id.toString()
    );
    userToUpdate.followers = userToUpdate.followers.filter(
      (id) => id.toString() !== authUser._id.toString()
    );

    // Save both users with updated relationships
    await authUser.save();
    await userToUpdate.save();
  }

  return json({ success: true });
}

// UserProfile Component
export default function UserProfile() {
  const { userProfile, authUser } = useLoaderData();
  const [followersCount, setFollowersCount] = useState(
    userProfile.followers.length
  );
  const [followingCount, setFollowingCount] = useState(
    userProfile.following.length
  );

  const isFollowing = userProfile.followers.some(
    (follower) => follower._id.toString() === authUser._id.toString()
  );

  // Handle follow action
  const handleFollow = async () => {
    const response = await fetch(`/userProfile/${userProfile._id}`, {
      method: "POST",
      body: new URLSearchParams({ action: "follow" }), // Send "follow" action
    });

    if (response.ok) {
      setFollowersCount(followersCount + 1);
      setFollowingCount(followingCount + 1);
    }
  };

  // Handle unfollow action
  const handleUnfollow = async () => {
    const response = await fetch(`/userProfile/${userProfile._id}`, {
      method: "POST",
      body: new URLSearchParams({ action: "unfollow" }), // Send "unfollow" action
    });

    if (response.ok) {
      setFollowersCount(followersCount - 1);
      setFollowingCount(followingCount - 1);
    }
  };

  return (
    <div className="user-profile-page">
      <h1 className="text-3xl">{userProfile.name}'s Profile</h1>
      <p>Email: {userProfile.mail}</p>
      <p>{followersCount} Followers</p>
      <p>{followingCount} Following</p>

      {authUser && authUser._id !== userProfile._id && (
        <div className="follow-actions">
          {isFollowing ? (
            <button onClick={handleUnfollow}>Unfollow</button>
          ) : (
            <button onClick={handleFollow}>Follow</button>
          )}
        </div>
      )}
    </div>
  );
}
