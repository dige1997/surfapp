import React, { Suspense } from "react";
import ShowAllLocations from "../components/ShowAllLocations";

export default function Locations() {
  return (
    <div className="page">
      <h1 className="text-3xl">Locations</h1>
      <Suspense fallback={<div>Loading map...</div>}>
        <ShowAllLocations />
      </Suspense>
    </div>
  );
}
