var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// app/entry.server.jsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";

// app/db/db-connect.server.js
import mongoose2 from "mongoose";

// app/db/models.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
var userSchema = new mongoose.Schema(
  {
    image: String,
    mail: {
      type: String,
      required: !0,
      // Ensure user emails are required
      unique: !0
      // Ensure user emails are unique
    },
    name: String,
    title: String,
    educations: [String],
    password: {
      type: String,
      required: !0,
      // Ensure user passwords are required
      select: !1
      // Automatically exclude from query results
    }
  },
  { timestamps: !0 }
);
userSchema.pre("save", async function(next) {
  let user = this;
  if (!user.isModified("password"))
    return next();
  let salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt), next();
});
var postSchema = new mongoose.Schema(
  {
    caption: String,
    image: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    likes: Number,
    tags: [String]
  },
  { timestamps: !0 }
), models = [
  { name: "User", schema: userSchema, collection: "users" },
  { name: "Post", schema: postSchema, collection: "posts" }
];
async function initData() {
  let userCount = await mongoose.models.User.countDocuments(), postCount = await mongoose.models.Post.countDocuments();
  (userCount === 0 || postCount === 0) && await insertData();
}
async function insertData() {
  let User = mongoose.models.User, Post2 = mongoose.models.Post;
  console.log("Dropping collections..."), await User.collection.drop(), await Post2.collection.drop(), console.log("Inserting data...");
  let nicolai = await User.create({
    image: "https://www.baaa.dk/media/b5ahrlra/maria-louise-bendixen.jpg?anchor=center&mode=crop&width=800&height=450&rnd=132792921650330000&format=webp",
    mail: "test@test.com",
    name: "Nicolai",
    password: "1234"
  });
}

// app/db/db-connect.server.js
var { MONGODB_URL, NODE_ENV } = process.env;
if (!MONGODB_URL) {
  let errorMessage = NODE_ENV === "production" ? "Please define the MONGODB_URL environment variable \u2014 pointing to your full connection string, including database name." : "Please define the MONGODB_URL environment variable inside an .env file \u2014 pointing to your full connection string, including database name.";
  throw new Error(errorMessage);
}
function connectDb() {
  let modelCreationType = "Creating";
  NODE_ENV === "development" && (mongoose2.set("overwriteModels", !0), Object.keys(mongoose2.models).length > 0 && (modelCreationType = "Overwriting")), console.log(
    // E.g. "Mongoose: Creating 2 models (Book, Author)"
    "Mongoose: %s %d %s (%s)",
    modelCreationType,
    models.length,
    models.length === 1 ? "model" : "models",
    models.map((model) => model.name).join(", ")
  );
  for (let model of models)
    mongoose2.model(model.name, model.schema, model.collection);
  let readyState = mongoose2.connection.readyState;
  if (readyState > 0) {
    console.log("Mongoose: Re-using existing connection (readyState: %d)", readyState);
    return;
  }
  mongoose2.connection.on("error", (error) => {
    console.error("Mongoose: error %s", error);
  });
  for (let event of ["connected", "reconnected", "disconnected", "close"])
    mongoose2.connection.on(event, () => console.log("Mongoose: %s", event));
  mongoose2.connect(MONGODB_URL).catch((error) => {
    console.error(error);
  });
}

// app/entry.server.jsx
import { jsxDEV } from "react/jsx-dev-runtime";
connectDb();
await initData();
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return isbot(request.headers.get("user-agent")) ? handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) : handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext);
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsxDEV(RemixServer, { context: remixContext, url: request.url, abortDelay: ABORT_DELAY }, void 0, !1, {
        fileName: "app/entry.server.jsx",
        lineNumber: 30,
        columnNumber: 7
      }, this),
      {
        onAllReady() {
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsxDEV(RemixServer, { context: remixContext, url: request.url, abortDelay: ABORT_DELAY }, void 0, !1, {
        fileName: "app/entry.server.jsx",
        lineNumber: 64,
        columnNumber: 7
      }, this),
      {
        onShellReady() {
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          console.error(error), responseStatusCode = 500;
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.jsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  loader: () => loader
});
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";

// app/tailwind.css
var tailwind_default = "/build/_assets/tailwind-FZTGOBIL.css";

// app/components/Nav.jsx
import { NavLink } from "@remix-run/react";
import { jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";
function Nav() {
  return /* @__PURE__ */ jsxDEV2("nav", { className: "bg-slate-500", children: [
    /* @__PURE__ */ jsxDEV2(NavLink, { to: "/dashboard", children: "Posts" }, void 0, !1, {
      fileName: "app/components/Nav.jsx",
      lineNumber: 6,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV2(NavLink, { to: "/add-post", children: "Add Post" }, void 0, !1, {
      fileName: "app/components/Nav.jsx",
      lineNumber: 7,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV2(NavLink, { to: "/profile", children: "Profile" }, void 0, !1, {
      fileName: "app/components/Nav.jsx",
      lineNumber: 8,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/Nav.jsx",
    lineNumber: 5,
    columnNumber: 5
  }, this);
}

// app/services/auth.server.jsx
import { Authenticator, AuthorizationError } from "remix-auth";

// app/services/session.server.jsx
import { createCookieSessionStorage } from "@remix-run/node";
var sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    // use any name you want here
    sameSite: "lax",
    // this helps with CSRF
    path: "/",
    // remember to add this so the cookie will work in all routes
    httpOnly: !0,
    // for security reasons, make this cookie http only
    secrets: ["s3cr3t"],
    // replace this with an actual secret
    secure: !1
    // enable this in prod only
  }
}), { getSession, commitSession, destroySession } = sessionStorage;

// app/services/auth.server.jsx
import { FormStrategy } from "remix-auth-form";
import bcrypt2 from "bcrypt";
import mongoose3 from "mongoose";
var authenticator = new Authenticator(sessionStorage, {
  sessionErrorKey: "sessionErrorKey"
  // keep in sync
});
authenticator.use(
  new FormStrategy(async ({ form }) => {
    let mail = form.get("mail"), password = form.get("password");
    if (!mail || typeof mail != "string" || !mail.trim())
      throw new AuthorizationError("Email is required and must be a string");
    if (!password || typeof password != "string" || !password.trim())
      throw new AuthorizationError("Password is required and must be a string");
    let user = await verifyUser({ mail, password });
    if (!user)
      throw new AuthorizationError("User not found");
    return console.log(user), user;
  }),
  "user-pass"
);
async function verifyUser({ mail, password }) {
  let user = await mongoose3.models.User.findOne({ mail }).select("+password");
  if (!user)
    throw new AuthorizationError("No user found with this email.");
  if (!await bcrypt2.compare(password, user.password))
    throw new AuthorizationError("Invalid password.");
  return user.password = void 0, user;
}

// app/root.jsx
import { jsxDEV as jsxDEV3 } from "react/jsx-dev-runtime";
function links() {
  return [
    { rel: "stylesheet", href: tailwind_default },
    { rel: "stylesheet", href: "/fonts/inter/inter.css" }
  ];
}
async function loader({ request }) {
  return await authenticator.isAuthenticated(request);
}
function App() {
  let user = useLoaderData();
  return /* @__PURE__ */ jsxDEV3("html", { lang: "en", children: [
    /* @__PURE__ */ jsxDEV3("head", { children: [
      /* @__PURE__ */ jsxDEV3("meta", { charSet: "utf-8" }, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 21,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV3("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 22,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV3(Meta, {}, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 23,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV3(Links, {}, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 24,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.jsx",
      lineNumber: 20,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV3("body", { children: [
      user ? /* @__PURE__ */ jsxDEV3(Nav, {}, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 27,
        columnNumber: 17
      }, this) : null,
      /* @__PURE__ */ jsxDEV3(Outlet, {}, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 29,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV3(ScrollRestoration, {}, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 30,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV3(Scripts, {}, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 31,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV3(LiveReload, {}, void 0, !1, {
        fileName: "app/root.jsx",
        lineNumber: 32,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.jsx",
      lineNumber: 26,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.jsx",
    lineNumber: 19,
    columnNumber: 5
  }, this);
}

// app/routes/posts.$postId.destroy.jsx
var posts_postId_destroy_exports = {};
__export(posts_postId_destroy_exports, {
  action: () => action,
  loader: () => loader2
});
import { redirect } from "@remix-run/node";
import mongoose4 from "mongoose";
async function loader2({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
}
async function action({ request, params }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), await mongoose4.models.Post.findByIdAndDelete(params.postId), redirect("/posts");
}

// app/routes/posts.$postId_.update.jsx
var posts_postId_update_exports = {};
__export(posts_postId_update_exports, {
  action: () => action2,
  default: () => UpdatePost,
  loader: () => loader3,
  meta: () => meta
});
import { json, redirect as redirect2 } from "@remix-run/node";
import { Form, useLoaderData as useLoaderData2, useNavigate } from "@remix-run/react";
import mongoose5 from "mongoose";
import { useState } from "react";
import { jsxDEV as jsxDEV4 } from "react/jsx-dev-runtime";
function meta() {
  return [
    {
      title: "Remix Post App - Update"
    }
  ];
}
async function loader3({ request, params }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
  let post = await mongoose5.models.Post.findById(params.postId).populate("user");
  return json({ post });
}
function UpdatePost() {
  let { post } = useLoaderData2(), [image, setImage] = useState(post.image), navigate = useNavigate();
  function handleCancel() {
    navigate(-1);
  }
  return /* @__PURE__ */ jsxDEV4("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV4("h1", { children: "Update Post" }, void 0, !1, {
      fileName: "app/routes/posts.$postId_.update.jsx",
      lineNumber: 35,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV4(Form, { id: "post-form", method: "post", children: [
      /* @__PURE__ */ jsxDEV4("label", { htmlFor: "caption", children: "Caption" }, void 0, !1, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 37,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV4(
        "input",
        {
          id: "caption",
          defaultValue: post.caption,
          name: "caption",
          type: "text",
          "aria-label": "caption",
          placeholder: "Write a caption..."
        },
        void 0,
        !1,
        {
          fileName: "app/routes/posts.$postId_.update.jsx",
          lineNumber: 38,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV4("label", { htmlFor: "image", children: "Image URL" }, void 0, !1, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 46,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV4(
        "input",
        {
          name: "image",
          defaultValue: post.image,
          type: "url",
          onChange: (e) => setImage(e.target.value),
          placeholder: "Paste an image URL..."
        },
        void 0,
        !1,
        {
          fileName: "app/routes/posts.$postId_.update.jsx",
          lineNumber: 47,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV4("label", { htmlFor: "image-preview", children: "Image Preview" }, void 0, !1, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 55,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV4(
        "img",
        {
          id: "image-preview",
          className: "image-preview",
          src: image || "https://placehold.co/600x400?text=Paste+an+image+URL",
          alt: "Choose",
          onError: (e) => e.target.src = "https://placehold.co/600x400?text=Error+loading+image"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/posts.$postId_.update.jsx",
          lineNumber: 56,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV4("input", { name: "uid", type: "text", defaultValue: post.uid, hidden: !0 }, void 0, !1, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 64,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV4("div", { className: "btns", children: [
        /* @__PURE__ */ jsxDEV4("button", { children: "Save" }, void 0, !1, {
          fileName: "app/routes/posts.$postId_.update.jsx",
          lineNumber: 66,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV4("button", { type: "button", className: "btn-cancel", onClick: handleCancel, children: "Cancel" }, void 0, !1, {
          fileName: "app/routes/posts.$postId_.update.jsx",
          lineNumber: 67,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 65,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/posts.$postId_.update.jsx",
      lineNumber: 36,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/posts.$postId_.update.jsx",
    lineNumber: 34,
    columnNumber: 5
  }, this);
}
async function action2({ request, params }) {
  let authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), postToUpdate = await mongoose5.models.Post.findById(params.postId);
  if (postToUpdate.user.toString() !== authUser._id.toString())
    return redirect2(`/posts/${params.postId}`);
  let formData = await request.formData(), post = Object.fromEntries(formData);
  return postToUpdate.caption = post.caption, postToUpdate.image = post.image, await postToUpdate.save(), redirect2(`/posts/${params.postId}`);
}

// app/routes/dashboard._index.jsx
var dashboard_index_exports = {};
__export(dashboard_index_exports, {
  default: () => Index,
  loader: () => loader4,
  meta: () => meta2
});
import { json as json2 } from "@remix-run/node";
import { useLoaderData as useLoaderData3 } from "@remix-run/react";
import mongoose6 from "mongoose";

// app/components/UserAvatar.jsx
import { jsxDEV as jsxDEV5 } from "react/jsx-dev-runtime";
function UserAvatar({ user }) {
  return /* @__PURE__ */ jsxDEV5("div", { className: "avatar", children: [
    /* @__PURE__ */ jsxDEV5("img", { src: user.image, alt: user.name }, void 0, !1, {
      fileName: "app/components/UserAvatar.jsx",
      lineNumber: 4,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV5("span", { children: [
      /* @__PURE__ */ jsxDEV5("h3", { children: user.name }, void 0, !1, {
        fileName: "app/components/UserAvatar.jsx",
        lineNumber: 6,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5("p", { children: user.title }, void 0, !1, {
        fileName: "app/components/UserAvatar.jsx",
        lineNumber: 7,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/UserAvatar.jsx",
      lineNumber: 5,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/UserAvatar.jsx",
    lineNumber: 3,
    columnNumber: 5
  }, this);
}

// app/components/PostCard.jsx
import { jsxDEV as jsxDEV6 } from "react/jsx-dev-runtime";
function PostCard({ post }) {
  return /* @__PURE__ */ jsxDEV6("article", { className: "post-card", children: [
    /* @__PURE__ */ jsxDEV6(UserAvatar, { user: post.user }, void 0, !1, {
      fileName: "app/components/PostCard.jsx",
      lineNumber: 6,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV6("img", { src: post.image, alt: post.caption }, void 0, !1, {
      fileName: "app/components/PostCard.jsx",
      lineNumber: 7,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV6("h3", { children: post.caption }, void 0, !1, {
      fileName: "app/components/PostCard.jsx",
      lineNumber: 8,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/PostCard.jsx",
    lineNumber: 5,
    columnNumber: 5
  }, this);
}

// app/components/DashboardData.jsx
import { useEffect, useState as useState2 } from "react";
import { Fragment, jsxDEV as jsxDEV7 } from "react/jsx-dev-runtime";
var DashboardData = () => {
  let [weatherData, setWeatherData] = useState2(null), [city, setCity] = useState2("Loading..."), [inputCity, setInputCity] = useState2(""), apiKey = "84c59fa875b07f0e54b6dd1ce011f187", fetchWeatherData = async (city2) => {
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city2}&appid=${apiKey}&units=metric`;
    try {
      let response = await fetch(apiUrl);
      if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      let data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }, fetchCityByCoordinates = async (lat, lon) => {
    let reverseGeoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    try {
      let data = await (await fetch(reverseGeoUrl)).json();
      data && data.length > 0 && setCity(data[0].name);
    } catch (error) {
      console.error("Error fetching city by coordinates:", error);
    }
  }, getUserLocation = () => {
    navigator.geolocation ? navigator.geolocation.getCurrentPosition(
      (position) => {
        let { latitude, longitude } = position.coords;
        fetchCityByCoordinates(latitude, longitude);
      },
      (error) => {
        console.error("Error getting user location:", error), setCity("London");
      }
    ) : (console.error("Geolocation is not supported by this browser."), setCity("London"));
  };
  return useEffect(() => {
    getUserLocation();
  }, []), useEffect(() => {
    city !== "Loading..." && fetchWeatherData(city);
  }, [city]), /* @__PURE__ */ jsxDEV7("div", { children: [
    /* @__PURE__ */ jsxDEV7("h1", { children: [
      "Weather in ",
      city
    ] }, void 0, !0, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 78,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV7("form", { onSubmit: (e) => {
      e.preventDefault(), inputCity && (setCity(inputCity), setInputCity(""));
    }, children: [
      /* @__PURE__ */ jsxDEV7(
        "input",
        {
          type: "text",
          placeholder: "Enter city name",
          value: inputCity,
          onChange: (e) => setInputCity(e.target.value)
        },
        void 0,
        !1,
        {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 80,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV7("button", { type: "submit", children: "Search" }, void 0, !1, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 86,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 79,
      columnNumber: 7
    }, this),
    weatherData ? /* @__PURE__ */ jsxDEV7("div", { children: weatherData.list && weatherData.list.length > 0 ? /* @__PURE__ */ jsxDEV7(Fragment, { children: [
      /* @__PURE__ */ jsxDEV7("p", { children: [
        "Temperature: ",
        weatherData.list[0].main.temp,
        " \xB0C"
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 92,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV7("p", { children: [
        "Feels Like: ",
        weatherData.list[0].main.feels_like,
        " \xB0C"
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 93,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV7("p", { children: [
        "Weather: ",
        weatherData.list[0].weather[0].description
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 94,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV7("p", { children: [
        "Humidity: ",
        weatherData.list[0].main.humidity,
        "%"
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 95,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV7("p", { children: [
        "Wind Speed: ",
        weatherData.list[0].wind.speed,
        " m/s"
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 96,
        columnNumber: 15
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 91,
      columnNumber: 13
    }, this) : /* @__PURE__ */ jsxDEV7("p", { children: "No weather data available." }, void 0, !1, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 99,
      columnNumber: 13
    }, this) }, void 0, !1, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 89,
      columnNumber: 9
    }, this) : /* @__PURE__ */ jsxDEV7("p", { children: "Loading..." }, void 0, !1, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 103,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/DashboardData.jsx",
    lineNumber: 77,
    columnNumber: 5
  }, this);
}, DashboardData_default = DashboardData;

// app/routes/dashboard._index.jsx
import { jsxDEV as jsxDEV8 } from "react/jsx-dev-runtime";
var meta2 = () => [{ title: "Remix Post App" }];
async function loader4({ request }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
  let posts = await mongoose6.models.Post.find().sort({ createdAt: -1 }).populate("user");
  return json2({ posts });
}
function Index() {
  let { posts } = useLoaderData3();
  return /* @__PURE__ */ jsxDEV8("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV8("h1", { children: "Posts" }, void 0, !1, {
      fileName: "app/routes/dashboard._index.jsx",
      lineNumber: 26,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV8(DashboardData_default, {}, void 0, !1, {
      fileName: "app/routes/dashboard._index.jsx",
      lineNumber: 27,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/dashboard._index.jsx",
    lineNumber: 25,
    columnNumber: 5
  }, this);
}

// app/routes/posts.$postId.jsx
var posts_postId_exports = {};
__export(posts_postId_exports, {
  default: () => Post,
  loader: () => loader5,
  meta: () => meta3
});
import { json as json3 } from "@remix-run/node";
import { Form as Form2, useLoaderData as useLoaderData4 } from "@remix-run/react";
import mongoose7 from "mongoose";
import { jsxDEV as jsxDEV9 } from "react/jsx-dev-runtime";
function meta3({ data }) {
  return [
    {
      title: `Remix Post App - ${data.post.caption || "Post"}`
    }
  ];
}
async function loader5({ request, params }) {
  let authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), post = await mongoose7.models.Post.findById(params.postId).populate("user");
  return json3({ post, authUser });
}
function Post() {
  let { post, authUser } = useLoaderData4();
  function confirmDelete(event) {
    confirm("Please confirm you want to delete this post.") || event.preventDefault();
  }
  return /* @__PURE__ */ jsxDEV9("div", { id: "post-page", className: "page", children: [
    /* @__PURE__ */ jsxDEV9("h1", { children: post.caption }, void 0, !1, {
      fileName: "app/routes/posts.$postId.jsx",
      lineNumber: 37,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV9(PostCard, { post }, void 0, !1, {
      fileName: "app/routes/posts.$postId.jsx",
      lineNumber: 38,
      columnNumber: 7
    }, this),
    authUser._id === post.user._id && /* @__PURE__ */ jsxDEV9("div", { className: "btns", children: [
      /* @__PURE__ */ jsxDEV9(Form2, { action: "update", children: /* @__PURE__ */ jsxDEV9("button", { children: "Update" }, void 0, !1, {
        fileName: "app/routes/posts.$postId.jsx",
        lineNumber: 42,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/posts.$postId.jsx",
        lineNumber: 41,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV9(Form2, { action: "destroy", method: "post", onSubmit: confirmDelete, children: /* @__PURE__ */ jsxDEV9("button", { children: "Delete" }, void 0, !1, {
        fileName: "app/routes/posts.$postId.jsx",
        lineNumber: 45,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/posts.$postId.jsx",
        lineNumber: 44,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/posts.$postId.jsx",
      lineNumber: 40,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/posts.$postId.jsx",
    lineNumber: 36,
    columnNumber: 5
  }, this);
}

// app/routes/users._index.jsx
var users_index_exports = {};

// app/routes/add-post.jsx
var add_post_exports = {};
__export(add_post_exports, {
  action: () => action3,
  default: () => AddPost,
  loader: () => loader6,
  meta: () => meta4
});
import { redirect as redirect3 } from "@remix-run/node";
import { Form as Form3, useNavigate as useNavigate2 } from "@remix-run/react";
import mongoose8 from "mongoose";
import { useState as useState3 } from "react";
import { jsxDEV as jsxDEV10 } from "react/jsx-dev-runtime";
var meta4 = () => [{ title: "Remix Post App - Add New Post" }];
async function loader6({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
}
function AddPost() {
  let [image, setImage] = useState3("https://placehold.co/600x400?text=Add+your+amazing+image"), navigate = useNavigate2();
  function handleCancel() {
    navigate(-1);
  }
  return /* @__PURE__ */ jsxDEV10("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV10("h1", { children: "Add a Post" }, void 0, !1, {
      fileName: "app/routes/add-post.jsx",
      lineNumber: 27,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV10(Form3, { id: "post-form", method: "post", children: [
      /* @__PURE__ */ jsxDEV10("label", { htmlFor: "caption", children: "Caption" }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 29,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV10("input", { id: "caption", name: "caption", type: "text", "aria-label": "caption", placeholder: "Write a caption..." }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 30,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV10("label", { htmlFor: "image", children: "Image URL" }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 32,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV10("input", { name: "image", type: "url", onChange: (e) => setImage(e.target.value), placeholder: "Paste an image URL..." }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 33,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV10("label", { htmlFor: "image-preview", children: "Image Preview" }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 35,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV10(
        "img",
        {
          id: "image-preview",
          className: "image-preview",
          src: image || "https://placehold.co/600x400?text=Paste+an+image+URL",
          alt: "Choose",
          onError: (e) => e.target.src = "https://placehold.co/600x400?text=Error+loading+image"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/add-post.jsx",
          lineNumber: 36,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV10("div", { className: "btns", children: [
        /* @__PURE__ */ jsxDEV10("button", { children: "Save" }, void 0, !1, {
          fileName: "app/routes/add-post.jsx",
          lineNumber: 45,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV10("button", { type: "button", className: "btn-cancel", onClick: handleCancel, children: "Cancel" }, void 0, !1, {
          fileName: "app/routes/add-post.jsx",
          lineNumber: 46,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 44,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/add-post.jsx",
      lineNumber: 28,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/add-post.jsx",
    lineNumber: 26,
    columnNumber: 5
  }, this);
}
async function action3({ request }) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
  console.log(user);
  let formData = await request.formData(), post = Object.fromEntries(formData);
  return post.user = user._id, await mongoose8.models.Post.create(post), redirect3("/posts");
}

// app/routes/profile.jsx
var profile_exports = {};
__export(profile_exports, {
  action: () => action4,
  default: () => Profile,
  loader: () => loader7
});
import { Form as Form4, useLoaderData as useLoaderData5 } from "@remix-run/react";
import { jsxDEV as jsxDEV11 } from "react/jsx-dev-runtime";
async function loader7({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
}
function Profile() {
  let user = useLoaderData5();
  return /* @__PURE__ */ jsxDEV11("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV11("h1", { children: "Profile" }, void 0, !1, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 15,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV11("p", { children: [
      "Name: ",
      user.name
    ] }, void 0, !0, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 16,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV11("p", { children: [
      "Title: ",
      user.title
    ] }, void 0, !0, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 17,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV11("p", { children: [
      "Mail: ",
      user.mail
    ] }, void 0, !0, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 18,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV11(Form4, { method: "post", children: /* @__PURE__ */ jsxDEV11("button", { children: "Logout" }, void 0, !1, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 20,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 19,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/profile.jsx",
    lineNumber: 14,
    columnNumber: 5
  }, this);
}
async function action4({ request }) {
  await authenticator.logout(request, { redirectTo: "/signin" });
}

// app/routes/_index.jsx
var index_exports = {};
__export(index_exports, {
  loader: () => loader8,
  meta: () => meta5
});
var meta5 = () => [{ title: "Remix Post App" }];
async function loader8({ request }) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
    failureRedirect: "/signin"
  });
}

// app/routes/signin.jsx
var signin_exports = {};
__export(signin_exports, {
  action: () => action5,
  default: () => SignIn,
  loader: () => loader9
});
import { json as json4 } from "@remix-run/node";
import { Form as Form5, NavLink as NavLink2, useLoaderData as useLoaderData6 } from "@remix-run/react";
import { jsxDEV as jsxDEV12 } from "react/jsx-dev-runtime";
async function loader9({ request }) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard"
  });
  let session = await sessionStorage.getSession(request.headers.get("Cookie")), error = session.get("sessionErrorKey");
  session.unset("sessionErrorKey");
  let headers = new Headers({
    "Set-Cookie": await sessionStorage.commitSession(session)
  });
  return json4({ error }, { headers });
}
function SignIn() {
  let loaderData = useLoaderData6();
  return /* @__PURE__ */ jsxDEV12(
    "div",
    {
      id: "sign-in-page",
      className: "bg-slate-200 flex flex-col justify-center items-center rounded-lg h-80 w-72 ml-auto mr-auto mt-52 p-4 gap-3",
      children: [
        /* @__PURE__ */ jsxDEV12("h1", { className: "text-2xl w-auto", children: "Sign In" }, void 0, !1, {
          fileName: "app/routes/signin.jsx",
          lineNumber: 33,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV12(Form5, { id: "sign-in-form", method: "post", className: "flex items-center flex-col gap-1 w-full", children: [
          /* @__PURE__ */ jsxDEV12("label", { htmlFor: "mail", children: "Mail" }, void 0, !1, {
            fileName: "app/routes/signin.jsx",
            lineNumber: 35,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV12(
            "input",
            {
              id: "mail",
              type: "email",
              name: "mail",
              "aria-label": "mail",
              placeholder: "Type your mail...",
              required: !0,
              className: "p-2 rounded-xl w-full"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/signin.jsx",
              lineNumber: 36,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV12("label", { htmlFor: "password", className: "", children: "Password" }, void 0, !1, {
            fileName: "app/routes/signin.jsx",
            lineNumber: 46,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV12(
            "input",
            {
              id: "password",
              type: "password",
              name: "password",
              "aria-label": "password",
              placeholder: "Type your password...",
              autoComplete: "current-password",
              className: "p-2 rounded-xl w-full"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/signin.jsx",
              lineNumber: 49,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV12("div", { className: "bg-sky-500 text-white hover:bg-sky-600 transition-colors p-2 rounded-xl mt-2 w-32 flex justify-center", children: /* @__PURE__ */ jsxDEV12("button", { children: "Sign In" }, void 0, !1, {
            fileName: "app/routes/signin.jsx",
            lineNumber: 59,
            columnNumber: 11
          }, this) }, void 0, !1, {
            fileName: "app/routes/signin.jsx",
            lineNumber: 58,
            columnNumber: 9
          }, this),
          loaderData?.error ? /* @__PURE__ */ jsxDEV12("div", { className: "error-message", children: /* @__PURE__ */ jsxDEV12("p", { children: loaderData?.error?.message }, void 0, !1, {
            fileName: "app/routes/signin.jsx",
            lineNumber: 64,
            columnNumber: 13
          }, this) }, void 0, !1, {
            fileName: "app/routes/signin.jsx",
            lineNumber: 63,
            columnNumber: 11
          }, this) : null
        ] }, void 0, !0, {
          fileName: "app/routes/signin.jsx",
          lineNumber: 34,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV12("p", { className: "flex", children: [
          "No account?",
          " ",
          /* @__PURE__ */ jsxDEV12(NavLink2, { to: "/signup", className: "text-sky-500", children: "Sign up here." }, void 0, !1, {
            fileName: "app/routes/signin.jsx",
            lineNumber: 70,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/signin.jsx",
          lineNumber: 68,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/routes/signin.jsx",
      lineNumber: 29,
      columnNumber: 5
    },
    this
  );
}
async function action5({ request }) {
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/posts",
    failureRedirect: "/signin"
  });
}

// app/routes/signup.jsx
var signup_exports = {};
__export(signup_exports, {
  action: () => action6,
  default: () => SignUp,
  loader: () => loader10
});
import { json as json5, redirect as redirect4 } from "@remix-run/node";
import { Form as Form6, NavLink as NavLink3, useLoaderData as useLoaderData7 } from "@remix-run/react";
import mongoose9 from "mongoose";
import { jsxDEV as jsxDEV13 } from "react/jsx-dev-runtime";
async function loader10({ request }) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/posts"
  });
  let session = await sessionStorage.getSession(request.headers.get("Cookie")), error = session.get("sessionErrorKey");
  session.unset("sessionErrorKey");
  let headers = new Headers({
    "Set-Cookie": await sessionStorage.commitSession(session)
  });
  return json5({ error }, { headers });
}
function SignUp() {
  let loaderData = useLoaderData7();
  return console.log("error:", loaderData?.error), /* @__PURE__ */ jsxDEV13(
    "div",
    {
      id: "sign-up-page",
      className: "bg-slate-200 flex flex-col justify-center items-center rounded-lg h-80 w-72 ml-auto mr-auto mt-52 p-4 gap-3",
      children: [
        /* @__PURE__ */ jsxDEV13("h1", { className: "text-2xl w-auto", children: "Sign Up" }, void 0, !1, {
          fileName: "app/routes/signup.jsx",
          lineNumber: 36,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV13(Form6, { id: "sign-up-form", method: "post", className: "flex items-center flex-col gap-1 w-full", children: [
          /* @__PURE__ */ jsxDEV13("label", { htmlFor: "mail", children: "Mail" }, void 0, !1, {
            fileName: "app/routes/signup.jsx",
            lineNumber: 38,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV13(
            "input",
            {
              id: "mail",
              type: "email",
              name: "mail",
              "aria-label": "mail",
              placeholder: "Type your mail...",
              required: !0,
              autoComplete: "off",
              className: "p-2 rounded-xl w-full"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/signup.jsx",
              lineNumber: 39,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV13("label", { htmlFor: "password", children: "Password" }, void 0, !1, {
            fileName: "app/routes/signup.jsx",
            lineNumber: 50,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV13(
            "input",
            {
              id: "password",
              type: "password",
              name: "password",
              "aria-label": "password",
              placeholder: "Type your password...",
              autoComplete: "current-password",
              className: "p-2 rounded-xl w-full"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/signup.jsx",
              lineNumber: 52,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV13("div", { className: "bg-sky-500 text-white hover:bg-sky-600 transition-colors p-2 rounded-xl mt-2 w-32 flex justify-center", children: /* @__PURE__ */ jsxDEV13("button", { children: "Sign Up" }, void 0, !1, {
            fileName: "app/routes/signup.jsx",
            lineNumber: 62,
            columnNumber: 11
          }, this) }, void 0, !1, {
            fileName: "app/routes/signup.jsx",
            lineNumber: 61,
            columnNumber: 9
          }, this),
          loaderData?.error ? /* @__PURE__ */ jsxDEV13("div", { className: "error-message", children: /* @__PURE__ */ jsxDEV13("p", { children: loaderData?.error?.message }, void 0, !1, {
            fileName: "app/routes/signup.jsx",
            lineNumber: 67,
            columnNumber: 13
          }, this) }, void 0, !1, {
            fileName: "app/routes/signup.jsx",
            lineNumber: 66,
            columnNumber: 11
          }, this) : null
        ] }, void 0, !0, {
          fileName: "app/routes/signup.jsx",
          lineNumber: 37,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV13("p", { children: [
          "Already have an account?",
          " ",
          /* @__PURE__ */ jsxDEV13(NavLink3, { to: "/signin", className: "text-sky-500", children: "Sign in here." }, void 0, !1, {
            fileName: "app/routes/signup.jsx",
            lineNumber: 73,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/signup.jsx",
          lineNumber: 71,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/routes/signup.jsx",
      lineNumber: 32,
      columnNumber: 5
    },
    this
  );
}
async function action6({ request }) {
  try {
    let formData = await request.formData(), newUser = Object.fromEntries(formData);
    return await mongoose9.models.User.create(newUser), redirect4("/signin");
  } catch (error) {
    return console.log(error), redirect4("/signup");
  }
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-KRQQFHVH.js", imports: ["/build/_shared/chunk-ZWGWGGVF.js", "/build/_shared/chunk-32OR2PNH.js", "/build/_shared/chunk-GIAAE3CH.js", "/build/_shared/chunk-XU7DNSPJ.js", "/build/_shared/chunk-HKPYBBGK.js", "/build/_shared/chunk-UWV35TSL.js", "/build/_shared/chunk-BOXFZXVX.js", "/build/_shared/chunk-PNG5AS42.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-HBSXKTRY.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-LUY5FOFR.js", imports: ["/build/_shared/chunk-SARLQUTN.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/add-post": { id: "routes/add-post", parentId: "root", path: "add-post", index: void 0, caseSensitive: void 0, module: "/build/routes/add-post-T2SXTML4.js", imports: ["/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-SARLQUTN.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/dashboard._index": { id: "routes/dashboard._index", parentId: "root", path: "dashboard", index: !0, caseSensitive: void 0, module: "/build/routes/dashboard._index-GXY43BO7.js", imports: ["/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-SARLQUTN.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId": { id: "routes/posts.$postId", parentId: "root", path: "posts/:postId", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId-W4JSCDNF.js", imports: ["/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-SARLQUTN.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId.destroy": { id: "routes/posts.$postId.destroy", parentId: "routes/posts.$postId", path: "destroy", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId.destroy-QJD7CVP4.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId_.update": { id: "routes/posts.$postId_.update", parentId: "root", path: "posts/:postId/update", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId_.update-RL7NDCYO.js", imports: ["/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-SARLQUTN.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/profile": { id: "routes/profile", parentId: "root", path: "profile", index: void 0, caseSensitive: void 0, module: "/build/routes/profile-MYSOPDFP.js", imports: ["/build/_shared/chunk-SARLQUTN.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/signin": { id: "routes/signin", parentId: "root", path: "signin", index: void 0, caseSensitive: void 0, module: "/build/routes/signin-FUGNCTYA.js", imports: ["/build/_shared/chunk-QUYRSHBJ.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-SARLQUTN.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/signup": { id: "routes/signup", parentId: "root", path: "signup", index: void 0, caseSensitive: void 0, module: "/build/routes/signup-UM6FE5WO.js", imports: ["/build/_shared/chunk-QUYRSHBJ.js", "/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-SARLQUTN.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/users._index": { id: "routes/users._index", parentId: "root", path: "users", index: !0, caseSensitive: void 0, module: "/build/routes/users._index-6AIM527Q.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "85f7e046", hmr: { runtime: "/build/_shared/chunk-HKPYBBGK.js", timestamp: 1729768635436 }, url: "/build/manifest-85F7E046.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "development", assetsBuildDirectory = "public/build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1, v3_throwAbortReason: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/posts.$postId.destroy": {
    id: "routes/posts.$postId.destroy",
    parentId: "routes/posts.$postId",
    path: "destroy",
    index: void 0,
    caseSensitive: void 0,
    module: posts_postId_destroy_exports
  },
  "routes/posts.$postId_.update": {
    id: "routes/posts.$postId_.update",
    parentId: "root",
    path: "posts/:postId/update",
    index: void 0,
    caseSensitive: void 0,
    module: posts_postId_update_exports
  },
  "routes/dashboard._index": {
    id: "routes/dashboard._index",
    parentId: "root",
    path: "dashboard",
    index: !0,
    caseSensitive: void 0,
    module: dashboard_index_exports
  },
  "routes/posts.$postId": {
    id: "routes/posts.$postId",
    parentId: "root",
    path: "posts/:postId",
    index: void 0,
    caseSensitive: void 0,
    module: posts_postId_exports
  },
  "routes/users._index": {
    id: "routes/users._index",
    parentId: "root",
    path: "users",
    index: !0,
    caseSensitive: void 0,
    module: users_index_exports
  },
  "routes/add-post": {
    id: "routes/add-post",
    parentId: "root",
    path: "add-post",
    index: void 0,
    caseSensitive: void 0,
    module: add_post_exports
  },
  "routes/profile": {
    id: "routes/profile",
    parentId: "root",
    path: "profile",
    index: void 0,
    caseSensitive: void 0,
    module: profile_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  },
  "routes/signin": {
    id: "routes/signin",
    parentId: "root",
    path: "signin",
    index: void 0,
    caseSensitive: void 0,
    module: signin_exports
  },
  "routes/signup": {
    id: "routes/signup",
    parentId: "root",
    path: "signup",
    index: void 0,
    caseSensitive: void 0,
    module: signup_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
//# sourceMappingURL=index.js.map
