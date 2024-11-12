import { NavLink } from "@remix-run/react";
import { authenticator } from "../services/auth.server";

export async function loader({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
}

export default function Nav() {
  return (
    <nav className="flex shadow-md justify-between md:justify-items-end items-center">
      <NavLink to={authenticator ? "/dashboard" : "/main-dashboard"}>
        <h1 className="font-mono text-2xl font-bold m-auto p-2 mx-2">
          Elevation
        </h1>
      </NavLink>
      <div className="flex ml-auto p-2 font-semibold mr-4">
        <NavLink
          to="/signup"
          className="mx-2 bg-secondary hover:bg-primary rounded-xl p-2 "
        >
          Sign Up
        </NavLink>
        <NavLink
          to="/signin"
          className="mx-2  bg-gray-100 hover:bg-gray-200 rounded-xl p-2"
        >
          Login
        </NavLink>
      </div>
    </nav>
  );
}
