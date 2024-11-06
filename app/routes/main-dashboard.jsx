import React from "react";
import DashboardData from "../components/DashboardData";

export const meta = () => {
  return [{ title: "TrailBlaze-Event" }];
};

export default function MainDashboard() {
  return (
    <div className="page">
      <div className="page">
        <DashboardData />
      </div>
    </div>
  );
}
