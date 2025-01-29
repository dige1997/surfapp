// IframeDisplay.jsx
import React from "react";

export function IframeDisplay({ activeTab, weatherData }) {
  return (
    <>
      {activeTab === "wind" && weatherData && (
        <iframe
          title="Windy Map"
          src={`https://embed.windy.com/embed.html?lat=${weatherData.city.coord.lat}&lon=${weatherData.city.coord.lon}&zoom=10&overlay=wind&metricTemp=°C&metricWind=m/s`}
          className="w-full rounded-md  h-96"
          frameBorder="0"
        ></iframe>
      )}
      {activeTab === "swell" && weatherData && (
        <iframe
          title="Swell Map"
          src={`https://embed.windy.com/embed.html?lat=${weatherData.city.coord.lat}&lon=${weatherData.city.coord.lon}&zoom=10&overlay=swell1&product=ecmwfWaves&level=surface`}
          className="w-full  rounded-md r h-96"
          frameBorder="0"
        ></iframe>
      )}
      {activeTab === "temp" && weatherData && (
        <iframe
          title="Sea Temperature"
          src={`https://embed.windy.com/embed.html?lat=${weatherData.city.coord.lat}&lon=${weatherData.city.coord.lon}&zoom=10&overlay=sst&product=ecmwfAnalysis&level=surface`}
          className="w-full  rounded-md  h-96"
          frameBorder="0"
        ></iframe>
      )}
    </>
  );
}
