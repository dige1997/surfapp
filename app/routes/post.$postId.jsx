import { Form, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import mongoose from "mongoose";
import { useEffect, useState, useRef } from "react";
import { authenticator } from "../services/auth.server";
import { NavLink } from "react-router-dom";

const MAP_ID = "71f267d426ae7773";

export function meta({ data }) {
  return [
    {
      title: `Evelation - ${data.post.title || "Post"}`,
    },
  ];
}

export async function loader({ request, params }) {
  const authUser = await authenticator.isAuthenticated(request);
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  const post = await mongoose.models.Post.findById(params.postId)
    .populate("likes")
    .populate("creator");
  return json({ post, authUser, googleMapsApiKey });
}

export async function action({ request, params }) {
  const formData = new URLSearchParams(await request.text());
  const action = formData.get("_action");
  const authUser = await authenticator.isAuthenticated(request);

  if (!authUser) {
    throw new Error("User not authenticated");
  }

  const postId = params.postId;
  const Post = mongoose.models.Post;

  if (action === "like") {
    await Post.findByIdAndUpdate(postId, {
      $addToSet: { likes: authUser._id },
    });
  } else if (action === "unlike") {
    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: authUser._id },
    });
  }

  return redirect(`/post/${postId}`);
}

export default function Post() {
  const { post, authUser, googleMapsApiKey } = useLoaderData();
  const [city, setCity] = useState(null);
  const mapRef = useRef(null);

  const location = post?.location
    ? {
        lat: parseFloat(post.location.split(",")[0]),
        lng: parseFloat(post.location.split(",")[1]),
      }
    : null;

  // Dynamically load Google Maps script
  useEffect(() => {
    if (!googleMapsApiKey || !location) return;

    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`;
      script.async = true;
      script.onload = initializeMap;
      document.body.appendChild(script);
    };

    const initializeMap = () => {
      if (window.google && mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: location,
          zoom: 12,
          mapId: MAP_ID,
        });

        new window.google.maps.Marker({
          position: location,
          map,
          title: "Post Location",
        });
      }
    };

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initializeMap();
    }
  }, [googleMapsApiKey, location]);

  // Fetch city name
  useEffect(() => {
    if (location) {
      const fetchCityName = async () => {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${googleMapsApiKey}`;
        try {
          const response = await fetch(geocodeUrl);
          const data = await response.json();

          if (data.results.length > 0) {
            const filteredResults = data.results.filter(
              (result) => !result.types.includes("plus_code")
            );
            const cityResult = filteredResults.find((result) =>
              result.types.includes("locality")
            );

            if (cityResult) {
              const cityComponent = cityResult.address_components.find(
                (component) => component.types.includes("locality")
              );
              if (cityComponent) {
                setCity(cityComponent.long_name);
                return;
              }
            }

            const fallbackResult = filteredResults[0];
            setCity(fallbackResult?.formatted_address || "Unknown Location");
          } else {
            setCity("Unknown Location");
          }
        } catch (error) {
          console.error("Error fetching city name:", error);
          setCity("Error fetching location");
        }
      };
      fetchCityName();
    }
  }, [location]);

  const liked = post?.likes?.some((userLike) => userLike._id === authUser?._id);

  return (
    <div
      id="post-page"
      className="page max-w-5xl flex flex-col justify-center m-auto p-6"
    >
      <div
        className="h-96 w-full flex rounded-xl"
        style={{
          backgroundImage: `url(${post?.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="my-4">
        <h1 className="text-3xl">{post.title}</h1>
        <p className="text-gray-500">
          Post by:{" "}
          <NavLink
            to={`/userProfile/${post?.creator?._id}`}
            className="text-blue-500 hover:underline"
          >
            {post?.creator?.name}
          </NavLink>
        </p>
      </div>
      <h3 className="text-gray-500 font-bold">Description</h3>
      <p>{post.description}</p>
      <div className="flex flex-col my-2">
        <p>Date</p>
        <p className="">{new Date(post.date).toLocaleDateString("en-GB")}</p>
      </div>
      <div className="flex my-2">
        <p className="">{city || "Fetching location..."}</p>
      </div>

      {location && (
        <div ref={mapRef} style={{ width: "100%", height: "400px" }}></div>
      )}

      <div className="flex items-center gap-4 mt-4 justify-between">
        <div className="flex gap-2 items-center">
          <p>💙 {post.likes.length}</p>
          {!liked && authUser ? (
            <Form method="post">
              <button
                type="submit"
                name="_action"
                value="like"
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Like
              </button>
            </Form>
          ) : authUser ? (
            <Form method="post">
              <button
                type="submit"
                name="_action"
                value="unlike"
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                Unlike
              </button>
            </Form>
          ) : null}
        </div>
        <div>
          {authUser?._id === post?.creator?._id && (
            <div className="flex py-4">
              <Form action="update">
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600">
                  Update
                </button>
              </Form>
              <Form action="destroy" method="post">
                <button
                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  onClick={(e) => {
                    if (
                      !window.confirm(
                        "Are you sure you want to delete this post?"
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                >
                  Delete this post
                </button>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
