import mongoose from "mongoose";
import { json, redirect } from "@remix-run/node";
import { authenticator } from "../services/auth.server";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { hashPassword } from "../services/auth.server";
import { useEffect, useRef, useState } from "react";

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

  const user = await mongoose.models.User.findById(params.userId).select(
    "+password"
  );
  return json({ user });
}

export default function UpdateProfile() {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedHobbies, setSelectedHobbies] = useState(user.hobbies || []);
  const sportsOptions = [
    "Surfing",
    "Snowboarding",
    "Kiteboarding",
    "Skateboarding",
    "Skiing",
    "wakeboarding",
    "windsurfing",
  ];

  function handleCancel() {
    navigate(-1);
  }

  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
  }

  function handleCheckboxChange(event) {
    const value = event.target.value;
    setSelectedHobbies((prev) =>
      prev.includes(value)
        ? prev.filter((hobby) => hobby !== value)
        : [...prev, value]
    );
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleDeleteProfile() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your profile?"
    );
    if (confirmed) {
      try {
        const response = await fetch(`/profile/${user._id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          navigate("/signin");
        } else {
          const errorText = await response.text();
          throw new Error(`Failed to delete profile: ${errorText}`);
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
        alert("Error deleting profile. Please try again later.");
        navigate("/error-page"); // Redirect to an error page or appropriate page
      }
    }
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
        <label htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          defaultValue={user.lastname}
          aria-label="last name"
          placeholder="Type your last name..."
          className="p-2 rounded-xl w-full"
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
        <label htmlFor="aboutMe">About Me</label>
        <input
          type="description"
          id="aboutMe"
          name="aboutMe"
          defaultValue={user.aboutMe}
          placeholder="Write something about yourself..."
          className="rounded-xl p-2  border-gray-400 border"
        />
        <label htmlFor="avatarUrl">Avatar URL</label>
        <input
          id="avatarUrl"
          type="url"
          name="avatarUrl"
          defaultValue={user.avatarUrl}
          aria-label="avatar url"
          placeholder="Paste your avatar URL or leave blank for default..."
          className="p-2 rounded-xl w-full"
        />
        <label htmlFor="image-preview">Image Preview</label>
        <div
          style={{
            backgroundImage: `url(${user.avatarUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="w-72 h-72 mx-auto rounded-full bg-gray-300"
        ></div>
        <label>Select your hobbies:</label>
        {selectedHobbies.length > 0 && (
          <div className="mb-2">
            <span>Selected hobbies:</span>
            <ul className="list-inline">
              {selectedHobbies.map((hobby) => (
                <li
                  key={hobby}
                  className="inline-block bg-gray-200 px-2 py-1 rounded-md mr-1 mb-1 text-xs"
                >
                  {hobby}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={toggleDropdown}
            className="bg-white p-2 w-full rounded-xl border"
          >
            Choose your hobbies
          </button>
          {dropdownOpen && (
            <div className="absolute top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
              {sportsOptions.map((sport) => (
                <label key={sport} className="block p-2">
                  <input
                    type="checkbox"
                    value={sport}
                    checked={selectedHobbies.includes(sport)}
                    onChange={handleCheckboxChange}
                    name="hobbies"
                  />
                  {sport}
                </label>
              ))}
            </div>
          )}
        </div>
        <button className="bg-accent hover:bg-primary hover:text-background p-2 rounded-lg mt-4">
          Update
        </button>
        <button
          type="button"
          className="btn-cancel text-cancel"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn-delete-profile mt-4 bg-red-600 hover:bg-red-800 text-white p-2 rounded-lg"
          onClick={handleDeleteProfile}
        >
          Delete Profile
        </button>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  if (request.method === "DELETE") {
    try {
      const response = await fetch(`/api/users/${authUser._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        return redirect("/signin"); // Redirect to signin page after deletion
      } else {
        console.error("Error deleting user:", response.statusText);
        return redirect("/error-page"); // Ensure this route is defined
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return redirect("/error-page"); // Ensure this route is defined
    }
  } else {
    // Handling other form submissions
    const formData = new URLSearchParams(await request.text());
    const name = formData.get("name");
    const lastName = formData.get("lastName");
    const mail = formData.get("mail");
    const password = formData.get("password");
    const hobbies = formData.getAll("hobbies");
    const avatarUrl = formData.get("avatarUrl");
    const aboutMe = formData.get("aboutMe");

    try {
      let userToUpdate = await mongoose.models.User.findOne({
        _id: authUser._id,
      });

      if (!userToUpdate) {
        console.error("User not found");
        return redirect("/error-page"); // Ensure this route is defined
      }

      // Check if the email is already in use by another user
      const existingUser = await mongoose.models.User.findOne({ mail });
      if (
        existingUser &&
        existingUser._id.toString() !== userToUpdate._id.toString()
      ) {
        console.error("Email already in use");
        return redirect("/error-page"); // Ensure this route is defined
      }

      // Update user details
      userToUpdate.name = name;
      userToUpdate.lastname = lastName;
      userToUpdate.mail = mail;
      if (password) {
        userToUpdate.password = await hashPassword(password);
      }
      userToUpdate.hobbies = hobbies;
      userToUpdate.avatarUrl = avatarUrl;
      userToUpdate.aboutMe = aboutMe;

      // Save updated user data
      const updatedUser = await userToUpdate.save();
      if (updatedUser) {
        return redirect(`/profile/${updatedUser._id}`);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return redirect("/error-page"); // Ensure this route is defined
    }
  }
}
