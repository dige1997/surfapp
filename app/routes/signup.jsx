import { json, redirect } from "@remix-run/node";
import { Form, NavLink, useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server";
import { sessionStorage } from "../services/session.server";

export async function loader({ request }) {
  // If the user is already authenticated redirect to /posts directly
  await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
  // Retrieve error message from session if present
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  // Get the error message from the session
  const error = session.get("sessionErrorKey");
  // Remove the error message from the session after it's been retrieved
  session.unset("sessionErrorKey");
  // Commit the updated session that no longer contains the error message
  const headers = new Headers({
    "Set-Cookie": await sessionStorage.commitSession(session),
  });

  return json({ error }, { headers }); // return the error message
}

export default function SignUp() {
  // if i got an error it will come back with the loader data
  const loaderData = useLoaderData();
  console.log("error:", loaderData?.error);

  return (
    <div
      id="sign-up-page"
      className="bg-slate-200 flex flex-col justify-center items-center rounded-lg h-80 w-72 ml-auto mr-auto mt-52 p-4 gap-3"
    >
      <h1 className="text-2xl w-auto">Sign Up</h1>
      <Form
        id="sign-up-form"
        method="post"
        className="flex items-center flex-col gap-1 w-full"
      >
        <label htmlFor="mail">Mail</label>
        <input
          id="mail"
          type="email"
          name="mail"
          aria-label="mail"
          placeholder="Type your mail..."
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

export async function action({ request }) {
  try {
    const formData = await request.formData(); // get the form data
    const newUser = Object.fromEntries(formData); // convert the form data to an object
    await mongoose.models.User.create(newUser); // create the user

    return redirect("/signin"); // redirect to the sign-in page
  } catch (error) {
    console.log(error);
    return redirect("/signup");
  }
}
