import React from "react";
import DashboardData from "../components/DashboardData";
import { NavLink, redirect } from "react-router-dom";
import { authenticator } from "../services/auth.server";
import { useLoaderData } from "@remix-run/react";

export const meta = () => {
  return [{ title: "Elevation" }];
};

export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/main-dashboard",
  });
  if (!user) {
    return redirect("/dashboard");
  }
}

export default function MainDashboard() {
  const { apiKey } = useLoaderData();

  return (
    <div className="page">
      <div className="w-full top-0 bg-slate-200 h-14 flex justify-center items-center font-bold shadow-sm animate-slideDown z-10">
        <p>
          Sign in to see more or
          <NavLink to="/signup" className="text-blue-600">
            {" "}
            sign up here
          </NavLink>
        </p>
      </div>
      <div className="page">
        <DashboardData />
      </div>
    </div>
  );
}
