import { useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export function GoogleMapLoader({ children }) {
  const { isLoaded, loadError } = useJsApiLoader({
    apiKey: GOOGLE_MAPS_API_KEY,
  });

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return children;
}
