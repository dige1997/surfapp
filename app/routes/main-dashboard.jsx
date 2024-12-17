import React from "react";
import DashboardData from "../components/DashboardData";
import { NavLink, redirect } from "react-router-dom";
import { authenticator } from "../services/auth.server";
import { useLoaderData } from "@remix-run/react";

export const meta = () => {
  return [{ title: "Elevation" }];
};
export async function loader({ request }) {
  const openWeatherApiKey = process.env.OPEN_WEATHER_API_KEY;

  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    // User is not authenticated, return null or some default data
    return { isAuthenticated: false };
  }

  // If authenticated, return the API keys and the flag
  return {
    isAuthenticated: true,
    openWeatherApiKey,
  };
}

export default function MainDashboard() {
  // Access the API keys from loader data
  const { openWeatherApiKey } = useLoaderData();

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
        <DashboardData openWeatherApiKey={openWeatherApiKey} />
      </div>
    </div>
  );
}
