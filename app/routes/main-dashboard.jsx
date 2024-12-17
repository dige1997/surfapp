import React from "react";
import DashboardData from "../components/DashboardData";
import { NavLink, redirect } from "react-router-dom";
import { authenticator } from "../services/auth.server";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

export const meta = () => {
  return [{ title: "Elevation" }];
};

export const loader = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    Redirect: "/main-dashboard",
  });

  const openWeatherApiKey = process.env.OPEN_WEATHER_API_KEY;

  return json({
    openWeatherApiKey, // API keys securely passed here
    isAuthenticated: !!user, // determine authentication status
  });
};

export default function MainDashboard() {
  const { openWeatherApiKey, isAuthenticated } = useLoaderData();

  if (!isAuthenticated) {
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
          <DashboardData apiKey={openWeatherApiKey} />{" "}
        </div>
      </div>
    );
  }

  // If the user is authenticated, redirect to the dashboard
  return redirect("/dashboard");
}
