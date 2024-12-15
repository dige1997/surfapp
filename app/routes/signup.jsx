import { json, redirect } from "@remix-run/node";
import { Form, NavLink, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server";
import { sessionStorage } from "../services/session.server";
import { useState, useRef, useEffect } from "react";

// Loader function to check if user is authenticated
export async function loader({ request }) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const error = session.get("sessionErrorKey");
  session.unset("sessionErrorKey");
  const headers = new Headers({
    "Set-Cookie": await sessionStorage.commitSession(session),
  });

  return json({ error }, { headers });
}

// SignUp Component
export default function SignUp() {
  const loaderData = useLoaderData();
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const dropdownRef = useRef(null); // Declare ref here
  const sportsOptions = [
    "Surfing",
    "Snowboarding",
    "Kiteboarding",
    "Skateboarding",
    "Skiing",
    "wakeboarding",
    "windsurfing",
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedHobbies((prev) =>
      checked ? [...prev, value] : prev.filter((hobby) => hobby !== value)
    );
  };

  const handleAvatarChange = (event) => {
    setAvatarPreview(event.target.value);
  };

  // Close dropdown when clicking outside
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
  }, [dropdownRef]);

  return (
    <div
      id="sign-up-page"
      className="flex flex-col justify-center items-center rounded-lg h-auto w-80 ml-auto mr-auto mt-24 mb-32 p-4 gap-3"
    >
      <h1 className="text-2xl w-auto">Sign Up</h1>
      <Form
        id="sign-up-form"
        method="post"
        className="flex items-center flex-col gap-1 w-full"
      >
        <label htmlFor="mail">Email</label>
        <input
          id="mail"
          type="email"
          name="mail"
          aria-label="mail"
          placeholder="Type your email..."
          required
          autoComplete="off"
          className="p-2 rounded-xl w-full"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          aria-label="password"
          placeholder="Type your password..."
          autoComplete="current-password"
          className="p-2 rounded-xl w-full"
        />

        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          type="text"
          name="name"
          aria-label="first name"
          placeholder="Type your first name.."
          className="p-2 rounded-xl w-full"
        />

        <label htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          aria-label="last name"
          placeholder="Type your last name..."
          className="p-2 rounded-xl w-full"
        />

        <label htmlFor="avatarUrl">Avatar URL</label>
        <input
          id="avatarUrl"
          type="url"
          name="avatarUrl"
          aria-label="avatar url"
          placeholder="Paste your avatar URL or leave blank for default..."
          className="p-2 rounded-xl w-full"
          onChange={handleAvatarChange}
        />

        {/* Display avatar preview */}
        {avatarPreview && (
          <div className="mt-2">
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-20 h-20 rounded-full object-cover border"
            />
          </div>
        )}

        <label>Select your hobbies:</label>
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
                  />
                  {sport}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Display selected hobbies in a separate div */}
        <div className="mt-2">
          {selectedHobbies.length > 0 && (
            <div className="p-2 bg-gray-100 border rounded-lg">
              <strong>Selected Hobbies:</strong>
              <p>{selectedHobbies.join(", ")}</p>
            </div>
          )}
        </div>

        <input
          type="hidden"
          name="selectedHobbies"
          value={JSON.stringify(selectedHobbies)}
        />

        <div className="bg-sky-500 text-white hover:bg-sky-600 transition-colors p-2 rounded-xl mt-2 w-32 flex justify-center">
          <button>Sign Up</button>
        </div>

        {loaderData?.error ? (
          <div className="error-message">
            <p>{loaderData?.error?.message}</p>
          </div>
        ) : null}
      </Form>
      <p>
        Already have an account?{" "}
        <NavLink to="/signin" className={"text-sky-500"}>
          Sign in here.
        </NavLink>
      </p>
    </div>
  );
}

// Action function to handle form submission
export async function action({ request }) {
  try {
    const formData = await request.formData();
    const newUser = Object.fromEntries(formData);

    // Parse selectedHobbies from JSON string to array
    newUser.selectedHobbies = JSON.parse(newUser.selectedHobbies || "[]");

    // Create the user in MongoDB with all fields
    await mongoose.models.User.create({
      mail: newUser.mail,
      password: newUser.password,
      name: newUser.name,
      lastname: newUser.lastName,
      avatarUrl: newUser.avatarUrl,
      hobbies: newUser.selectedHobbies,
    });

    return redirect("/signin");
  } catch (error) {
    console.log(error);
    return redirect("/signup");
  }
}
