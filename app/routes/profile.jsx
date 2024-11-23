import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react"; // Import useState for managing popup state
import { authenticator } from "../services/auth.server";
import UpdateProfilePopup from "../components/UpdateProfilePopup"; // Adjust path if needed

export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  return user;
}

export default function Profile() {
  const user = useLoaderData();
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Manage popup visibility

  // Open the popup
  const handleEditClick = () => {
    setIsPopupOpen(true);
  };

  // Close the popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleUpdate = async (updatedProfile) => {
    try {
      console.log("Updated Profile:", updatedProfile); // Log the updated profile

      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedProfile,
          userId: user.id, // Include user ID in the request
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update profile:", errorText);
        throw new Error(errorText);
      }

      const updatedUser = await response.json();
      console.log("Profile updated successfully:", updatedUser);

      // Update local user data, this could be a state update if you are using state to manage user data
      // setUserData(updatedUser);
      setIsPopupOpen(false); // Close the popup
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  return (
    <div className="page">
      <div className="bg-slate-800 p-8">
        <div className="flex justify-center items-center space-x-4">
          <img
            src={user.avatar}
            alt="Profile"
            className="rounded-full h-24 w-24 border-4 border-white"
          />
          <div>
            <p className="text-white font-bold text-3xl">
              {user.name} {user.lastname}
            </p>
            <p className="text-white text-lg">{user.mail}</p>
            <p className="text-white">Your sports: {user.hobbies.join(", ")}</p>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleEditClick}
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Conditionally render the popup */}
      {isPopupOpen && (
        <UpdateProfilePopup
          user={user}
          onUpdate={handleUpdate} // Pass the handleUpdate function
          onClose={handleClosePopup} // Pass the onClose function to close the popup
        />
      )}

      <Form method="post" className="flex justify-center mt-4">
        <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
          Logout
        </button>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  await authenticator.logout(request, { redirectTo: "/signin" });
}
