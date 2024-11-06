import { json } from "@remix-run/node";
import { Form, NavLink, useLoaderData } from "@remix-run/react";
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

export default function SignIn() {
  // if i got an error it will come back with the loader dxata
  const loaderData = useLoaderData();
  return (
    <div
      id="sign-in-page"
      className=" flex flex-col justify-center items-center rounded-lg h-auto w-2/6 ml-auto mr-auto mt-24 p-4 gap-3"
    >
      <h1 className="text-2xl w-auto">Sign In</h1>
      <Form
        id="sign-in-form"
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
          className="p-2 rounded-xl w-full"
        />

        <label htmlFor="password" className="">
          Password
        </label>
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
          <button>Sign In</button>
        </div>

        {loaderData?.error ? (
          <div className="error-message">
            <p>{loaderData?.error?.message}</p>
          </div>
        ) : null}
      </Form>
      <p className="flex">
        No account?{" "}
        <NavLink to="/signup" className="text-sky-500">
          Sign up here.
        </NavLink>
      </p>
    </div>
  );
}

export async function action({ request }) {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/signin",
  });
}
