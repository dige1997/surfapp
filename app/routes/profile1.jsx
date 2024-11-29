import { Form, useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react"; // Correct import
import { authenticator } from "../services/auth.server";

// Loader function to fetch authenticated user
export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  return user; // Return user data to be used in the Profile component
}

export default function Profile() {
  const user = useLoaderData(); // Get the user data from loader

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
      </div>

      <Form method="post" className="flex justify-center mt-4">
        <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
          Logout
        </button>
      </Form>
    </div>
  );
}

// Action function to handle logout
export async function action({ request }) {
  await authenticator.logout(request, { redirectTo: "/signin" });
}
