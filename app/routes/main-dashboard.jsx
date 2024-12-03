import React from "react";
import DashboardData from "../components/DashboardData";
import { NavLink } from "react-router-dom";

export const meta = () => {
  return [{ title: "Elevation" }];
};

export default function MainDashboard() {
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
