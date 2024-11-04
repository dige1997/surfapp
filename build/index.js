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
    lastname: String,
    // New field for last name
    password: {
      type: String,
      required: !0,
      // Ensure user passwords are required
      select: !1
      // Automatically exclude from query results
    },
    hobbies: [String]
    // Array of strings for hobbies
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
    lastname: "Doe",
    // Example last name
    password: "1234",
    hobbies: ["Surf", "Ski"]
    // Example hobbies
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
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";

// app/tailwind.css
var tailwind_default = "/build/_assets/tailwind-PKNYWFKS.css";

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
  return /* @__PURE__ */ jsxDEV3(
    "html",
    {
      lang: "en",
      className: "bg-gradient-to-t from-blue-50 to-cyan-200 bg-no-repeat h-screen",
      children: [
        /* @__PURE__ */ jsxDEV3("head", { children: [
          /* @__PURE__ */ jsxDEV3("meta", { charSet: "utf-8" }, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 32,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV3("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 33,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV3(Meta, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 34,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV3(Links, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 35,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/root.jsx",
          lineNumber: 31,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV3("body", { children: [
          user ? /* @__PURE__ */ jsxDEV3(Nav, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 38,
            columnNumber: 17
          }, this) : null,
          /* @__PURE__ */ jsxDEV3(Outlet, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 40,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV3(ScrollRestoration, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 41,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV3(Scripts, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 42,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV3(LiveReload, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 43,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/root.jsx",
          lineNumber: 37,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/root.jsx",
      lineNumber: 27,
      columnNumber: 5
    },
    this
  );
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

// app/components/DashboardData.jsx
import { useEffect, useState as useState2 } from "react";
import { Fragment, jsxDEV as jsxDEV5 } from "react/jsx-dev-runtime";
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
        console.error("Error getting user location:", error), setCity("Copenhagen");
      }
    ) : (console.error("Geolocation is not supported by this browser."), setCity("Copenhagen"));
  };
  return useEffect(() => {
    getUserLocation();
  }, []), useEffect(() => {
    city !== "Loading..." && fetchWeatherData(city);
  }, [city]), /* @__PURE__ */ jsxDEV5("div", { className: "flex flex-col  p-4", children: [
    /* @__PURE__ */ jsxDEV5("div", { className: "", children: [
      /* @__PURE__ */ jsxDEV5("form", { className: "flex flex-row  justify-center", onSubmit: (e) => {
        e.preventDefault(), inputCity && (setCity(inputCity), setInputCity(""));
      }, children: [
        /* @__PURE__ */ jsxDEV5(
          "input",
          {
            type: "text",
            placeholder: "Enter city name",
            value: inputCity,
            onChange: (e) => setInputCity(e.target.value),
            className: "bg-slate-50 p-2 rounded-l-2xl focus:outline-none"
          },
          void 0,
          !1,
          {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 80,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV5("button", { className: "bg-slate-50 rounded-r-2xl p-2 ", type: "submit", children: /* @__PURE__ */ jsxDEV5(
          "svg",
          {
            width: "20px",
            height: "20px",
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            children: /* @__PURE__ */ jsxDEV5(
              "path",
              {
                d: "M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z",
                stroke: "gray",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              },
              void 0,
              !1,
              {
                fileName: "app/components/DashboardData.jsx",
                lineNumber: 95,
                columnNumber: 15
              },
              this
            )
          },
          void 0,
          !1,
          {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 88,
            columnNumber: 13
          },
          this
        ) }, void 0, !1, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 87,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 79,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5("h1", { className: "text-3xl font-bold justify-center flex", children: [
        " ",
        city
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 105,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 78,
      columnNumber: 7
    }, this),
    weatherData ? /* @__PURE__ */ jsxDEV5("div", { className: "bg-s-100 rounded-xl w-1/2 justify-normal p-6", children: weatherData.list && weatherData.list.length > 0 ? /* @__PURE__ */ jsxDEV5(Fragment, { children: [
      /* @__PURE__ */ jsxDEV5("p", { className: "flex flex-row text-3xl gap-3 items-center", children: [
        /* @__PURE__ */ jsxDEV5(
          "svg",
          {
            fill: "#000000",
            width: "20px",
            height: "20px",
            viewBox: "0 0 32 32",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            children: [
              /* @__PURE__ */ jsxDEV5("title", { children: "temperature-half" }, void 0, !1, {
                fileName: "app/components/DashboardData.jsx",
                lineNumber: 120,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV5("path", { d: "M20.75 6.008c0-6.246-9.501-6.248-9.5 0v13.238c-1.235 1.224-2 2.921-2 4.796 0 3.728 3.022 6.75 6.75 6.75s6.75-3.022 6.75-6.75c0-1.875-0.765-3.572-2-4.796l-0.001-0zM16 29.25c-2.9-0-5.25-2.351-5.25-5.251 0-1.553 0.674-2.948 1.745-3.909l0.005-0.004 0.006-0.012c0.13-0.122 0.215-0.29 0.231-0.477l0-0.003c0.001-0.014 0.007-0.024 0.008-0.038l0.006-0.029v-13.52c-0.003-0.053-0.005-0.115-0.005-0.178 0-1.704 1.381-3.085 3.085-3.085 0.060 0 0.12 0.002 0.179 0.005l-0.008-0c0.051-0.003 0.11-0.005 0.17-0.005 1.704 0 3.085 1.381 3.085 3.085 0 0.063-0.002 0.125-0.006 0.186l0-0.008v13.52l0.006 0.029 0.007 0.036c0.015 0.191 0.101 0.36 0.231 0.482l0 0 0.006 0.012c1.076 0.966 1.75 2.361 1.75 3.913 0 2.9-2.35 5.25-5.25 5.251h-0zM16.75 21.367v-7.866c0-0.414-0.336-0.75-0.75-0.75s-0.75 0.336-0.75 0.75v0 7.866c-1.164 0.338-2 1.394-2 2.646 0 1.519 1.231 2.75 2.75 2.75s2.75-1.231 2.75-2.75c0-1.252-0.836-2.308-1.981-2.641l-0.019-0.005zM26.5 2.25c-1.795 0-3.25 1.455-3.25 3.25s1.455 3.25 3.25 3.25c1.795 0 3.25-1.455 3.25-3.25v0c-0.002-1.794-1.456-3.248-3.25-3.25h-0zM26.5 7.25c-0.966 0-1.75-0.784-1.75-1.75s0.784-1.75 1.75-1.75c0.966 0 1.75 0.784 1.75 1.75v0c-0.001 0.966-0.784 1.749-1.75 1.75h-0z" }, void 0, !1, {
                fileName: "app/components/DashboardData.jsx",
                lineNumber: 121,
                columnNumber: 19
              }, this)
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 112,
            columnNumber: 17
          },
          this
        ),
        " ",
        weatherData.list[0].main.temp,
        " \xB0C"
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 111,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV5("p", { children: [
        "Feels Like: ",
        weatherData.list[0].main.feels_like,
        " \xB0C"
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 125,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV5("p", { className: "flex flex-row gap-3 text-3xl items-center", children: [
        /* @__PURE__ */ jsxDEV5(
          "svg",
          {
            width: "20px",
            height: "20px",
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            children: /* @__PURE__ */ jsxDEV5(
              "path",
              {
                d: "M7.45508 2V3M11.3438 3.61084L10.6366 4.31795M4.27344 10.6821L3.56633 11.3892M1.95508 7.5H2.95508M3.56641 3.61084L4.27351 4.31795M6.50049 9.21251C6.38862 9.15163 6.2832 9.08038 6.18553 9.00006C5.73952 8.63325 5.45508 8.07714 5.45508 7.45459C5.45508 6.35002 6.35051 5.45459 7.45508 5.45459C8.21398 5.45459 8.87416 5.87727 9.21303 6.50006C9.29756 6.65541 9.3621 6.82321 9.40319 7M9.8 21C7.14903 21 5 18.9466 5 16.4137C5 14.3144 6.6 12.375 9 12C9.75283 10.274 11.5346 9 13.6127 9C16.2747 9 18.4504 10.9907 18.6 13.5C20.0127 14.0956 21 15.5574 21 17.1402C21 19.2719 19.2091 21 17 21L9.8 21Z",
                stroke: "#000000",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              },
              void 0,
              !1,
              {
                fileName: "app/components/DashboardData.jsx",
                lineNumber: 134,
                columnNumber: 19
              },
              this
            )
          },
          void 0,
          !1,
          {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 127,
            columnNumber: 17
          },
          this
        ),
        weatherData.list[0].weather[0].description
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 126,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV5("p", { className: "flex flex-row gap-3 text-3xl items-center", children: [
        /* @__PURE__ */ jsxDEV5(
          "svg",
          {
            width: "20px",
            height: "20px",
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            children: [
              /* @__PURE__ */ jsxDEV5(
                "path",
                {
                  d: "M15.0066 3.25608C16.8483 2.85737 19.1331 2.8773 22.2423 3.65268C22.7781 3.78629 23.1038 4.32791 22.9699 4.86241C22.836 5.39691 22.2931 5.7219 21.7573 5.58829C18.8666 4.86742 16.9015 4.88747 15.4308 5.20587C13.9555 5.52524 12.895 6.15867 11.7715 6.84363L11.6874 6.89494C10.6044 7.55565 9.40515 8.28729 7.82073 8.55069C6.17734 8.82388 4.23602 8.58235 1.62883 7.54187C1.11607 7.33724 0.866674 6.75667 1.0718 6.24513C1.27692 5.73359 1.85889 5.48479 2.37165 5.68943C4.76435 6.6443 6.32295 6.77699 7.492 6.58265C8.67888 6.38535 9.58373 5.83916 10.7286 5.14119C11.855 4.45445 13.1694 3.6538 15.0066 3.25608Z",
                  fill: "#0F0F0F"
                },
                void 0,
                !1,
                {
                  fileName: "app/components/DashboardData.jsx",
                  lineNumber: 152,
                  columnNumber: 19
                },
                this
              ),
              /* @__PURE__ */ jsxDEV5(
                "path",
                {
                  d: "M22.2423 7.64302C19.1331 6.86765 16.8483 6.84772 15.0066 7.24642C13.1694 7.64415 11.855 8.44479 10.7286 9.13153C9.58373 9.8295 8.67888 10.3757 7.492 10.573C6.32295 10.7673 4.76435 10.6346 2.37165 9.67977C1.85889 9.47514 1.27692 9.72393 1.0718 10.2355C0.866674 10.747 1.11607 11.3276 1.62883 11.5322C4.23602 12.5727 6.17734 12.8142 7.82073 12.541C9.40515 12.2776 10.6044 11.546 11.6874 10.8853L11.7715 10.834C12.895 10.149 13.9555 9.51558 15.4308 9.19621C16.9015 8.87781 18.8666 8.85777 21.7573 9.57863C22.2931 9.71224 22.836 9.38726 22.9699 8.85275C23.1038 8.31825 22.7781 7.77663 22.2423 7.64302Z",
                  fill: "#0F0F0F"
                },
                void 0,
                !1,
                {
                  fileName: "app/components/DashboardData.jsx",
                  lineNumber: 156,
                  columnNumber: 19
                },
                this
              ),
              /* @__PURE__ */ jsxDEV5(
                "path",
                {
                  "fill-rule": "evenodd",
                  "clip-rule": "evenodd",
                  d: "M18.9998 10.0266C18.6526 10.0266 18.3633 10.2059 18.1614 10.4772C18.0905 10.573 17.9266 10.7972 17.7089 11.111C17.4193 11.5283 17.0317 12.1082 16.6424 12.7555C16.255 13.3996 15.8553 14.128 15.5495 14.8397C15.2567 15.5213 14.9989 16.2614 14.9999 17.0117C15.0006 17.2223 15.0258 17.4339 15.0604 17.6412C15.1182 17.9872 15.2356 18.4636 15.4804 18.9521C15.7272 19.4446 16.1131 19.9674 16.7107 20.3648C17.3146 20.7664 18.0748 21 18.9998 21C19.9248 21 20.685 20.7664 21.2888 20.3648C21.8864 19.9674 22.2724 19.4446 22.5192 18.9522C22.764 18.4636 22.8815 17.9872 22.9393 17.6413C22.974 17.4337 22.9995 17.2215 22.9998 17.0107C23.0001 16.2604 22.743 15.5214 22.4501 14.8397C22.1444 14.128 21.7447 13.3996 21.3573 12.7555C20.968 12.1082 20.5803 11.5283 20.2907 11.111C20.073 10.7972 19.909 10.573 19.8382 10.4772C19.6363 10.2059 19.3469 10.0266 18.9998 10.0266ZM20.6119 15.6257C20.3552 15.0281 20.0049 14.3848 19.6423 13.782C19.4218 13.4154 19.2007 13.0702 18.9998 12.7674C18.7989 13.0702 18.5778 13.4154 18.3573 13.782C17.9948 14.3848 17.6445 15.0281 17.3878 15.6257L17.3732 15.6595C17.1965 16.0704 16.9877 16.5562 17.0001 17.0101C17.0121 17.3691 17.1088 17.7397 17.2693 18.0599C17.3974 18.3157 17.574 18.5411 17.8201 18.7048C18.06 18.8643 18.4248 19.0048 18.9998 19.0048C19.5748 19.0048 19.9396 18.8643 20.1795 18.7048C20.4256 18.5411 20.6022 18.3156 20.7304 18.0599C20.8909 17.7397 20.9876 17.3691 20.9996 17.01C21.0121 16.5563 20.8032 16.0705 20.6265 15.6597L20.6119 15.6257Z",
                  fill: "#0F0F0F"
                },
                void 0,
                !1,
                {
                  fileName: "app/components/DashboardData.jsx",
                  lineNumber: 160,
                  columnNumber: 19
                },
                this
              ),
              /* @__PURE__ */ jsxDEV5(
                "path",
                {
                  d: "M14.1296 11.5308C14.8899 11.2847 15.4728 12.076 15.1153 12.7892C14.952 13.1151 14.7683 13.3924 14.4031 13.5214C13.426 13.8666 12.6166 14.3527 11.7715 14.8679L11.6874 14.9192C10.6044 15.5799 9.40516 16.3115 7.82074 16.5749C6.17735 16.8481 4.23604 16.6066 1.62884 15.5661C1.11608 15.3615 0.866688 14.7809 1.07181 14.2694C1.27694 13.7578 1.8589 13.509 2.37167 13.7137C4.76436 14.6685 6.32297 14.8012 7.49201 14.6069C8.67889 14.4096 9.58374 13.8634 10.7286 13.1654C11.8166 12.5021 12.9363 11.9171 14.1296 11.5308Z",
                  fill: "#0F0F0F"
                },
                void 0,
                !1,
                {
                  fileName: "app/components/DashboardData.jsx",
                  lineNumber: 166,
                  columnNumber: 19
                },
                this
              )
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 145,
            columnNumber: 17
          },
          this
        ),
        weatherData.list[0].main.humidity,
        "%"
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 144,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV5("p", { className: "flex flex-row gap-3 text-3xl items-center", children: [
        /* @__PURE__ */ jsxDEV5(
          "svg",
          {
            width: "20px",
            height: "20px",
            viewBox: "0 0 30 30",
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            "xmlns:sketch": "http://www.bohemiancoding.com/sketch/ns",
            children: [
              /* @__PURE__ */ jsxDEV5("title", { children: "wind-flag" }, void 0, !1, {
                fileName: "app/components/DashboardData.jsx",
                lineNumber: 183,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV5("desc", { children: "Created with Sketch Beta." }, void 0, !1, {
                fileName: "app/components/DashboardData.jsx",
                lineNumber: 184,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV5("defs", {}, void 0, !1, {
                fileName: "app/components/DashboardData.jsx",
                lineNumber: 185,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV5(
                "g",
                {
                  id: "Page-1",
                  stroke: "none",
                  "stroke-width": "1",
                  fill: "none",
                  "fill-rule": "evenodd",
                  "sketch:type": "MSPage",
                  children: /* @__PURE__ */ jsxDEV5(
                    "g",
                    {
                      id: "Icon-Set",
                      "sketch:type": "MSLayerGroup",
                      transform: "translate(-465.000000, -776.000000)",
                      fill: "#000000",
                      children: /* @__PURE__ */ jsxDEV5(
                        "path",
                        {
                          d: "M493,786.066 C493,786.877 492.935,787 492,787 L489,787.3 L489,779.7 L492,780 C492.935,780 493,780.123 493,780.934 L493,786.066 L493,786.066 Z M487,787.5 L481,788.1 L481,778.9 L487,779.5 L487,787.5 L487,787.5 Z M479,788.3 L472,789 C471.065,789 471,788.811 471,788 L471,779 C471,778.19 471.065,778 472,778 L479,778.7 L479,788.3 L479,788.3 Z M493,778 L471,776 C469.896,776 469,776.896 469,778 L469,789 C469,790.104 469.896,791 471,791 L493,789 C494.104,789 495,788.104 495,787 L495,780 C495,778.896 494.104,778 493,778 L493,778 Z M466,776 C465.447,776 465,776.448 465,777 L465,805 C465,805.553 465.447,806 466,806 C466.553,806 467,805.553 467,805 L467,777 C467,776.448 466.553,776 466,776 L466,776 Z",
                          id: "wind-flag",
                          "sketch:type": "MSShapeGroup"
                        },
                        void 0,
                        !1,
                        {
                          fileName: "app/components/DashboardData.jsx",
                          lineNumber: 200,
                          columnNumber: 23
                        },
                        this
                      )
                    },
                    void 0,
                    !1,
                    {
                      fileName: "app/components/DashboardData.jsx",
                      lineNumber: 194,
                      columnNumber: 21
                    },
                    this
                  )
                },
                void 0,
                !1,
                {
                  fileName: "app/components/DashboardData.jsx",
                  lineNumber: 186,
                  columnNumber: 19
                },
                this
              )
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 174,
            columnNumber: 17
          },
          this
        ),
        " ",
        weatherData.list[0].wind.speed,
        " m/s"
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 173,
        columnNumber: 15
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 110,
      columnNumber: 13
    }, this) : /* @__PURE__ */ jsxDEV5("p", { children: "No weather data available." }, void 0, !1, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 212,
      columnNumber: 13
    }, this) }, void 0, !1, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 108,
      columnNumber: 9
    }, this) : /* @__PURE__ */ jsxDEV5("p", { children: "Loading..." }, void 0, !1, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 216,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/DashboardData.jsx",
    lineNumber: 77,
    columnNumber: 5
  }, this);
}, DashboardData_default = DashboardData;

// app/routes/dashboard._index.jsx
import { jsxDEV as jsxDEV6 } from "react/jsx-dev-runtime";
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
  return /* @__PURE__ */ jsxDEV6("div", { className: "page", children: /* @__PURE__ */ jsxDEV6(DashboardData_default, {}, void 0, !1, {
    fileName: "app/routes/dashboard._index.jsx",
    lineNumber: 27,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/dashboard._index.jsx",
    lineNumber: 26,
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

// app/components/UserAvatar.jsx
import { jsxDEV as jsxDEV7 } from "react/jsx-dev-runtime";
function UserAvatar({ user }) {
  return /* @__PURE__ */ jsxDEV7("div", { className: "avatar", children: [
    /* @__PURE__ */ jsxDEV7("img", { src: user.image, alt: user.name }, void 0, !1, {
      fileName: "app/components/UserAvatar.jsx",
      lineNumber: 4,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV7("span", { children: [
      /* @__PURE__ */ jsxDEV7("h3", { children: user.name }, void 0, !1, {
        fileName: "app/components/UserAvatar.jsx",
        lineNumber: 6,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV7("p", { children: user.title }, void 0, !1, {
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
import { jsxDEV as jsxDEV8 } from "react/jsx-dev-runtime";
function PostCard({ post }) {
  return /* @__PURE__ */ jsxDEV8("article", { className: "post-card", children: [
    /* @__PURE__ */ jsxDEV8(UserAvatar, { user: post.user }, void 0, !1, {
      fileName: "app/components/PostCard.jsx",
      lineNumber: 6,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV8("img", { src: post.image, alt: post.caption }, void 0, !1, {
      fileName: "app/components/PostCard.jsx",
      lineNumber: 7,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV8("h3", { children: post.caption }, void 0, !1, {
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

// app/routes/posts.$postId.jsx
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
    /* @__PURE__ */ jsxDEV11("p", { children: [
      "Name: ",
      user.name,
      " \xA0",
      user.lastname
    ] }, void 0, !0, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 15,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV11("p", { children: [
      "Mail: ",
      user.mail
    ] }, void 0, !0, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 19,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV11("p", { children: [
      "Your sports: ",
      user.hobbies.join(", ")
    ] }, void 0, !0, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 20,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV11(Form4, { method: "post", children: /* @__PURE__ */ jsxDEV11("button", { children: "Logout" }, void 0, !1, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 22,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 21,
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
  let session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  ), error = session.get("sessionErrorKey");
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
      className: "bg-slate-200 flex flex-col justify-center items-center rounded-lg h-auto w-2/6 ml-auto mr-auto mt-32 p-4 gap-3",
      children: [
        /* @__PURE__ */ jsxDEV12("h1", { className: "text-2xl w-auto", children: "Sign In" }, void 0, !1, {
          fileName: "app/routes/signin.jsx",
          lineNumber: 35,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV12(
          Form5,
          {
            id: "sign-in-form",
            method: "post",
            className: "flex items-center flex-col gap-1 w-full",
            children: [
              /* @__PURE__ */ jsxDEV12("label", { htmlFor: "mail", children: "Email" }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 41,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV12(
                "input",
                {
                  id: "mail",
                  type: "email",
                  name: "mail",
                  "aria-label": "mail",
                  placeholder: "Type your email...",
                  required: !0,
                  className: "p-2 rounded-xl w-full"
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/signin.jsx",
                  lineNumber: 42,
                  columnNumber: 9
                },
                this
              ),
              /* @__PURE__ */ jsxDEV12("label", { htmlFor: "password", className: "", children: "Password" }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 52,
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
                  lineNumber: 55,
                  columnNumber: 9
                },
                this
              ),
              /* @__PURE__ */ jsxDEV12("div", { className: "bg-sky-500 text-white hover:bg-sky-600 transition-colors p-2 rounded-xl mt-2 w-32 flex justify-center", children: /* @__PURE__ */ jsxDEV12("button", { children: "Sign In" }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 65,
                columnNumber: 11
              }, this) }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 64,
                columnNumber: 9
              }, this),
              loaderData?.error ? /* @__PURE__ */ jsxDEV12("div", { className: "error-message", children: /* @__PURE__ */ jsxDEV12("p", { children: loaderData?.error?.message }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 70,
                columnNumber: 13
              }, this) }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 69,
                columnNumber: 11
              }, this) : null
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/routes/signin.jsx",
            lineNumber: 36,
            columnNumber: 7
          },
          this
        ),
        /* @__PURE__ */ jsxDEV12("p", { className: "flex", children: [
          "No account?",
          " ",
          /* @__PURE__ */ jsxDEV12(NavLink2, { to: "/signup", className: "text-sky-500", children: "Sign up here." }, void 0, !1, {
            fileName: "app/routes/signin.jsx",
            lineNumber: 76,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/signin.jsx",
          lineNumber: 74,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/routes/signin.jsx",
      lineNumber: 31,
      columnNumber: 5
    },
    this
  );
}
async function action5({ request }) {
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/dashboard",
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
import { useState as useState4, useRef, useEffect as useEffect2 } from "react";
import { jsxDEV as jsxDEV13 } from "react/jsx-dev-runtime";
async function loader10({ request }) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard"
  });
  let session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  ), error = session.get("sessionErrorKey");
  session.unset("sessionErrorKey");
  let headers = new Headers({
    "Set-Cookie": await sessionStorage.commitSession(session)
  });
  return json5({ error }, { headers });
}
function SignUp() {
  let loaderData = useLoaderData7(), [selectedHobbies, setSelectedHobbies] = useState4([]), [dropdownOpen, setDropdownOpen] = useState4(!1), dropdownRef = useRef(null), sportsOptions = ["Surf", "Ski", "Kite"], toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }, handleCheckboxChange = (event) => {
    let { value, checked } = event.target;
    setSelectedHobbies(
      (prev) => checked ? [...prev, value] : prev.filter((hobby) => hobby !== value)
    );
  };
  return useEffect2(() => {
    let handleClickOutside = (event) => {
      dropdownRef.current && !dropdownRef.current.contains(event.target) && setDropdownOpen(!1);
    };
    return document.addEventListener("mousedown", handleClickOutside), () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]), /* @__PURE__ */ jsxDEV13(
    "div",
    {
      id: "sign-up-page",
      className: "bg-slate-200 flex flex-col justify-center items-center rounded-lg h-auto w-2/6 ml-auto mr-auto mt-32 mb-32 p-4 gap-3",
      children: [
        /* @__PURE__ */ jsxDEV13("h1", { className: "text-2xl w-auto", children: "Sign Up" }, void 0, !1, {
          fileName: "app/routes/signup.jsx",
          lineNumber: 65,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV13(
          Form6,
          {
            id: "sign-up-form",
            method: "post",
            className: "flex items-center flex-col gap-1 w-full",
            children: [
              /* @__PURE__ */ jsxDEV13("label", { htmlFor: "mail", children: "Email" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 71,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV13(
                "input",
                {
                  id: "mail",
                  type: "email",
                  name: "mail",
                  "aria-label": "mail",
                  placeholder: "Type your email...",
                  required: !0,
                  autoComplete: "off",
                  className: "p-2 rounded-xl w-full"
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/signup.jsx",
                  lineNumber: 72,
                  columnNumber: 9
                },
                this
              ),
              /* @__PURE__ */ jsxDEV13("label", { htmlFor: "password", children: "Password" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 83,
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
                  lineNumber: 84,
                  columnNumber: 9
                },
                this
              ),
              /* @__PURE__ */ jsxDEV13("label", { htmlFor: "firstName", children: "First name" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 94,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV13(
                "input",
                {
                  id: "firstName",
                  type: "text",
                  name: "name",
                  "aria-label": "first name",
                  placeholder: "Type your first name..",
                  className: "p-2 rounded-xl w-full"
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/signup.jsx",
                  lineNumber: 95,
                  columnNumber: 9
                },
                this
              ),
              /* @__PURE__ */ jsxDEV13("label", { htmlFor: "lastName", children: "Last name" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 104,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV13(
                "input",
                {
                  id: "lastName",
                  type: "text",
                  name: "lastName",
                  "aria-label": "last name",
                  placeholder: "Type your last name...",
                  className: "p-2 rounded-xl w-full"
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/signup.jsx",
                  lineNumber: 105,
                  columnNumber: 9
                },
                this
              ),
              /* @__PURE__ */ jsxDEV13("label", { children: "Select your hobbies:" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 114,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV13("div", { className: "relative", ref: dropdownRef, children: [
                /* @__PURE__ */ jsxDEV13(
                  "button",
                  {
                    type: "button",
                    onClick: toggleDropdown,
                    className: "bg-white p-2 w-full rounded-xl border",
                    children: "Choose your hobbies"
                  },
                  void 0,
                  !1,
                  {
                    fileName: "app/routes/signup.jsx",
                    lineNumber: 116,
                    columnNumber: 11
                  },
                  this
                ),
                dropdownOpen && /* @__PURE__ */ jsxDEV13("div", { className: "absolute top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-10", children: sportsOptions.map((sport) => /* @__PURE__ */ jsxDEV13("label", { className: "block p-2", children: [
                  /* @__PURE__ */ jsxDEV13(
                    "input",
                    {
                      type: "checkbox",
                      value: sport,
                      checked: selectedHobbies.includes(sport),
                      onChange: handleCheckboxChange
                    },
                    void 0,
                    !1,
                    {
                      fileName: "app/routes/signup.jsx",
                      lineNumber: 127,
                      columnNumber: 19
                    },
                    this
                  ),
                  sport
                ] }, sport, !0, {
                  fileName: "app/routes/signup.jsx",
                  lineNumber: 126,
                  columnNumber: 17
                }, this)) }, void 0, !1, {
                  fileName: "app/routes/signup.jsx",
                  lineNumber: 124,
                  columnNumber: 13
                }, this)
              ] }, void 0, !0, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 115,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV13("div", { className: "mt-2", children: selectedHobbies.length > 0 && /* @__PURE__ */ jsxDEV13("div", { className: "p-2 bg-gray-100 border rounded-lg", children: [
                /* @__PURE__ */ jsxDEV13("strong", { children: "Selected Hobbies:" }, void 0, !1, {
                  fileName: "app/routes/signup.jsx",
                  lineNumber: 144,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV13("p", { children: selectedHobbies.join(", ") }, void 0, !1, {
                  fileName: "app/routes/signup.jsx",
                  lineNumber: 145,
                  columnNumber: 15
                }, this)
              ] }, void 0, !0, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 143,
                columnNumber: 13
              }, this) }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 141,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV13(
                "input",
                {
                  type: "hidden",
                  name: "selectedHobbies",
                  value: JSON.stringify(selectedHobbies)
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/signup.jsx",
                  lineNumber: 150,
                  columnNumber: 9
                },
                this
              ),
              /* @__PURE__ */ jsxDEV13("div", { className: "bg-sky-500 text-white hover:bg-sky-600 transition-colors p-2 rounded-xl mt-2 w-32 flex justify-center", children: /* @__PURE__ */ jsxDEV13("button", { children: "Sign Up" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 157,
                columnNumber: 11
              }, this) }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 156,
                columnNumber: 9
              }, this),
              loaderData?.error ? /* @__PURE__ */ jsxDEV13("div", { className: "error-message", children: /* @__PURE__ */ jsxDEV13("p", { children: loaderData?.error?.message }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 162,
                columnNumber: 13
              }, this) }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 161,
                columnNumber: 11
              }, this) : null
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/routes/signup.jsx",
            lineNumber: 66,
            columnNumber: 7
          },
          this
        ),
        /* @__PURE__ */ jsxDEV13("p", { children: [
          "Already have an account?",
          " ",
          /* @__PURE__ */ jsxDEV13(NavLink3, { to: "/signin", className: "text-sky-500", children: "Sign in here." }, void 0, !1, {
            fileName: "app/routes/signup.jsx",
            lineNumber: 168,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/signup.jsx",
          lineNumber: 166,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/routes/signup.jsx",
      lineNumber: 61,
      columnNumber: 5
    },
    this
  );
}
async function action6({ request }) {
  try {
    let formData = await request.formData(), newUser = Object.fromEntries(formData);
    return newUser.selectedHobbies = JSON.parse(newUser.selectedHobbies || "[]"), await mongoose9.models.User.create({
      mail: newUser.mail,
      password: newUser.password,
      name: newUser.name,
      lastname: newUser.lastName,
      // Capturing lastname here
      hobbies: newUser.selectedHobbies
      // Optional, based on schema
    }), redirect4("/signin");
  } catch (error) {
    return console.log(error), redirect4("/signup");
  }
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-KRQQFHVH.js", imports: ["/build/_shared/chunk-ZWGWGGVF.js", "/build/_shared/chunk-32OR2PNH.js", "/build/_shared/chunk-GIAAE3CH.js", "/build/_shared/chunk-XU7DNSPJ.js", "/build/_shared/chunk-HKPYBBGK.js", "/build/_shared/chunk-UWV35TSL.js", "/build/_shared/chunk-BOXFZXVX.js", "/build/_shared/chunk-PNG5AS42.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-BMH6GVAU.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-LUY5FOFR.js", imports: ["/build/_shared/chunk-SARLQUTN.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/add-post": { id: "routes/add-post", parentId: "root", path: "add-post", index: void 0, caseSensitive: void 0, module: "/build/routes/add-post-GNYKHBRQ.js", imports: ["/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-SARLQUTN.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/dashboard._index": { id: "routes/dashboard._index", parentId: "root", path: "dashboard", index: !0, caseSensitive: void 0, module: "/build/routes/dashboard._index-VDZETHUH.js", imports: ["/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-SARLQUTN.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId": { id: "routes/posts.$postId", parentId: "root", path: "posts/:postId", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId-P4OWWNBM.js", imports: ["/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-SARLQUTN.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId.destroy": { id: "routes/posts.$postId.destroy", parentId: "routes/posts.$postId", path: "destroy", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId.destroy-QJD7CVP4.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId_.update": { id: "routes/posts.$postId_.update", parentId: "root", path: "posts/:postId/update", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId_.update-3CAWCYFU.js", imports: ["/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-SARLQUTN.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/profile": { id: "routes/profile", parentId: "root", path: "profile", index: void 0, caseSensitive: void 0, module: "/build/routes/profile-74ODSTTQ.js", imports: ["/build/_shared/chunk-SARLQUTN.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/signin": { id: "routes/signin", parentId: "root", path: "signin", index: void 0, caseSensitive: void 0, module: "/build/routes/signin-PS2JHSBM.js", imports: ["/build/_shared/chunk-QUYRSHBJ.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-SARLQUTN.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/signup": { id: "routes/signup", parentId: "root", path: "signup", index: void 0, caseSensitive: void 0, module: "/build/routes/signup-YEE5XVQT.js", imports: ["/build/_shared/chunk-QUYRSHBJ.js", "/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-SARLQUTN.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/users._index": { id: "routes/users._index", parentId: "root", path: "users", index: !0, caseSensitive: void 0, module: "/build/routes/users._index-6AIM527Q.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "7c8e85fa", hmr: { runtime: "/build/_shared/chunk-HKPYBBGK.js", timestamp: 1730718144838 }, url: "/build/manifest-7C8E85FA.js" };

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
