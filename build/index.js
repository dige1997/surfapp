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
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";

// app/db/db-connect.server.js
import mongoose3 from "mongoose";

// app/db/models.js
import mongoose2 from "mongoose";
import bcrypt2 from "bcrypt";

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
import bcrypt from "bcrypt";
import mongoose from "mongoose";
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
  let user = await mongoose.models.User.findOne({ mail }).select("+password");
  if (!user)
    throw new AuthorizationError("No user found with this email.");
  if (!await bcrypt.compare(password, user.password))
    throw new AuthorizationError("Invalid password.");
  return user.password = void 0, user;
}
async function hashPassword(password) {
  let salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// app/db/models.js
var userSchema = new mongoose2.Schema(
  {
    name: {
      type: String,
      required: !0
    },
    mail: {
      type: String,
      required: !0,
      unique: !0
    },
    password: {
      type: String,
      required: !0,
      select: !1
    },
    eventsCreated: [
      {
        type: mongoose2.Schema.Types.ObjectId,
        ref: "Event"
      }
    ],
    eventsAttending: [
      {
        type: mongoose2.Schema.Types.ObjectId,
        ref: "Event"
      }
    ],
    following: [
      {
        type: mongoose2.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    followers: [
      {
        type: mongoose2.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: !0 }
);
userSchema.methods.follow = async function(userId) {
  if (!this.following.includes(userId)) {
    this.following.push(userId), await this.save();
    let userToFollow = await User.findById(userId);
    userToFollow && !userToFollow.followers.includes(this._id) && (userToFollow.followers.push(this._id), await userToFollow.save());
  }
};
userSchema.methods.unfollow = async function(userId) {
  if (this.following.includes(userId)) {
    this.following.pull(userId), await this.save();
    let userToUnfollow = await User.findById(userId);
    userToUnfollow && userToUnfollow.followers.includes(this._id) && (userToUnfollow.followers.pull(this._id), await userToUnfollow.save());
  }
};
var User = mongoose2.model("User", userSchema);
mongoose2.model("User", userSchema);
var eventSchema = new mongoose2.Schema(
  {
    date: {
      type: Date,
      required: !0
    },
    title: {
      type: String,
      required: !0
    },
    description: {
      type: String,
      required: !0
    },
    location: {
      type: String,
      required: !0
    },
    creator: {
      required: !0,
      type: mongoose2.Schema.Types.ObjectId,
      ref: "User"
    },
    image: {
      type: String,
      required: !0
    },
    attendees: [
      {
        type: mongoose2.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: !0 }
);
eventSchema.index({ title: "text", description: "text" });
mongoose2.model("Event", eventSchema);
userSchema.pre("save", async function(next) {
  let user = this;
  if (!user.isModified("password"))
    return next();
  let salt = await bcrypt2.genSalt(10);
  user.password = await bcrypt2.hash(user.password, salt), user.name = user.name.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "), next();
});
eventSchema.pre("save", async function(next) {
  let event = this;
  event.title = event.title.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  let creator = await User.findById(event.creator);
  creator.eventsCreated.includes(event._id) || (creator.eventsCreated.push(event._id), await creator.save()), next();
});
var models = [
  { name: "User", schema: userSchema, collection: "users" },
  { name: "Event", schema: eventSchema, collection: "event" }
];
async function initData() {
  let userCount = await mongoose2.models.User.countDocuments(), eventCount = await mongoose2.models.Event.countDocuments();
  (userCount === 0 || eventCount === 0) && await insertData();
}
async function insertData() {
  let User2 = mongoose2.models.User, Event2 = mongoose2.models.Event;
  console.log("Dropping collections..."), console.log("Inserting data...");
  let test = await User2.create({
    mail: "test@test.dk",
    name: "Tester test",
    eventsCreated: [],
    eventsAttending: [],
    password: await hashPassword("1234"),
    followers: [test2._id],
    following: [test2._id]
  });
  console.log(test);
  let test2 = await User2.create({
    mail: "test2@test2.dk",
    name: "Tester test",
    eventsCreated: [],
    eventsAttending: [],
    password: await hashPassword("1234")
  }), event1 = await Event2.create({
    date: /* @__PURE__ */ new Date(),
    title: "Event 1",
    description: "Description 1",
    location: "55.676098, 12.568337",
    creator: test._id,
    image: "https://source.unsplash.com/random",
    attendees: [test._id]
  }), event2 = await Event2.create({
    date: /* @__PURE__ */ new Date(),
    title: "Event 2",
    description: "Description 2",
    location: "55.676098, 12.568337",
    creator: test._id,
    image: "https://source.unsplash.com/random",
    attendees: [test._id]
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
  NODE_ENV === "development" && (mongoose3.set("overwriteModels", !0), Object.keys(mongoose3.models).length > 0 && (modelCreationType = "Overwriting")), console.log(
    // E.g. "Mongoose: Creating 2 models (Book, Author)"
    "Mongoose: %s %d %s (%s)",
    modelCreationType,
    models.length,
    models.length === 1 ? "model" : "models",
    models.map((model) => model.name).join(", ")
  );
  for (let model of models)
    mongoose3.model(model.name, model.schema, model.collection);
  let readyState = mongoose3.connection.readyState;
  if (readyState > 0) {
    console.log(
      "Mongoose: Re-using existing connection (readyState: %d)",
      readyState
    );
    return;
  }
  mongoose3.connection.on("error", (error) => {
    console.error("Mongoose: error %s", error);
  });
  for (let event of ["connected", "reconnected", "disconnected", "close"])
    mongoose3.connection.on(event, () => console.log("Mongoose: %s", event));
  mongoose3.connect(MONGODB_URL).catch((error) => {
    console.error(error);
  });
}

// app/entry.server.jsx
import { jsxDEV } from "react/jsx-dev-runtime";
connectDb();
await initData();
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return isbot(request.headers.get("user-agent")) ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsxDEV(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "app/entry.server.jsx",
          lineNumber: 50,
          columnNumber: 7
        },
        this
      ),
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
      /* @__PURE__ */ jsxDEV(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "app/entry.server.jsx",
          lineNumber: 93,
          columnNumber: 7
        },
        this
      ),
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
var tailwind_default = "/build/_assets/tailwind-LAF677LQ.css";

// app/components/Nav.jsx
import { useState, useEffect, useRef } from "react";
import { NavLink } from "@remix-run/react";
import { jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";
function Nav({ user }) {
  let [isMobileMenuOpen, setIsMobileMenuOpen] = useState(!1), mobileMenuRef = useRef(null), toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  useEffect(() => {
    let handleClickOutside = (event) => {
      mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && setIsMobileMenuOpen(!1);
    };
    return document.addEventListener("mousedown", handleClickOutside), () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  let handleLinkClick = () => {
    setIsMobileMenuOpen(!1);
  }, closeMobileMenu = (event) => {
    event.stopPropagation(), setIsMobileMenuOpen(!1);
  };
  return /* @__PURE__ */ jsxDEV2("div", { className: "min-h-full", children: [
    /* @__PURE__ */ jsxDEV2("nav", { className: "bg-gray-800", children: /* @__PURE__ */ jsxDEV2("div", { className: "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxDEV2("div", { className: "flex w-full h-16 items-center ", children: [
      /* @__PURE__ */ jsxDEV2("div", { className: "flex w-full items-center", children: /* @__PURE__ */ jsxDEV2("div", { className: "flex w-full justify-between", children: [
        /* @__PURE__ */ jsxDEV2("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxDEV2("div", { className: "ml-10 flex items-baseline space-x-4", children: [
          /* @__PURE__ */ jsxDEV2("div", { className: "shrink-0" }, void 0, !1, {
            fileName: "app/components/Nav.jsx",
            lineNumber: 48,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV2(
            NavLink,
            {
              to: "/dashboard",
              className: ({ isActive }) => `text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-gray-900 text-white" : ""}`,
              onClick: handleLinkClick,
              children: "Dashboard"
            },
            void 0,
            !1,
            {
              fileName: "app/components/Nav.jsx",
              lineNumber: 49,
              columnNumber: 21
            },
            this
          ),
          /* @__PURE__ */ jsxDEV2(
            NavLink,
            {
              to: "/add-event",
              className: ({ isActive }) => `text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-gray-900 text-white" : ""}`,
              onClick: handleLinkClick,
              children: "Add Post"
            },
            void 0,
            !1,
            {
              fileName: "app/components/Nav.jsx",
              lineNumber: 60,
              columnNumber: 21
            },
            this
          ),
          /* @__PURE__ */ jsxDEV2(
            NavLink,
            {
              to: "/locations",
              className: ({ isActive }) => `text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-gray-900 text-white" : ""}`,
              onClick: handleLinkClick,
              children: "See spots"
            },
            void 0,
            !1,
            {
              fileName: "app/components/Nav.jsx",
              lineNumber: 71,
              columnNumber: 21
            },
            this
          ),
          /* @__PURE__ */ jsxDEV2(
            NavLink,
            {
              to: "/event",
              className: ({ isActive }) => `text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-gray-900 text-white" : ""}`,
              onClick: handleLinkClick,
              children: "All posts"
            },
            void 0,
            !1,
            {
              fileName: "app/components/Nav.jsx",
              lineNumber: 82,
              columnNumber: 21
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/components/Nav.jsx",
          lineNumber: 47,
          columnNumber: 19
        }, this) }, void 0, !1, {
          fileName: "app/components/Nav.jsx",
          lineNumber: 46,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV2("div", { className: " items-center hidden md:flex", children: /* @__PURE__ */ jsxDEV2(
          NavLink,
          {
            to: `/profile/${user?._id}`,
            className: ({ isActive }) => `text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-gray-900 text-white" : ""}`,
            onClick: handleLinkClick,
            children: "Profile"
          },
          void 0,
          !1,
          {
            fileName: "app/components/Nav.jsx",
            lineNumber: 96,
            columnNumber: 19
          },
          this
        ) }, void 0, !1, {
          fileName: "app/components/Nav.jsx",
          lineNumber: 95,
          columnNumber: 17
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/Nav.jsx",
        lineNumber: 45,
        columnNumber: 15
      }, this) }, void 0, !1, {
        fileName: "app/components/Nav.jsx",
        lineNumber: 44,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV2("div", { className: "-mr-2 flex md:hidden", children: /* @__PURE__ */ jsxDEV2(
        "button",
        {
          onClick: toggleMobileMenu,
          className: "inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800",
          children: [
            /* @__PURE__ */ jsxDEV2("span", { className: "sr-only", children: "Open main menu" }, void 0, !1, {
              fileName: "app/components/Nav.jsx",
              lineNumber: 117,
              columnNumber: 17
            }, this),
            isMobileMenuOpen ? /* @__PURE__ */ jsxDEV2(
              "span",
              {
                className: "block",
                onClick: closeMobileMenu,
                children: "\u2716"
              },
              void 0,
              !1,
              {
                fileName: "app/components/Nav.jsx",
                lineNumber: 121,
                columnNumber: 19
              },
              this
            ) : /* @__PURE__ */ jsxDEV2("span", { className: "block", children: "\u2630" }, void 0, !1, {
              fileName: "app/components/Nav.jsx",
              lineNumber: 119,
              columnNumber: 19
            }, this)
          ]
        },
        void 0,
        !0,
        {
          fileName: "app/components/Nav.jsx",
          lineNumber: 113,
          columnNumber: 15
        },
        this
      ) }, void 0, !1, {
        fileName: "app/components/Nav.jsx",
        lineNumber: 112,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/Nav.jsx",
      lineNumber: 43,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/components/Nav.jsx",
      lineNumber: 42,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/components/Nav.jsx",
      lineNumber: 41,
      columnNumber: 7
    }, this),
    isMobileMenuOpen && /* @__PURE__ */ jsxDEV2(
      "div",
      {
        ref: mobileMenuRef,
        className: "md:hidden bg-gray-800 px-2 pt-2 pb-3 space-y-1 sm:px-3",
        children: [
          /* @__PURE__ */ jsxDEV2(
            NavLink,
            {
              to: "/dashboard",
              className: ({ isActive }) => `text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium ${isActive ? "bg-gray-900 text-white" : ""}`,
              onClick: handleLinkClick,
              children: "Dashboard"
            },
            void 0,
            !1,
            {
              fileName: "app/components/Nav.jsx",
              lineNumber: 140,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ jsxDEV2(
            NavLink,
            {
              to: "/add-post",
              className: ({ isActive }) => `text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium ${isActive ? "bg-gray-900 text-white" : ""}`,
              onClick: handleLinkClick,
              children: "Add Post"
            },
            void 0,
            !1,
            {
              fileName: "app/components/Nav.jsx",
              lineNumber: 151,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ jsxDEV2(
            NavLink,
            {
              to: "/locations",
              className: ({ isActive }) => `text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium ${isActive ? "bg-gray-900 text-white" : ""}`,
              onClick: handleLinkClick,
              children: "See spots"
            },
            void 0,
            !1,
            {
              fileName: "app/components/Nav.jsx",
              lineNumber: 162,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ jsxDEV2(
            NavLink,
            {
              to: `/profile/${user?._id}`,
              className: ({ isActive }) => `text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium ${isActive ? "bg-gray-900 text-white" : ""}`,
              onClick: handleLinkClick,
              children: "Profile"
            },
            void 0,
            !1,
            {
              fileName: "app/components/Nav.jsx",
              lineNumber: 173,
              columnNumber: 11
            },
            this
          )
        ]
      },
      void 0,
      !0,
      {
        fileName: "app/components/Nav.jsx",
        lineNumber: 136,
        columnNumber: 9
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/components/Nav.jsx",
    lineNumber: 40,
    columnNumber: 5
  }, this);
}

// app/components/NavAll.jsx
import { NavLink as NavLink2 } from "@remix-run/react";
import { jsxDEV as jsxDEV3 } from "react/jsx-dev-runtime";
function Nav2() {
  return /* @__PURE__ */ jsxDEV3("nav", { className: "flex bg-slate-50 shadow-2xl justify-between md:justify-items-end items-center z-50", children: [
    /* @__PURE__ */ jsxDEV3(NavLink2, { to: authenticator ? "/dashboard" : "/main-dashboard", children: /* @__PURE__ */ jsxDEV3("h1", { className: "font-mono text-2xl font-bold m-auto p-2 mx-2", children: "Elevation" }, void 0, !1, {
      fileName: "app/components/NavAll.jsx",
      lineNumber: 14,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/components/NavAll.jsx",
      lineNumber: 13,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV3("div", { className: "flex ml-auto p-2 font-semibold mr-4", children: [
      /* @__PURE__ */ jsxDEV3(
        NavLink2,
        {
          to: "/signup",
          className: "mx-2 bg-secondary hover:bg-primary rounded-xl p-2 ",
          children: "Sign Up"
        },
        void 0,
        !1,
        {
          fileName: "app/components/NavAll.jsx",
          lineNumber: 19,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV3(
        NavLink2,
        {
          to: "/signin",
          className: "mx-2 bg-slate-300 hover:bg-slate-400 rounded-xl p-2",
          children: "Login"
        },
        void 0,
        !1,
        {
          fileName: "app/components/NavAll.jsx",
          lineNumber: 25,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/components/NavAll.jsx",
      lineNumber: 18,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/NavAll.jsx",
    lineNumber: 12,
    columnNumber: 5
  }, this);
}

// app/components/footer.jsx
import { jsxDEV as jsxDEV4 } from "react/jsx-dev-runtime";
function Footer() {
  return /* @__PURE__ */ jsxDEV4("footer", { className: "bg-gray-100 text-white p-4 mt-6 flex flex-col justify-center items-center", children: [
    /* @__PURE__ */ jsxDEV4("p", { children: "\xA9 2024 Evelation - Nicolai Dige" }, void 0, !1, {
      fileName: "app/components/footer.jsx",
      lineNumber: 4,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV4("p", { children: "Your Gateway to Outdoor Thrills " }, void 0, !1, {
      fileName: "app/components/footer.jsx",
      lineNumber: 5,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/footer.jsx",
    lineNumber: 3,
    columnNumber: 5
  }, this);
}

// app/root.jsx
import { jsxDEV as jsxDEV5 } from "react/jsx-dev-runtime";
function links() {
  return [{ rel: "stylesheet", href: tailwind_default }];
}
async function loader({ request }) {
  return await authenticator.isAuthenticated(request);
}
function App() {
  let user = useLoaderData();
  return /* @__PURE__ */ jsxDEV5(
    "html",
    {
      lang: "en",
      className: "bg-gradient-to-t from-blue-50 to-cyan-200 bg-cover bg-no-repeat min-h-screen",
      children: [
        /* @__PURE__ */ jsxDEV5("head", { children: [
          /* @__PURE__ */ jsxDEV5("meta", { charSet: "utf-8" }, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 31,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV5("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 32,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV5(Meta, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 33,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV5(Links, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 34,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/root.jsx",
          lineNumber: 30,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV5("body", { className: "", children: [
          user ? /* @__PURE__ */ jsxDEV5(Nav, { user }, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 37,
            columnNumber: 17
          }, this) : /* @__PURE__ */ jsxDEV5(Nav2, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 37,
            columnNumber: 39
          }, this),
          /* @__PURE__ */ jsxDEV5(Outlet, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 39,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV5(ScrollRestoration, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 40,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV5(Scripts, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 41,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV5(LiveReload, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 42,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV5(Footer, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 43,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/root.jsx",
          lineNumber: 36,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/root.jsx",
      lineNumber: 26,
      columnNumber: 5
    },
    this
  );
}

// app/routes/profile.$userId_.update.jsx
var profile_userId_update_exports = {};
__export(profile_userId_update_exports, {
  action: () => action,
  default: () => UpdateProfile,
  loader: () => loader2,
  meta: () => meta
});
import mongoose4 from "mongoose";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData as useLoaderData2, useNavigate } from "@remix-run/react";
import { jsxDEV as jsxDEV6 } from "react/jsx-dev-runtime";
function meta() {
  return [
    {
      title: "Trailblaze - Update event"
    }
  ];
}
async function loader2({ request, params }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
  let user = await mongoose4.models.User.findById(params.userId), userUpdated = await mongoose4.models.User.findOneAndUpdate(
    user._id
  ).select("+password");
  return json({ user, userUpdated });
}
function UpdateProfile() {
  let { user } = useLoaderData2(), navigate = useNavigate();
  function handleCancel() {
    navigate(-1);
  }
  return /* @__PURE__ */ jsxDEV6("div", { className: "w-full flex-col gap-y-4 justify-center mt-4 mb-4 p-8", children: [
    /* @__PURE__ */ jsxDEV6("h1", { className: "m-auto flex justify-center font-semibold text-2xl mb-6", children: "Update Profile" }, void 0, !1, {
      fileName: "app/routes/profile.$userId_.update.jsx",
      lineNumber: 35,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV6(
      Form,
      {
        method: "post",
        className: "rounded-lg font-semibold max-w-lg justify-center m-auto flex flex-col gap-y-4 p-4",
        children: [
          /* @__PURE__ */ jsxDEV6("label", { htmlFor: "name", children: " Name" }, void 0, !1, {
            fileName: "app/routes/profile.$userId_.update.jsx",
            lineNumber: 43,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV6(
            "input",
            {
              type: "text",
              id: "name",
              name: "name",
              placeholder: "Name",
              defaultValue: user.name,
              className: "rounded-xl p-2  border-gray-400 border"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/profile.$userId_.update.jsx",
              lineNumber: 44,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV6("label", { htmlFor: "mail", children: "Mail" }, void 0, !1, {
            fileName: "app/routes/profile.$userId_.update.jsx",
            lineNumber: 52,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV6(
            "input",
            {
              type: "text",
              id: "mail",
              name: "mail",
              placeholder: "Mail",
              defaultValue: user.mail,
              className: "rounded-xl p-2  border-gray-400 border"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/profile.$userId_.update.jsx",
              lineNumber: 53,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV6("label", { htmlFor: "password", children: "New Password" }, void 0, !1, {
            fileName: "app/routes/profile.$userId_.update.jsx",
            lineNumber: 61,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV6(
            "input",
            {
              type: "password",
              id: "password",
              name: "password",
              placeholder: "New Password",
              className: "rounded-xl p-2  border-gray-400 border"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/profile.$userId_.update.jsx",
              lineNumber: 62,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV6("button", { className: "bg-accent hover:bg-primary hover:text-background p-2 rounded-lg mt-4", children: "Update" }, void 0, !1, {
            fileName: "app/routes/profile.$userId_.update.jsx",
            lineNumber: 70,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV6(
            "button",
            {
              type: "button",
              className: "btn-cancel text-cancel",
              onClick: handleCancel,
              children: "cancel"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/profile.$userId_.update.jsx",
              lineNumber: 73,
              columnNumber: 9
            },
            this
          )
        ]
      },
      void 0,
      !0,
      {
        fileName: "app/routes/profile.$userId_.update.jsx",
        lineNumber: 39,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/routes/profile.$userId_.update.jsx",
    lineNumber: 34,
    columnNumber: 5
  }, this);
}
async function action({ request }) {
  let authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), formData = new URLSearchParams(await request.text()), name = formData.get("name"), mail = formData.get("mail"), password = formData.get("password");
  try {
    let userToUpdate = await mongoose4.models.User.findOne({
      _id: authUser._id
    });
    if (!userToUpdate)
      return console.error("User not found"), redirect("/error-page");
    if (mail !== userToUpdate.mail && await mongoose4.models.User.findOne({ mail }))
      return console.error("Email already in use"), redirect("/error-page");
    userToUpdate.name = name, userToUpdate.mail = mail, password && (userToUpdate.password = await hashPassword(password));
    let updatedUser = await userToUpdate.save();
    if (updatedUser)
      return redirect(`/profile/${updatedUser._id}`);
  } catch (error) {
    return console.error("Error updating user:", error), redirect("/error-page");
  }
}

// app/routes/event.$eventId.destroy.jsx
var event_eventId_destroy_exports = {};
__export(event_eventId_destroy_exports, {
  action: () => action2,
  loader: () => loader3
});
import mongoose5 from "mongoose";
async function loader3({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
}
async function action2({ request, params }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), await mongoose5.models.Event.findByIdAndDelete(params.eventId), new Response(null, {
    status: 302,
    headers: {
      location: "/event"
    }
  });
}

// app/routes/event.$eventId_.update.jsx
var event_eventId_update_exports = {};
__export(event_eventId_update_exports, {
  action: () => action3,
  default: () => UpdateEvent,
  loader: () => loader4
});
import { useEffect as useEffect2, useRef as useRef2, useState as useState2 } from "react";
import { useLoaderData as useLoaderData3, useNavigate as useNavigate2 } from "@remix-run/react";
import { Form as Form2 } from "@remix-run/react";
import { GoogleMap } from "@react-google-maps/api";
import mongoose6 from "mongoose";
import { json as json2, redirect as redirect2 } from "@remix-run/node";

// app/components/GoogleMapLoader.jsx
import { useJsApiLoader } from "@react-google-maps/api";
import { jsxDEV as jsxDEV7 } from "react/jsx-dev-runtime";
var GOOGLE_MAPS_API_KEY = "AIzaSyAJRJzkSO54nHodtQJF-xAPcEwL5q7_NHA";
function GoogleMapLoader({ children }) {
  let { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });
  return loadError ? /* @__PURE__ */ jsxDEV7("div", { children: "Error loading Google Maps" }, void 0, !1, {
    fileName: "app/components/GoogleMapLoader.jsx",
    lineNumber: 11,
    columnNumber: 12
  }, this) : isLoaded ? children : /* @__PURE__ */ jsxDEV7("div", { children: "Loading Google Maps..." }, void 0, !1, {
    fileName: "app/components/GoogleMapLoader.jsx",
    lineNumber: 15,
    columnNumber: 12
  }, this);
}

// app/routes/event.$eventId_.update.jsx
import { jsxDEV as jsxDEV8 } from "react/jsx-dev-runtime";
var MAP_ID = "71f267d426ae7773";
async function loader4({ request, params }) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), event = await mongoose6.models.Event.findById(params.eventId).populate(
    "creator"
  );
  if (!event)
    throw new Response("Event not found", { status: 404 });
  return event.creator._id.toString() !== user._id.toString() ? redirect2("/dashboard") : json2({ event });
}
function UpdateEvent() {
  let { event } = useLoaderData3(), [image, setImage] = useState2(event.image), [location, setLocation] = useState2(
    event.location ? Array.isArray(event.location) ? event.location : event.location.split(",").map((coord) => parseFloat(coord.trim())) : null
  ), [center, setCenter] = useState2(
    location ? { lat: location[0], lng: location[1] } : { lat: 41.0082, lng: 28.9784 }
  ), mapRef = useRef2(null), markerRef = useRef2(null), navigate = useNavigate2(), handleMapClick = (e) => {
    let lat = e.latLng.lat(), lng = e.latLng.lng();
    typeof lat == "number" && typeof lng == "number" ? (setLocation([lat, lng]), setCenter({ lat, lng })) : console.error("Invalid coordinates:", lat, lng);
  }, handleCancel = () => navigate("/dashboard");
  useEffect2(() => {
    if (location && mapRef.current) {
      let [lat, lng] = location;
      typeof lat == "number" && typeof lng == "number" ? mapRef.current.panTo({ lat, lng }) : console.error("Invalid location:", location);
    }
  }, [location]), useEffect2(() => {
    mapRef.current && (markerRef.current ? markerRef.current.setPosition(center) : markerRef.current = new google.maps.Marker({
      map: mapRef.current,
      position: center,
      title: "Selected Location"
    }));
  }, [center]);
  let parsedLocation = location ? { lat: location[0], lng: location[1] } : { lat: 41.0082, lng: 28.9784 };
  return /* @__PURE__ */ jsxDEV8("div", { className: "page w-full flex-col gap-y-4 justify-center mt-4 mb-4 p-8", children: [
    /* @__PURE__ */ jsxDEV8("h1", { className: "m-auto flex justify-center font-semibold text-2xl mb-6", children: "Update Event" }, void 0, !1, {
      fileName: "app/routes/event.$eventId_.update.jsx",
      lineNumber: 99,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV8(
      Form2,
      {
        id: "event-form",
        method: "post",
        className: "rounded-lg font-semibold max-w-lg justify-center m-auto flex flex-col gap-y-4 p-4",
        children: [
          /* @__PURE__ */ jsxDEV8("label", { htmlFor: "title", children: "Post Title" }, void 0, !1, {
            fileName: "app/routes/event.$eventId_.update.jsx",
            lineNumber: 107,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV8(
            "input",
            {
              required: !0,
              id: "title",
              name: "title",
              type: "text",
              defaultValue: event.title,
              placeholder: "Write a title...",
              className: "rounded-xl p-2 border-gray-400 border"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/event.$eventId_.update.jsx",
              lineNumber: 108,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV8("label", { htmlFor: "description", children: "Description" }, void 0, !1, {
            fileName: "app/routes/event.$eventId_.update.jsx",
            lineNumber: 118,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV8(
            "textarea",
            {
              required: !0,
              id: "description",
              name: "description",
              defaultValue: event.description,
              placeholder: "Write a description...",
              className: "rounded-xl p-2 border-gray-400 border"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/event.$eventId_.update.jsx",
              lineNumber: 119,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV8("label", { htmlFor: "date", children: "Date" }, void 0, !1, {
            fileName: "app/routes/event.$eventId_.update.jsx",
            lineNumber: 128,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV8(
            "input",
            {
              required: !0,
              id: "date",
              name: "date",
              type: "date",
              defaultValue: event.date.split("T")[0],
              className: "rounded-xl p-2 border-gray-400 border"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/event.$eventId_.update.jsx",
              lineNumber: 129,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV8("label", { htmlFor: "location", children: "Location" }, void 0, !1, {
            fileName: "app/routes/event.$eventId_.update.jsx",
            lineNumber: 138,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV8(
            "input",
            {
              id: "location",
              name: "location",
              type: "text",
              readOnly: !0,
              placeholder: "Click on the map to select a location",
              value: location ? location.join(", ") : "",
              className: "rounded-xl p-2 border-gray-400 border"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/event.$eventId_.update.jsx",
              lineNumber: 139,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV8(GoogleMapLoader, { children: /* @__PURE__ */ jsxDEV8(
            GoogleMap,
            {
              mapContainerStyle: { width: "100%", height: "400px" },
              center: parsedLocation,
              zoom: 12,
              onClick: handleMapClick,
              onLoad: (map) => {
                mapRef.current = map, map.setOptions({
                  mapId: MAP_ID
                });
              }
            },
            void 0,
            !1,
            {
              fileName: "app/routes/event.$eventId_.update.jsx",
              lineNumber: 150,
              columnNumber: 11
            },
            this
          ) }, void 0, !1, {
            fileName: "app/routes/event.$eventId_.update.jsx",
            lineNumber: 149,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV8("label", { htmlFor: "image", children: "Image URL" }, void 0, !1, {
            fileName: "app/routes/event.$eventId_.update.jsx",
            lineNumber: 166,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV8(
            "input",
            {
              required: !0,
              id: "image",
              name: "image",
              type: "url",
              defaultValue: event.image,
              placeholder: "Paste an image URL...",
              onChange: (e) => setImage(e.target.value),
              className: "rounded-xl p-2 border-gray-400 border"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/event.$eventId_.update.jsx",
              lineNumber: 167,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV8("label", { htmlFor: "image-preview", children: "Image Preview" }, void 0, !1, {
            fileName: "app/routes/event.$eventId_.update.jsx",
            lineNumber: 178,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV8(
            "img",
            {
              id: "image-preview",
              src: image,
              alt: "Preview",
              className: "image-preview m-auto rounded-xl"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/event.$eventId_.update.jsx",
              lineNumber: 179,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV8("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxDEV8(
              "button",
              {
                type: "submit",
                className: "bg-accent hover:bg-primary hover:text-background p-2 rounded-lg",
                children: "Save"
              },
              void 0,
              !1,
              {
                fileName: "app/routes/event.$eventId_.update.jsx",
                lineNumber: 187,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV8(
              "button",
              {
                type: "button",
                className: "text-cancel p-2 rounded-lg",
                onClick: handleCancel,
                children: "Cancel"
              },
              void 0,
              !1,
              {
                fileName: "app/routes/event.$eventId_.update.jsx",
                lineNumber: 193,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/routes/event.$eventId_.update.jsx",
            lineNumber: 186,
            columnNumber: 9
          }, this)
        ]
      },
      void 0,
      !0,
      {
        fileName: "app/routes/event.$eventId_.update.jsx",
        lineNumber: 102,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/routes/event.$eventId_.update.jsx",
    lineNumber: 98,
    columnNumber: 5
  }, this);
}
async function action3({ request, params }) {
  let authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), eventToUpdate = await mongoose6.models.Event.findById(params.eventId);
  if (!eventToUpdate || eventToUpdate.creator.toString() !== authUser._id.toString())
    return redirect2("/dashboard");
  let formData = await request.formData(), updatedEvent = Object.fromEntries(formData);
  return Object.assign(eventToUpdate, updatedEvent), eventToUpdate.location = updatedEvent.location, await eventToUpdate.save(), redirect2(`/event/${params.eventId}`);
}

// app/routes/posts.$postId.destroy.jsx
var posts_postId_destroy_exports = {};
__export(posts_postId_destroy_exports, {
  action: () => action4,
  loader: () => loader5
});
import { redirect as redirect3 } from "@remix-run/node";
import mongoose7 from "mongoose";
async function loader5({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
}
async function action4({ request, params }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), await mongoose7.models.Post.findByIdAndDelete(params.postId), redirect3("/posts");
}

// app/routes/posts.$postId_.update.jsx
var posts_postId_update_exports = {};
__export(posts_postId_update_exports, {
  action: () => action5,
  default: () => UpdatePost,
  loader: () => loader6,
  meta: () => meta2
});
import { json as json3, redirect as redirect4 } from "@remix-run/node";
import { Form as Form3, useLoaderData as useLoaderData4, useNavigate as useNavigate3 } from "@remix-run/react";
import mongoose8 from "mongoose";
import { useState as useState3 } from "react";
import { jsxDEV as jsxDEV9 } from "react/jsx-dev-runtime";
function meta2() {
  return [
    {
      title: "Remix Post App - Update"
    }
  ];
}
async function loader6({ request, params }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
  let post = await mongoose8.models.Post.findById(params.postId).populate("user");
  return json3({ post });
}
function UpdatePost() {
  let { post } = useLoaderData4(), [image, setImage] = useState3(post.image), navigate = useNavigate3();
  function handleCancel() {
    navigate(-1);
  }
  return /* @__PURE__ */ jsxDEV9("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV9("h1", { children: "Update Post" }, void 0, !1, {
      fileName: "app/routes/posts.$postId_.update.jsx",
      lineNumber: 35,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV9(Form3, { id: "post-form", method: "post", children: [
      /* @__PURE__ */ jsxDEV9("label", { htmlFor: "caption", children: "Caption" }, void 0, !1, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 37,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV9(
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
      /* @__PURE__ */ jsxDEV9("label", { htmlFor: "image", children: "Image URL" }, void 0, !1, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 46,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV9(
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
      /* @__PURE__ */ jsxDEV9("label", { htmlFor: "image-preview", children: "Image Preview" }, void 0, !1, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 55,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV9(
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
      /* @__PURE__ */ jsxDEV9("input", { name: "uid", type: "text", defaultValue: post.uid, hidden: !0 }, void 0, !1, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 64,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV9("div", { className: "btns", children: [
        /* @__PURE__ */ jsxDEV9("button", { children: "Save" }, void 0, !1, {
          fileName: "app/routes/posts.$postId_.update.jsx",
          lineNumber: 66,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV9("button", { type: "button", className: "btn-cancel", onClick: handleCancel, children: "Cancel" }, void 0, !1, {
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
async function action5({ request, params }) {
  let authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), postToUpdate = await mongoose8.models.Post.findById(params.postId);
  if (postToUpdate.user.toString() !== authUser._id.toString())
    return redirect4(`/posts/${params.postId}`);
  let formData = await request.formData(), post = Object.fromEntries(formData);
  return postToUpdate.caption = post.caption, postToUpdate.image = post.image, await postToUpdate.save(), redirect4(`/posts/${params.postId}`);
}

// app/routes/userProfile.$userId.jsx
var userProfile_userId_exports = {};
__export(userProfile_userId_exports, {
  action: () => action6,
  default: () => UserProfile,
  loader: () => loader7
});
import { useLoaderData as useLoaderData5 } from "@remix-run/react";
import { json as json4, redirect as redirect5 } from "@remix-run/node";
import { useState as useState4 } from "react";
import mongoose9 from "mongoose";
import { jsxDEV as jsxDEV10 } from "react/jsx-dev-runtime";
async function loader7({ request, params }) {
  let authUser = await authenticator.isAuthenticated(request), userProfile = await mongoose9.models.User.findById(params.userId).populate("followers").populate("following");
  return json4({ userProfile, authUser });
}
async function action6({ request, params }) {
  let authUser = await authenticator.isAuthenticated(request);
  if (!authUser)
    return redirect5("/login");
  let userToUpdate = await mongoose9.models.User.findById(params.userId);
  if (!userToUpdate)
    return redirect5("/404");
  let actionType = new URLSearchParams(await request.text()).get("action");
  return actionType === "follow" ? authUser.following.includes(userToUpdate._id) || (authUser.following.push(userToUpdate._id), userToUpdate.followers.push(authUser._id), await authUser.save(), await userToUpdate.save()) : actionType === "unfollow" && (authUser.following = authUser.following.filter(
    (id) => id.toString() !== userToUpdate._id.toString()
  ), userToUpdate.followers = userToUpdate.followers.filter(
    (id) => id.toString() !== authUser._id.toString()
  ), await authUser.save(), await userToUpdate.save()), json4({ success: !0 });
}
function UserProfile() {
  let { userProfile, authUser } = useLoaderData5(), [followersCount, setFollowersCount] = useState4(
    userProfile.followers.length
  ), [followingCount, setFollowingCount] = useState4(
    userProfile.following.length
  ), isFollowing = userProfile.followers.some(
    (follower) => follower._id.toString() === authUser._id.toString()
  ), handleFollow = async () => {
    (await fetch(`/userProfile/${userProfile._id}`, {
      method: "POST",
      body: new URLSearchParams({ action: "follow" })
      // Send "follow" action
    })).ok && (setFollowersCount(followersCount + 1), setFollowingCount(followingCount + 1));
  }, handleUnfollow = async () => {
    (await fetch(`/userProfile/${userProfile._id}`, {
      method: "POST",
      body: new URLSearchParams({ action: "unfollow" })
      // Send "unfollow" action
    })).ok && (setFollowersCount(followersCount - 1), setFollowingCount(followingCount - 1));
  };
  return /* @__PURE__ */ jsxDEV10("div", { className: "user-profile-page", children: [
    /* @__PURE__ */ jsxDEV10("h1", { className: "text-3xl", children: [
      userProfile.name,
      "'s Profile"
    ] }, void 0, !0, {
      fileName: "app/routes/userProfile.$userId.jsx",
      lineNumber: 101,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV10("p", { children: [
      "Email: ",
      userProfile.mail
    ] }, void 0, !0, {
      fileName: "app/routes/userProfile.$userId.jsx",
      lineNumber: 102,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV10("p", { children: [
      followersCount,
      " Followers"
    ] }, void 0, !0, {
      fileName: "app/routes/userProfile.$userId.jsx",
      lineNumber: 103,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV10("p", { children: [
      followingCount,
      " Following"
    ] }, void 0, !0, {
      fileName: "app/routes/userProfile.$userId.jsx",
      lineNumber: 104,
      columnNumber: 7
    }, this),
    authUser && authUser._id !== userProfile._id && /* @__PURE__ */ jsxDEV10("div", { className: "follow-actions", children: isFollowing ? /* @__PURE__ */ jsxDEV10("button", { onClick: handleUnfollow, children: "Unfollow" }, void 0, !1, {
      fileName: "app/routes/userProfile.$userId.jsx",
      lineNumber: 109,
      columnNumber: 13
    }, this) : /* @__PURE__ */ jsxDEV10("button", { onClick: handleFollow, children: "Follow" }, void 0, !1, {
      fileName: "app/routes/userProfile.$userId.jsx",
      lineNumber: 111,
      columnNumber: 13
    }, this) }, void 0, !1, {
      fileName: "app/routes/userProfile.$userId.jsx",
      lineNumber: 107,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/userProfile.$userId.jsx",
    lineNumber: 100,
    columnNumber: 5
  }, this);
}

// app/routes/dashboard._index.jsx
var dashboard_index_exports = {};
__export(dashboard_index_exports, {
  default: () => Index,
  loader: () => loader8,
  meta: () => meta3
});
import { useState as useState7 } from "react";
import { json as json5 } from "@remix-run/node";
import { Link, useLoaderData as useLoaderData6 } from "@remix-run/react";
import mongoose10 from "mongoose";

// app/components/DashboardData.jsx
import { useEffect as useEffect3, useState as useState5 } from "react";
import { jsxDEV as jsxDEV11 } from "react/jsx-dev-runtime";
var DashboardData = () => {
  let [weatherData, setWeatherData] = useState5(null), [city, setCity] = useState5("Loading..."), [country, setCountry] = useState5(""), [inputCity, setInputCity] = useState5(""), [error, setError] = useState5(""), [loading, setLoading] = useState5(!0), [activeTab, setActiveTab] = useState5("wind"), [isOffline, setIsOffline] = useState5(!1), apiKey = "84c59fa875b07f0e54b6dd1ce011f187", debounceDelay = 500;
  useEffect3(() => {
    if (typeof window < "u" && navigator) {
      setIsOffline(!navigator.onLine);
      let handleNetworkChange = () => {
        let isOnline = navigator.onLine;
        if (setIsOffline(!isOnline), isOnline)
          setError("");
        else {
          setError(
            "You are offline. Data displayed is from the last fetched information."
          );
          let cachedData = localStorage.getItem(city);
          cachedData && (setWeatherData(JSON.parse(cachedData)), setLoading(!1));
        }
      };
      return window.addEventListener("online", handleNetworkChange), window.addEventListener("offline", handleNetworkChange), () => {
        window.removeEventListener("online", handleNetworkChange), window.removeEventListener("offline", handleNetworkChange);
      };
    }
  }, [city]), useEffect3(() => {
    let timer = setTimeout(() => {
      inputCity && (setCity(inputCity), setInputCity(""));
    }, debounceDelay);
    return () => clearTimeout(timer);
  }, [inputCity]);
  let fetchWeatherData = async (city2) => {
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city2}&appid=${apiKey}&units=metric`;
    setLoading(!0);
    try {
      let response = await fetch(apiUrl);
      if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Error: ${errorText}`);
      }
      let data = await response.json();
      setWeatherData(data), setError(""), setCountry(data.city.country), localStorage.setItem(city2, JSON.stringify(data));
    } catch (error2) {
      console.error("Error fetching weather data:", error2), setError("Could not fetch weather data. Please try another city.");
    } finally {
      setLoading(!1);
    }
  }, fetchCityByCoordinates = async (lat, lon) => {
    let reverseGeoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    try {
      let data = await (await fetch(reverseGeoUrl)).json();
      data && data.length > 0 && (setCity(data[0].name), setCountry(data[0].country));
    } catch (error2) {
      console.error("Error fetching city by coordinates:", error2), setCity("Copenhagen"), setCountry("DK");
    }
  }, getUserLocation = () => {
    typeof navigator < "u" && navigator.geolocation ? navigator.geolocation.getCurrentPosition(
      (position) => {
        let { latitude, longitude } = position.coords;
        fetchCityByCoordinates(latitude, longitude);
      },
      () => {
        setCity("Copenhagen"), setCountry("DK");
      }
    ) : (setCity("Copenhagen"), setCountry("DK"));
  };
  useEffect3(() => {
    typeof window < "u" && getUserLocation();
  }, []), useEffect3(() => {
    if (typeof window < "u") {
      let cachedData = localStorage.getItem(city);
      cachedData ? (setWeatherData(JSON.parse(cachedData)), setError(""), setLoading(!1)) : city !== "Loading..." && fetchWeatherData(city);
    }
  }, [city]);
  let handleSearch = (e) => {
    e.preventDefault(), inputCity && (setCity(inputCity), setInputCity(""));
  }, getWindDirection = (degrees) => {
    if (degrees >= 337.5 || degrees < 22.5)
      return "N";
    if (degrees >= 22.5 && degrees < 67.5)
      return "NE";
    if (degrees >= 67.5 && degrees < 112.5)
      return "E";
    if (degrees >= 112.5 && degrees < 157.5)
      return "SE";
    if (degrees >= 157.5 && degrees < 202.5)
      return "S";
    if (degrees >= 202.5 && degrees < 247.5)
      return "SW";
    if (degrees >= 247.5 && degrees < 292.5)
      return "W";
    if (degrees >= 292.5 && degrees < 337.5)
      return "NW";
  }, getWeatherEmoji = (description) => {
    let lowerCaseDescription = description.toLowerCase();
    return lowerCaseDescription.includes("clear") ? "\u2600\uFE0F" : lowerCaseDescription.includes("clouds") ? "\u2601\uFE0F" : lowerCaseDescription.includes("rain") ? "\u{1F327}\uFE0F" : lowerCaseDescription.includes("thunderstorm") ? "\u26C8\uFE0F" : lowerCaseDescription.includes("snow") ? "\u2744\uFE0F" : lowerCaseDescription.includes("mist") || lowerCaseDescription.includes("fog") ? "\u{1F32B}\uFE0F" : "\u{1F324}\uFE0F";
  };
  return /* @__PURE__ */ jsxDEV11("div", { className: "flex flex-col p-4", children: [
    isOffline && /* @__PURE__ */ jsxDEV11("div", { className: "bg-yellow-200 text-yellow-800 p-4 mb-4 rounded-lg", children: "\u26A0\uFE0F You are offline. Displayed data may be outdated." }, void 0, !1, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 174,
      columnNumber: 9
    }, this),
    loading ? /* @__PURE__ */ jsxDEV11("div", { className: "loader-container", children: /* @__PURE__ */ jsxDEV11("div", { className: "spinner" }, void 0, !1, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 181,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 180,
      columnNumber: 9
    }, this) : /* @__PURE__ */ jsxDEV11("div", { className: "flex flex-col p-4", id: "outer-container", children: [
      /* @__PURE__ */ jsxDEV11("form", { className: "flex justify-center mt-20", onSubmit: handleSearch, children: [
        /* @__PURE__ */ jsxDEV11(
          "input",
          {
            type: "text",
            placeholder: "Enter city name",
            value: inputCity,
            onChange: (e) => setInputCity(e.target.value),
            className: "bg-slate-50 p-2 w-72 rounded-l-2xl focus:outline-none"
          },
          void 0,
          !1,
          {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 186,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV11("button", { className: "bg-slate-50 rounded-r-2xl p-2", type: "submit", children: /* @__PURE__ */ jsxDEV11(
          "svg",
          {
            className: "h-4 w-4",
            xmlns: "http://www.w3.org/2000/svg",
            x: "0px",
            y: "0px",
            viewBox: "0 0 24 24",
            children: /* @__PURE__ */ jsxDEV11("path", { d: "M 9 2 C 5.1458514 2 2 5.1458514 2 9 C 2 12.854149 5.1458514 16 9 16 C 10.747998 16 12.345009 15.348024 13.574219 14.28125 L 14 14.707031 L 14 16 L 20 22 L 22 20 L 16 14 L 14.707031 14 L 14.28125 13.574219 C 15.348024 12.345009 16 10.747998 16 9 C 16 5.1458514 12.854149 2 9 2 z M 9 4 C 11.773268 4 14 6.2267316 14 9 C 14 11.773268 11.773268 14 9 14 C 6.2267316 14 4 11.773268 4 9 C 4 6.2267316 6.2267316 4 9 4 z" }, void 0, !1, {
              fileName: "app/components/DashboardData.jsx",
              lineNumber: 201,
              columnNumber: 17
            }, this)
          },
          void 0,
          !1,
          {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 194,
            columnNumber: 15
          },
          this
        ) }, void 0, !1, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 193,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 185,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV11("div", { className: "flex flex-col md:flex-row", children: [
        /* @__PURE__ */ jsxDEV11("div", { className: "md:w-3/6 md:justify-center md:mx-auto", children: [
          /* @__PURE__ */ jsxDEV11("div", { className: "mt-4 flex justify-center flex-col", children: /* @__PURE__ */ jsxDEV11("div", { children: [
            /* @__PURE__ */ jsxDEV11("h1", { className: "text-7xl font-bold text-center mt-2 capitalize", children: city }, void 0, !1, {
              fileName: "app/components/DashboardData.jsx",
              lineNumber: 209,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV11("p", { className: "text-4xl font-semibold text-center", children: country }, void 0, !1, {
              fileName: "app/components/DashboardData.jsx",
              lineNumber: 212,
              columnNumber: 19
            }, this)
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 208,
            columnNumber: 17
          }, this) }, void 0, !1, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 207,
            columnNumber: 15
          }, this),
          error && /* @__PURE__ */ jsxDEV11("p", { className: "text-red-500 text-center", children: error }, void 0, !1, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 218,
            columnNumber: 25
          }, this),
          weatherData ? /* @__PURE__ */ jsxDEV11("div", { className: "bg-s-100 rounded-xl w-full p-6 mt-4 mx-auto", children: [
            /* @__PURE__ */ jsxDEV11("p", { className: "text-3xl flex items-center gap-3", children: [
              "\u{1F321} ",
              weatherData.list[0].main.temp,
              " \xB0C"
            ] }, void 0, !0, {
              fileName: "app/components/DashboardData.jsx",
              lineNumber: 222,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV11("p", { children: [
              "Feels Like: ",
              weatherData.list[0].main.feels_like,
              " \xB0C"
            ] }, void 0, !0, {
              fileName: "app/components/DashboardData.jsx",
              lineNumber: 225,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV11("p", { children: [
              "Min Temp: ",
              weatherData.list[0].main.temp_min,
              " \xB0C"
            ] }, void 0, !0, {
              fileName: "app/components/DashboardData.jsx",
              lineNumber: 226,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV11("p", { children: [
              "Max Temp: ",
              weatherData.list[0].main.temp_max,
              " \xB0C"
            ] }, void 0, !0, {
              fileName: "app/components/DashboardData.jsx",
              lineNumber: 227,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV11("p", { className: "text-3xl flex items-center gap-3", children: [
              getWeatherEmoji(
                weatherData.list[0].weather[0].description
              ),
              " ",
              weatherData.list[0].weather[0].description
            ] }, void 0, !0, {
              fileName: "app/components/DashboardData.jsx",
              lineNumber: 228,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV11("p", { children: [
              "Rain:",
              " ",
              weatherData.list[0].rain ? weatherData.list[0].rain["3h"] : 0,
              " ",
              "mm"
            ] }, void 0, !0, {
              fileName: "app/components/DashboardData.jsx",
              lineNumber: 234,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV11("p", { className: "text-3xl flex items-center gap-3", children: [
              "\u{1F4A8} ",
              weatherData.list[0].wind.speed,
              " m/s"
            ] }, void 0, !0, {
              fileName: "app/components/DashboardData.jsx",
              lineNumber: 241,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV11("p", { children: [
              "Wind Direction:",
              " ",
              getWindDirection(weatherData.list[0].wind.deg),
              " (",
              weatherData.list[0].wind.deg,
              "\xB0)"
            ] }, void 0, !0, {
              fileName: "app/components/DashboardData.jsx",
              lineNumber: 244,
              columnNumber: 19
            }, this)
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 221,
            columnNumber: 17
          }, this) : /* @__PURE__ */ jsxDEV11("p", { className: "text-center mt-4", children: "Loading weather data..." }, void 0, !1, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 251,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 206,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV11("div", { className: "w-full h-96 p-4", children: [
          /* @__PURE__ */ jsxDEV11("div", { className: "flex mt-4", children: [
            /* @__PURE__ */ jsxDEV11(
              "button",
              {
                className: `p-2 rounded-t-md shadow-md ${activeTab === "wind" ? "bg-blue-500 text-white" : "bg-slate-100 hover:bg-slate-400"}`,
                onClick: () => setActiveTab("wind"),
                children: "Wind Map"
              },
              void 0,
              !1,
              {
                fileName: "app/components/DashboardData.jsx",
                lineNumber: 256,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV11(
              "button",
              {
                className: `p-2 rounded-t-md shadow-md ${activeTab === "swell" ? "bg-blue-500 text-white" : "bg-slate-100 hover:bg-slate-400"}`,
                onClick: () => setActiveTab("swell"),
                children: "Swell Map"
              },
              void 0,
              !1,
              {
                fileName: "app/components/DashboardData.jsx",
                lineNumber: 266,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV11(
              "button",
              {
                className: `p-2 rounded-t-md shadow-md ${activeTab === "temp" ? "bg-slate-500 text-white" : "bg-slate-100 hover:bg-slate-400"}`,
                onClick: () => setActiveTab("temp"),
                children: "Sea Temp"
              },
              void 0,
              !1,
              {
                fileName: "app/components/DashboardData.jsx",
                lineNumber: 276,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 255,
            columnNumber: 15
          }, this),
          activeTab === "wind" && weatherData && /* @__PURE__ */ jsxDEV11(
            "iframe",
            {
              title: "Windy Map",
              src: `https://embed.windy.com/embed.html?lat=${weatherData.city.coord.lat}&lon=${weatherData.city.coord.lon}&zoom=5&overlay=wind&metricTemp=\xB0C&metricWind=m/s`,
              className: "w-full h-full rounded-md",
              frameBorder: "0"
            },
            void 0,
            !1,
            {
              fileName: "app/components/DashboardData.jsx",
              lineNumber: 289,
              columnNumber: 17
            },
            this
          ),
          activeTab === "swell" && weatherData && /* @__PURE__ */ jsxDEV11(
            "iframe",
            {
              title: "Swell Map",
              src: `https://embed.windy.com/embed.html?lat=${weatherData.city.coord.lat}&lon=${weatherData.city.coord.lon}&zoom=5&overlay=swell1&product=ecmwfWaves&level=surface`,
              className: "w-full h-full rounded-md",
              frameBorder: "0"
            },
            void 0,
            !1,
            {
              fileName: "app/components/DashboardData.jsx",
              lineNumber: 297,
              columnNumber: 17
            },
            this
          ),
          activeTab === "temp" && weatherData && /* @__PURE__ */ jsxDEV11(
            "iframe",
            {
              title: "Sea Temperature",
              src: `https://embed.windy.com/embed.html?lat=${weatherData.city.coord.lat}&lon=${weatherData.city.coord.lon}&zoom=5&overlay=sst&product=ecmwfAnalysis&level=surface`,
              className: "w-full h-full rounded-md",
              frameBorder: "0"
            },
            void 0,
            !1,
            {
              fileName: "app/components/DashboardData.jsx",
              lineNumber: 305,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 254,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 205,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 184,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/DashboardData.jsx",
    lineNumber: 172,
    columnNumber: 5
  }, this);
}, DashboardData_default = DashboardData;

// app/components/EventListCards.jsx
import { jsxDEV as jsxDEV12 } from "react/jsx-dev-runtime";
function EventCard({ event }) {
  return event ? /* @__PURE__ */ jsxDEV12("article", { className: "flex m-4  p-4 rounded-xl shadow-lg w-full overflow-hidden flex-col bg-slate-50", children: [
    /* @__PURE__ */ jsxDEV12("img", { className: "rounded-xl", src: event?.image, alt: "" }, void 0, !1, {
      fileName: "app/components/EventListCards.jsx",
      lineNumber: 8,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV12("div", { className: "grid grid-cols-3 p-2 ", children: [
      /* @__PURE__ */ jsxDEV12("p", { children: event?.creator?.name }, void 0, !1, {
        fileName: "app/components/EventListCards.jsx",
        lineNumber: 10,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV12("h2", { children: event.title }, void 0, !1, {
        fileName: "app/components/EventListCards.jsx",
        lineNumber: 11,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV12("p", { children: [
        "Date: ",
        new Date(event.date).toLocaleDateString("en-GB")
      ] }, void 0, !0, {
        fileName: "app/components/EventListCards.jsx",
        lineNumber: 12,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV12("p", { children: [
        "Location: ",
        event.location
      ] }, void 0, !0, {
        fileName: "app/components/EventListCards.jsx",
        lineNumber: 13,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV12("p", { className: "truncate", children: [
        "Description: ",
        event.description
      ] }, void 0, !0, {
        fileName: "app/components/EventListCards.jsx",
        lineNumber: 14,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV12("p", { className: "mt-4 flex items-center font-semibold", children: [
        "Likes: ",
        event.attendees?.length || 0
      ] }, void 0, !0, {
        fileName: "app/components/EventListCards.jsx",
        lineNumber: 15,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/EventListCards.jsx",
      lineNumber: 9,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/EventListCards.jsx",
    lineNumber: 7,
    columnNumber: 5
  }, this) : /* @__PURE__ */ jsxDEV12("p", { children: "No event found." }, void 0, !1, {
    fileName: "app/components/EventListCards.jsx",
    lineNumber: 3,
    columnNumber: 12
  }, this);
}

// app/components/EventCard.jsx
import { useEffect as useEffect4, useState as useState6 } from "react";
import axios from "axios";
import { jsxDEV as jsxDEV13 } from "react/jsx-dev-runtime";
function EventCard2({ event, onCityUpdate }) {
  let [city, setCity] = useState6(null), normalizeCityName = (cityName) => cityName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(), fetchCityFromCoordinates = async (lat, lng) => {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyC8mGRx4SS4NLfyl7AIOhktrM_F9EOHWYQ`;
    try {
      let results = (await axios.get(url)).data.results;
      if (results.length > 0) {
        let addressComponents = results[0].address_components, nearestCity = addressComponents.find(
          (component) => component.types.includes("locality") || component.types.includes("administrative_area_level_1")
        )?.long_name || addressComponents.find(
          (component) => component.types.includes("administrative_area_level_2")
        )?.long_name || "Unknown location", normalizedCity = normalizeCityName(nearestCity);
        setCity(normalizedCity), onCityUpdate(event._id, normalizedCity);
      } else {
        let normalizedCity = normalizeCityName("Unknown location");
        setCity(normalizedCity), onCityUpdate(event._id, normalizedCity);
      }
    } catch (error) {
      console.error("Error fetching city:", error);
      let normalizedCity = normalizeCityName("Error fetching location");
      setCity(normalizedCity), onCityUpdate(event._id, normalizedCity);
    }
  };
  return useEffect4(() => {
    if (event.location) {
      let [lat, lng] = event.location.split(",").map((coord) => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lng))
        fetchCityFromCoordinates(lat, lng);
      else {
        let normalizedCity = normalizeCityName("No location available");
        setCity(normalizedCity), onCityUpdate(event._id, normalizedCity);
      }
    }
  }, [event.location]), /* @__PURE__ */ jsxDEV13("article", { className: "flex p-4 rounded-xl shadow-lg w-full bg-slate-50", children: [
    /* @__PURE__ */ jsxDEV13(
      "div",
      {
        className: "w-full rounded-xl",
        style: {
          backgroundImage: `url(${event?.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }
      },
      void 0,
      !1,
      {
        fileName: "app/components/EventCard.jsx",
        lineNumber: 68,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV13("div", { className: "flex flex-col w-full", children: [
      /* @__PURE__ */ jsxDEV13("div", { className: "p-2 ml-4", children: [
        /* @__PURE__ */ jsxDEV13("h2", { className: "text-xl font-bold mb-2", children: event.title }, void 0, !1, {
          fileName: "app/components/EventCard.jsx",
          lineNumber: 78,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV13("p", { className: "text-gray-500", children: event?.creator?.name }, void 0, !1, {
          fileName: "app/components/EventCard.jsx",
          lineNumber: 79,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/EventCard.jsx",
        lineNumber: 77,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV13("div", { className: "flex flex-col flex-grow ml-4", children: [
        /* @__PURE__ */ jsxDEV13("div", { className: "flex p-2", children: /* @__PURE__ */ jsxDEV13("div", { className: "col-span-2", children: [
          /* @__PURE__ */ jsxDEV13("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxDEV13("h3", { className: "font-semibold mr-1", children: "Date: " }, void 0, !1, {
              fileName: "app/components/EventCard.jsx",
              lineNumber: 85,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV13("p", { children: new Date(event.date).toLocaleDateString("en-GB") }, void 0, !1, {
              fileName: "app/components/EventCard.jsx",
              lineNumber: 86,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/components/EventCard.jsx",
            lineNumber: 84,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV13("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxDEV13("h3", { className: "mr-1 font-semibold", children: "Location: " }, void 0, !1, {
              fileName: "app/components/EventCard.jsx",
              lineNumber: 89,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV13("p", { children: city || "Fetching city..." }, void 0, !1, {
              fileName: "app/components/EventCard.jsx",
              lineNumber: 90,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/components/EventCard.jsx",
            lineNumber: 88,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/components/EventCard.jsx",
          lineNumber: 83,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/components/EventCard.jsx",
          lineNumber: 82,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV13("div", { className: "grid grid-cols-1 mt-4 ml-2", children: [
          /* @__PURE__ */ jsxDEV13("h3", { className: "mb-2 font-semibold", children: "Description:" }, void 0, !1, {
            fileName: "app/components/EventCard.jsx",
            lineNumber: 95,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV13("p", { className: "truncate", children: event.description }, void 0, !1, {
            fileName: "app/components/EventCard.jsx",
            lineNumber: 96,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV13("p", { className: "mt-4 flex items-center font-semibold", children: [
            "Likes: ",
            event.attendees?.length || 0
          ] }, void 0, !0, {
            fileName: "app/components/EventCard.jsx",
            lineNumber: 97,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/components/EventCard.jsx",
          lineNumber: 94,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/EventCard.jsx",
        lineNumber: 81,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/EventCard.jsx",
      lineNumber: 76,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/EventCard.jsx",
    lineNumber: 67,
    columnNumber: 5
  }, this);
}

// app/routes/dashboard._index.jsx
import { jsxDEV as jsxDEV14 } from "react/jsx-dev-runtime";
var meta3 = () => [{ title: "Remix Post App" }];
async function loader8({ request }) {
  if (!await authenticator.isAuthenticated(request))
    return json5({ mostLikedEvent: null });
  let mostLikedEvent = await mongoose10.models.Event.findOne().sort({ attendees: -1 }).populate("creator").populate("attendees");
  return json5({ mostLikedEvent });
}
function Index() {
  let { mostLikedEvent } = useLoaderData6(), [eventCities, setEventCities] = useState7({});
  if (!mostLikedEvent)
    return /* @__PURE__ */ jsxDEV14("div", { className: "page", children: [
      /* @__PURE__ */ jsxDEV14(DashboardData_default, {}, void 0, !1, {
        fileName: "app/routes/dashboard._index.jsx",
        lineNumber: 36,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV14("p", { children: "No events available at the moment." }, void 0, !1, {
        fileName: "app/routes/dashboard._index.jsx",
        lineNumber: 37,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/dashboard._index.jsx",
      lineNumber: 35,
      columnNumber: 7
    }, this);
  let updateCity = (eventId, city) => {
    setEventCities((prev) => ({
      ...prev,
      [eventId]: city
    }));
  };
  return /* @__PURE__ */ jsxDEV14("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV14(DashboardData_default, {}, void 0, !1, {
      fileName: "app/routes/dashboard._index.jsx",
      lineNumber: 52,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV14("div", { className: "p-4", children: /* @__PURE__ */ jsxDEV14(
      Link,
      {
        className: "event-link",
        to: `/event/${mostLikedEvent._id}`,
        children: [
          /* @__PURE__ */ jsxDEV14("div", { className: "md:hidden w-full flex justify-center", children: /* @__PURE__ */ jsxDEV14(EventCard, { event: mostLikedEvent }, void 0, !1, {
            fileName: "app/routes/dashboard._index.jsx",
            lineNumber: 60,
            columnNumber: 13
          }, this) }, void 0, !1, {
            fileName: "app/routes/dashboard._index.jsx",
            lineNumber: 59,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV14("div", { className: "hidden md:flex w-full justify-center", children: /* @__PURE__ */ jsxDEV14(EventCard2, { event: mostLikedEvent, onCityUpdate: updateCity }, void 0, !1, {
            fileName: "app/routes/dashboard._index.jsx",
            lineNumber: 63,
            columnNumber: 13
          }, this) }, void 0, !1, {
            fileName: "app/routes/dashboard._index.jsx",
            lineNumber: 62,
            columnNumber: 11
          }, this)
        ]
      },
      mostLikedEvent._id,
      !0,
      {
        fileName: "app/routes/dashboard._index.jsx",
        lineNumber: 54,
        columnNumber: 9
      },
      this
    ) }, void 0, !1, {
      fileName: "app/routes/dashboard._index.jsx",
      lineNumber: 53,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/dashboard._index.jsx",
    lineNumber: 51,
    columnNumber: 5
  }, this);
}

// app/routes/profile.$userId.jsx
var profile_userId_exports = {};
__export(profile_userId_exports, {
  action: () => action7,
  default: () => Profile,
  loader: () => loader9
});
import { Form as Form4, useLoaderData as useLoaderData7 } from "@remix-run/react";
import mongoose11 from "mongoose";
import { Link as Link2 } from "react-router-dom";
import { jsxDEV as jsxDEV15 } from "react/jsx-dev-runtime";
async function loader9({ request }) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), events = await mongoose11.models.Event.find({ creator: user._id }).populate("creator").populate("attendees"), eventsAttending = await mongoose11.models.Event.find({
    attendees: user._id
  }).populate("creator").populate("attendees");
  return { user: await mongoose11.models.User.findOne({ _id: user._id }), events, eventsAttending };
}
function Profile() {
  let { user, events, eventsAttending } = useLoaderData7();
  return /* @__PURE__ */ jsxDEV15("div", { className: "page flex flex-col justify-center m-auto w-4/6", children: [
    /* @__PURE__ */ jsxDEV15("div", { className: "w-full flex flex-col justify-center m-auto my-8", children: [
      /* @__PURE__ */ jsxDEV15("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsxDEV15("h1", { className: "font-semibold text-xl", children: "Profile" }, void 0, !1, {
          fileName: "app/routes/profile.$userId.jsx",
          lineNumber: 40,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV15(Form4, { children: /* @__PURE__ */ jsxDEV15(Link2, { to: `/profile/${user._id}/update`, children: /* @__PURE__ */ jsxDEV15("button", { children: /* @__PURE__ */ jsxDEV15(
          "svg",
          {
            width: "30px",
            height: "30px",
            className: "hover:stroke-gray-400 stroke-black",
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg",
            children: /* @__PURE__ */ jsxDEV15("g", { id: "Complete", children: /* @__PURE__ */ jsxDEV15("g", { id: "edit", children: /* @__PURE__ */ jsxDEV15("g", { children: [
              /* @__PURE__ */ jsxDEV15(
                "path",
                {
                  d: "M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8",
                  fill: "none",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "2"
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/profile.$userId.jsx",
                  lineNumber: 54,
                  columnNumber: 25
                },
                this
              ),
              /* @__PURE__ */ jsxDEV15(
                "polygon",
                {
                  fill: "none",
                  points: "12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "2"
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/profile.$userId.jsx",
                  lineNumber: 61,
                  columnNumber: 25
                },
                this
              )
            ] }, void 0, !0, {
              fileName: "app/routes/profile.$userId.jsx",
              lineNumber: 53,
              columnNumber: 23
            }, this) }, void 0, !1, {
              fileName: "app/routes/profile.$userId.jsx",
              lineNumber: 52,
              columnNumber: 21
            }, this) }, void 0, !1, {
              fileName: "app/routes/profile.$userId.jsx",
              lineNumber: 51,
              columnNumber: 19
            }, this)
          },
          void 0,
          !1,
          {
            fileName: "app/routes/profile.$userId.jsx",
            lineNumber: 44,
            columnNumber: 17
          },
          this
        ) }, void 0, !1, {
          fileName: "app/routes/profile.$userId.jsx",
          lineNumber: 43,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/routes/profile.$userId.jsx",
          lineNumber: 42,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/routes/profile.$userId.jsx",
          lineNumber: 41,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/profile.$userId.jsx",
        lineNumber: 39,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV15("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsxDEV15("div", { className: "py-2", children: [
          /* @__PURE__ */ jsxDEV15("p", { className: "font-semibold", children: "Name: " }, void 0, !1, {
            fileName: "app/routes/profile.$userId.jsx",
            lineNumber: 78,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV15("p", { children: user?.name }, void 0, !1, {
            fileName: "app/routes/profile.$userId.jsx",
            lineNumber: 79,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/profile.$userId.jsx",
          lineNumber: 77,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV15("div", { className: "py-2", children: [
          /* @__PURE__ */ jsxDEV15("p", { className: "font-semibold", children: "Mail: " }, void 0, !1, {
            fileName: "app/routes/profile.$userId.jsx",
            lineNumber: 82,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV15("p", { children: user?.mail }, void 0, !1, {
            fileName: "app/routes/profile.$userId.jsx",
            lineNumber: 83,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/profile.$userId.jsx",
          lineNumber: 81,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/profile.$userId.jsx",
        lineNumber: 76,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV15(
        Form4,
        {
          method: "post",
          className: "items-center w-1/2 bg-gray-100 hover:bg-gray-200 rounded-xl p-2 m-auto",
          children: /* @__PURE__ */ jsxDEV15("div", { className: "", children: /* @__PURE__ */ jsxDEV15("button", { className: "text-cancel flex flex-row font-semibold w-full justify-center", children: "Logout" }, void 0, !1, {
            fileName: "app/routes/profile.$userId.jsx",
            lineNumber: 92,
            columnNumber: 13
          }, this) }, void 0, !1, {
            fileName: "app/routes/profile.$userId.jsx",
            lineNumber: 91,
            columnNumber: 11
          }, this)
        },
        void 0,
        !1,
        {
          fileName: "app/routes/profile.$userId.jsx",
          lineNumber: 87,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/profile.$userId.jsx",
      lineNumber: 38,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV15("div", { className: "py-6", children: /* @__PURE__ */ jsxDEV15("h2", { className: "text-2xl font-semibold", children: "Liked posts" }, void 0, !1, {
      fileName: "app/routes/profile.$userId.jsx",
      lineNumber: 99,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/profile.$userId.jsx",
      lineNumber: 98,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV15("div", { children: eventsAttending.map((event) => /* @__PURE__ */ jsxDEV15("div", { children: /* @__PURE__ */ jsxDEV15(Link2, { className: "event-link", to: `/event/${event._id}`, children: [
      /* @__PURE__ */ jsxDEV15("div", { className: " md:hidden ", children: /* @__PURE__ */ jsxDEV15(EventCard, { event }, void 0, !1, {
        fileName: "app/routes/profile.$userId.jsx",
        lineNumber: 106,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/profile.$userId.jsx",
        lineNumber: 105,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV15("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxDEV15(EventCard2, { event }, void 0, !1, {
        fileName: "app/routes/profile.$userId.jsx",
        lineNumber: 109,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/profile.$userId.jsx",
        lineNumber: 108,
        columnNumber: 15
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/profile.$userId.jsx",
      lineNumber: 104,
      columnNumber: 13
    }, this) }, event._id, !1, {
      fileName: "app/routes/profile.$userId.jsx",
      lineNumber: 103,
      columnNumber: 11
    }, this)) }, void 0, !1, {
      fileName: "app/routes/profile.$userId.jsx",
      lineNumber: 101,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV15("div", { className: "mb-16", children: [
      /* @__PURE__ */ jsxDEV15("h2", { className: "text-lg font-medium pt-6", children: "Posts by me" }, void 0, !1, {
        fileName: "app/routes/profile.$userId.jsx",
        lineNumber: 116,
        columnNumber: 9
      }, this),
      events.map((event) => /* @__PURE__ */ jsxDEV15("div", { children: /* @__PURE__ */ jsxDEV15(Link2, { className: "event-link", to: `/event/${event._id}`, children: [
        /* @__PURE__ */ jsxDEV15("div", { className: " md:hidden ", children: /* @__PURE__ */ jsxDEV15(EventCard, { event }, void 0, !1, {
          fileName: "app/routes/profile.$userId.jsx",
          lineNumber: 121,
          columnNumber: 17
        }, this) }, void 0, !1, {
          fileName: "app/routes/profile.$userId.jsx",
          lineNumber: 120,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV15("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxDEV15(EventCard2, { event }, void 0, !1, {
          fileName: "app/routes/profile.$userId.jsx",
          lineNumber: 124,
          columnNumber: 17
        }, this) }, void 0, !1, {
          fileName: "app/routes/profile.$userId.jsx",
          lineNumber: 123,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/profile.$userId.jsx",
        lineNumber: 119,
        columnNumber: 13
      }, this) }, event._id, !1, {
        fileName: "app/routes/profile.$userId.jsx",
        lineNumber: 118,
        columnNumber: 11
      }, this))
    ] }, void 0, !0, {
      fileName: "app/routes/profile.$userId.jsx",
      lineNumber: 115,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/profile.$userId.jsx",
    lineNumber: 37,
    columnNumber: 5
  }, this);
}
async function action7({ request }) {
  await authenticator.logout(request, { redirectTo: "/main-dashboard" });
}

// app/routes/event.$eventId.jsx
var event_eventId_exports = {};
__export(event_eventId_exports, {
  default: () => Event,
  loader: () => loader10,
  meta: () => meta4
});
import { Form as Form5, useLoaderData as useLoaderData8 } from "@remix-run/react";
import { json as json6 } from "@remix-run/node";
import mongoose12 from "mongoose";
import { useEffect as useEffect5, useState as useState8 } from "react";
import { GoogleMap as GoogleMap2, Marker } from "@react-google-maps/api";
import { NavLink as NavLink3 } from "react-router-dom";
import { jsxDEV as jsxDEV16 } from "react/jsx-dev-runtime";
var GOOGLE_MAPS_API_KEY2 = "AIzaSyBJgJJUQYgDJs2DoVGNXrk7P8vxB01bwo0", MAP_ID2 = "71f267d426ae7773";
function meta4({ data }) {
  return [
    {
      title: `Evelation - ${data.event.title || "Event"}`
    }
  ];
}
async function loader10({ request, params }) {
  let authUser = await authenticator.isAuthenticated(request), event = await mongoose12.models.Event.findById(params.eventId).populate("attendees").populate("creator");
  return json6({ event, authUser });
}
function Event() {
  let { event, authUser } = useLoaderData8(), [city, setCity] = useState8(null), location = event?.location ? {
    lat: parseFloat(event.location.split(",")[0]),
    lng: parseFloat(event.location.split(",")[1])
  } : null;
  useEffect5(() => {
    if (location) {
      let fetchCityName = async () => {
        let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${GOOGLE_MAPS_API_KEY2}`;
        try {
          let data = await (await fetch(geocodeUrl)).json();
          if (data.results.length > 0) {
            let filteredResults = data.results.filter(
              (result) => !result.types.includes("plus_code")
            ), cityResult = filteredResults.find(
              (result) => result.types.includes("locality")
            );
            if (cityResult) {
              let cityComponent = cityResult.address_components.find(
                (component) => component.types.includes("locality")
              );
              if (cityComponent) {
                setCity(cityComponent.long_name);
                return;
              }
              console.log("Parsed Location:", location);
            }
            let fallbackResult = filteredResults[0];
            setCity(fallbackResult?.formatted_address || "Unknown Location");
          } else
            setCity("Unknown Location");
        } catch (error) {
          console.error("Error fetching city name:", error), setCity("Error fetching location");
        }
      };
      console.log("Parsed Location:", location), fetchCityName();
    }
  }, [location]);
  let attending = event?.attendees?.some(
    (attendee) => attendee._id === authUser?._id
  );
  return /* @__PURE__ */ jsxDEV16(
    "div",
    {
      id: "event-page",
      className: "page max-w-5xl flex flex-col justify-center m-auto p-6",
      children: [
        /* @__PURE__ */ jsxDEV16(
          "div",
          {
            className: "h-96 w-full flex rounded-xl",
            style: {
              backgroundImage: `url(${event?.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }
          },
          void 0,
          !1,
          {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 95,
            columnNumber: 7
          },
          this
        ),
        /* @__PURE__ */ jsxDEV16("div", { className: "my-4", children: [
          /* @__PURE__ */ jsxDEV16("h1", { className: "text-3xl", children: event.title }, void 0, !1, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 104,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV16("p", { className: "text-gray-500", children: [
            "Post by:",
            " ",
            /* @__PURE__ */ jsxDEV16(
              NavLink3,
              {
                to: `/userProfile/${event?.creator?._id}`,
                className: "text-blue-500 hover:underline",
                children: event?.creator?.name
              },
              void 0,
              !1,
              {
                fileName: "app/routes/event.$eventId.jsx",
                lineNumber: 107,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 105,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 103,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV16("h3", { children: event.description }, void 0, !1, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 115,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV16("div", { className: "flex my-2", children: [
          /* @__PURE__ */ jsxDEV16("img", { src: "/date.png", alt: "", className: "h-6" }, void 0, !1, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 117,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV16("p", { className: "", children: new Date(event.date).toLocaleDateString("en-GB") }, void 0, !1, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 118,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 116,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV16("div", { className: "flex my-2", children: /* @__PURE__ */ jsxDEV16("p", { className: "", children: city || "Fetching location..." }, void 0, !1, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 121,
          columnNumber: 9
        }, this) }, void 0, !1, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 120,
          columnNumber: 7
        }, this),
        location && /* @__PURE__ */ jsxDEV16(GoogleMapLoader, { children: /* @__PURE__ */ jsxDEV16(
          GoogleMap2,
          {
            mapContainerStyle: { width: "100%", height: "400px" },
            center: location,
            zoom: 12,
            options: {
              mapId: MAP_ID2
            },
            children: /* @__PURE__ */ jsxDEV16(Marker, { position: location }, void 0, !1, {
              fileName: "app/routes/event.$eventId.jsx",
              lineNumber: 135,
              columnNumber: 13
            }, this)
          },
          void 0,
          !1,
          {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 127,
            columnNumber: 11
          },
          this
        ) }, void 0, !1, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 126,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV16("p", { children: [
          event.attendees.length,
          " Like"
        ] }, void 0, !0, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 140,
          columnNumber: 7
        }, this),
        !attending && authUser ? /* @__PURE__ */ jsxDEV16(Form5, { method: "post", children: /* @__PURE__ */ jsxDEV16("button", { name: "_action", value: "attend", children: "Like" }, void 0, !1, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 143,
          columnNumber: 11
        }, this) }, void 0, !1, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 142,
          columnNumber: 9
        }, this) : authUser ? /* @__PURE__ */ jsxDEV16(Form5, { method: "post", children: /* @__PURE__ */ jsxDEV16("button", { name: "_action", value: "unattend", children: "Unlike" }, void 0, !1, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 149,
          columnNumber: 11
        }, this) }, void 0, !1, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 148,
          columnNumber: 9
        }, this) : null,
        authUser?._id === event?.creator?._id && /* @__PURE__ */ jsxDEV16("div", { className: "flex py-4", children: [
          /* @__PURE__ */ jsxDEV16(Form5, { action: "update", children: /* @__PURE__ */ jsxDEV16("button", { children: "Update" }, void 0, !1, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 158,
            columnNumber: 13
          }, this) }, void 0, !1, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 157,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV16(Form5, { action: "destroy", method: "post", children: /* @__PURE__ */ jsxDEV16("button", { className: "ml-4 text-cancel", children: "Delete this event" }, void 0, !1, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 161,
            columnNumber: 13
          }, this) }, void 0, !1, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 160,
            columnNumber: 11
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 156,
          columnNumber: 9
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/routes/event.$eventId.jsx",
      lineNumber: 91,
      columnNumber: 5
    },
    this
  );
}

// app/routes/main-dashboard.jsx
var main_dashboard_exports = {};
__export(main_dashboard_exports, {
  default: () => MainDashboard,
  meta: () => meta5
});
import "react";
import { NavLink as NavLink4 } from "react-router-dom";
import { jsxDEV as jsxDEV17 } from "react/jsx-dev-runtime";
var meta5 = () => [{ title: "Elevation" }];
function MainDashboard() {
  return /* @__PURE__ */ jsxDEV17("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV17("div", { className: "w-full top-0 bg-slate-200 h-14 flex justify-center items-center font-bold shadow-sm animate-slideDown z-10", children: /* @__PURE__ */ jsxDEV17("p", { children: [
      "Sign in to see more or",
      /* @__PURE__ */ jsxDEV17(NavLink4, { to: "/signup", className: "text-blue-600", children: [
        " ",
        "sign up here"
      ] }, void 0, !0, {
        fileName: "app/routes/main-dashboard.jsx",
        lineNumber: 15,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/main-dashboard.jsx",
      lineNumber: 13,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/main-dashboard.jsx",
      lineNumber: 12,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV17("div", { className: "page", children: /* @__PURE__ */ jsxDEV17(DashboardData_default, {}, void 0, !1, {
      fileName: "app/routes/main-dashboard.jsx",
      lineNumber: 22,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/main-dashboard.jsx",
      lineNumber: 21,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/main-dashboard.jsx",
    lineNumber: 11,
    columnNumber: 5
  }, this);
}

// app/routes/posts.$postId.jsx
var posts_postId_exports = {};
__export(posts_postId_exports, {
  default: () => Post,
  loader: () => loader11,
  meta: () => meta6
});
import { json as json7 } from "@remix-run/node";
import { Form as Form6, useLoaderData as useLoaderData9 } from "@remix-run/react";
import mongoose13 from "mongoose";

// app/components/UserAvatar.jsx
import { jsxDEV as jsxDEV18 } from "react/jsx-dev-runtime";
function UserAvatar({ user }) {
  return /* @__PURE__ */ jsxDEV18("div", { className: "avatar", children: [
    /* @__PURE__ */ jsxDEV18("img", { src: user.image, alt: user.name }, void 0, !1, {
      fileName: "app/components/UserAvatar.jsx",
      lineNumber: 4,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV18("span", { children: [
      /* @__PURE__ */ jsxDEV18("h3", { children: user.name }, void 0, !1, {
        fileName: "app/components/UserAvatar.jsx",
        lineNumber: 6,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV18("p", { children: user.title }, void 0, !1, {
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
import { jsxDEV as jsxDEV19 } from "react/jsx-dev-runtime";
function PostCard({ post }) {
  return /* @__PURE__ */ jsxDEV19("article", { className: "post-card", children: [
    /* @__PURE__ */ jsxDEV19(UserAvatar, { user: post.user }, void 0, !1, {
      fileName: "app/components/PostCard.jsx",
      lineNumber: 6,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV19("img", { src: post.image, alt: post.caption }, void 0, !1, {
      fileName: "app/components/PostCard.jsx",
      lineNumber: 7,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV19("h3", { children: post.caption }, void 0, !1, {
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
import { jsxDEV as jsxDEV20 } from "react/jsx-dev-runtime";
function meta6({ data }) {
  return [
    {
      title: `Remix Post App - ${data.post.caption || "Post"}`
    }
  ];
}
async function loader11({ request, params }) {
  let authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), post = await mongoose13.models.Post.findById(params.postId).populate("user");
  return json7({ post, authUser });
}
function Post() {
  let { post, authUser } = useLoaderData9();
  function confirmDelete(event) {
    confirm("Please confirm you want to delete this post.") || event.preventDefault();
  }
  return /* @__PURE__ */ jsxDEV20("div", { id: "post-page", className: "page", children: [
    /* @__PURE__ */ jsxDEV20("h1", { children: post.caption }, void 0, !1, {
      fileName: "app/routes/posts.$postId.jsx",
      lineNumber: 37,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV20(PostCard, { post }, void 0, !1, {
      fileName: "app/routes/posts.$postId.jsx",
      lineNumber: 38,
      columnNumber: 7
    }, this),
    authUser._id === post.user._id && /* @__PURE__ */ jsxDEV20("div", { className: "btns", children: [
      /* @__PURE__ */ jsxDEV20(Form6, { action: "update", children: /* @__PURE__ */ jsxDEV20("button", { children: "Update" }, void 0, !1, {
        fileName: "app/routes/posts.$postId.jsx",
        lineNumber: 42,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/posts.$postId.jsx",
        lineNumber: 41,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV20(Form6, { action: "destroy", method: "post", onSubmit: confirmDelete, children: /* @__PURE__ */ jsxDEV20("button", { children: "Delete" }, void 0, !1, {
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

// app/routes/event._index.jsx
var event_index_exports = {};
__export(event_index_exports, {
  default: () => Index2,
  loader: () => loader12,
  meta: () => meta7
});
import { json as json8 } from "@remix-run/node";
import { Form as Form7, Link as Link4, useLoaderData as useLoaderData10 } from "@remix-run/react";
import mongoose14 from "mongoose";
import { useState as useState9 } from "react";
import { jsxDEV as jsxDEV21 } from "react/jsx-dev-runtime";
var meta7 = () => [{ title: "Evelation - Post" }];
async function loader12({ request }) {
  await authenticator.isAuthenticated(request);
  let event = await mongoose14.models.Event.find().populate("creator").populate("attendees");
  return json8({ event });
}
function Index2() {
  let { event } = useLoaderData10(), [searchTerm, setSearchTerm] = useState9(""), [eventCities, setEventCities] = useState9({}), updateCity = (eventId, city) => {
    setEventCities((prev) => ({
      ...prev,
      [eventId]: city
    }));
  }, filteredEvents = event.filter((event2) => {
    let city = (eventCities[event2._id] || "").toLowerCase(), searchTermLower = searchTerm.toLowerCase();
    return Object.values(event2).some(
      (value) => value.toString().toLowerCase().includes(searchTermLower)
    ) || city.includes(searchTermLower);
  });
  return /* @__PURE__ */ jsxDEV21("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV21("p", { className: "text-gray-50 pb-4", children: "Find and get inspired for surf" }, void 0, !1, {
      fileName: "app/routes/event._index.jsx",
      lineNumber: 53,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV21(
      Form7,
      {
        className: " h-12  bg-background  flex items-center  gap-x-4  rounded-2xl my-2 ",
        id: "search-form",
        role: "search",
        children: /* @__PURE__ */ jsxDEV21("div", { className: "w-full flex  justify-center", children: /* @__PURE__ */ jsxDEV21("div", { className: "flex w-64 bg-slate-50 rounded-2xl items-center p-2 justify-between", children: [
          /* @__PURE__ */ jsxDEV21(
            "input",
            {
              className: "bg-slate-50 flex",
              type: "text",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              placeholder: "Search posts"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/event._index.jsx",
              lineNumber: 61,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV21(
            "svg",
            {
              className: "h-4 w-4",
              xmlns: "http://www.w3.org/2000/svg",
              x: "0px",
              y: "0px",
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ jsxDEV21("path", { d: "M 9 2 C 5.1458514 2 2 5.1458514 2 9 C 2 12.854149 5.1458514 16 9 16 C 10.747998 16 12.345009 15.348024 13.574219 14.28125 L 14 14.707031 L 14 16 L 20 22 L 22 20 L 16 14 L 14.707031 14 L 14.28125 13.574219 C 15.348024 12.345009 16 10.747998 16 9 C 16 5.1458514 12.854149 2 9 2 z M 9 4 C 11.773268 4 14 6.2267316 14 9 C 14 11.773268 11.773268 14 9 14 C 6.2267316 14 4 11.773268 4 9 C 4 6.2267316 6.2267316 4 9 4 z" }, void 0, !1, {
                fileName: "app/routes/event._index.jsx",
                lineNumber: 75,
                columnNumber: 15
              }, this)
            },
            void 0,
            !1,
            {
              fileName: "app/routes/event._index.jsx",
              lineNumber: 68,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/event._index.jsx",
          lineNumber: 60,
          columnNumber: 11
        }, this) }, void 0, !1, {
          fileName: "app/routes/event._index.jsx",
          lineNumber: 59,
          columnNumber: 9
        }, this)
      },
      void 0,
      !1,
      {
        fileName: "app/routes/event._index.jsx",
        lineNumber: 54,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV21("div", { className: "flex justify-center w-full flex-col", children: [
      /* @__PURE__ */ jsxDEV21("div", { className: "md:hidden p-6", children: [
        /* @__PURE__ */ jsxDEV21("h2", { className: "font-bold text-4xl text-gray-950  ", children: "Discover new surfspots" }, void 0, !1, {
          fileName: "app/routes/event._index.jsx",
          lineNumber: 82,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV21("p", { className: "text-gray-700 pb-4", children: "Find spots" }, void 0, !1, {
          fileName: "app/routes/event._index.jsx",
          lineNumber: 85,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV21("h1", { className: "text-2xl font-semibold w-2/3  py-4", children: "All spots" }, void 0, !1, {
          fileName: "app/routes/event._index.jsx",
          lineNumber: 86,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/event._index.jsx",
        lineNumber: 81,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV21("section", { className: "grid-cols-1 mt-8 ", children: filteredEvents.map((event2) => /* @__PURE__ */ jsxDEV21(
        Link4,
        {
          className: "event-link",
          to: `/event/${event2._id}`,
          children: [
            /* @__PURE__ */ jsxDEV21("div", { className: " md:hidden w-3/4", children: /* @__PURE__ */ jsxDEV21(EventCard, { event: event2 }, void 0, !1, {
              fileName: "app/routes/event._index.jsx",
              lineNumber: 96,
              columnNumber: 17
            }, this) }, void 0, !1, {
              fileName: "app/routes/event._index.jsx",
              lineNumber: 95,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV21("div", { className: "md:flex hidden w-2/3 m-auto", children: /* @__PURE__ */ jsxDEV21(EventCard2, { event: event2, onCityUpdate: updateCity }, void 0, !1, {
              fileName: "app/routes/event._index.jsx",
              lineNumber: 99,
              columnNumber: 17
            }, this) }, void 0, !1, {
              fileName: "app/routes/event._index.jsx",
              lineNumber: 98,
              columnNumber: 15
            }, this)
          ]
        },
        event2._id,
        !0,
        {
          fileName: "app/routes/event._index.jsx",
          lineNumber: 90,
          columnNumber: 13
        },
        this
      )) }, void 0, !1, {
        fileName: "app/routes/event._index.jsx",
        lineNumber: 88,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/event._index.jsx",
      lineNumber: 80,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/event._index.jsx",
    lineNumber: 52,
    columnNumber: 5
  }, this);
}

// app/routes/users._index.jsx
var users_index_exports = {};

// app/routes/add-event.jsx
var add_event_exports = {};
__export(add_event_exports, {
  action: () => action8,
  default: () => AddEvent,
  loader: () => loader13
});
import { useEffect as useEffect7, useRef as useRef3, useState as useState10 } from "react";
import { useNavigate as useNavigate4 } from "@remix-run/react";
import { Form as Form8 } from "@remix-run/react";
import { GoogleMap as GoogleMap3, Marker as Marker2 } from "@react-google-maps/api";
import mongoose15 from "mongoose";
import { redirect as redirect6 } from "@remix-run/node";
import { jsxDEV as jsxDEV22 } from "react/jsx-dev-runtime";
var MAP_ID3 = "71f267d426ae7773";
async function loader13({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
}
function AddEvent() {
  let [image, setImage] = useState10(
    "https://placehold.co/600x400?text=Add+your+amazing+image"
  ), [location, setLocation] = useState10(null), [center] = useState10({ lat: 41.0082, lng: 28.9784 }), mapRef = useRef3(), navigate = useNavigate4(), handleMapClick = (event) => {
    setLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  }, handleCancel = () => navigate("/dashboard");
  return useEffect7(() => {
    location && mapRef.current && mapRef.current.panTo(location);
  }, [location]), /* @__PURE__ */ jsxDEV22("div", { className: "page w-full flex-col gap-y-4 justify-center mt-4 mb-4 p-8", children: [
    /* @__PURE__ */ jsxDEV22("h1", { className: "m-auto flex justify-center font-semibold text-2xl mb-6", children: "Create New Post" }, void 0, !1, {
      fileName: "app/routes/add-event.jsx",
      lineNumber: 44,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV22(
      Form8,
      {
        id: "event-form",
        method: "post",
        className: "rounded-lg font-semibold max-w-lg justify-center m-auto flex flex-col gap-y-4 p-4",
        children: [
          /* @__PURE__ */ jsxDEV22("label", { htmlFor: "title", children: "Post Title" }, void 0, !1, {
            fileName: "app/routes/add-event.jsx",
            lineNumber: 52,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV22(
            "input",
            {
              required: !0,
              id: "title",
              name: "title",
              type: "text",
              placeholder: "Write a title...",
              className: "rounded-xl p-2 border-gray-400 border"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/add-event.jsx",
              lineNumber: 53,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV22("label", { htmlFor: "description", children: "Description" }, void 0, !1, {
            fileName: "app/routes/add-event.jsx",
            lineNumber: 62,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV22(
            "textarea",
            {
              required: !0,
              id: "description",
              name: "description",
              placeholder: "Write a description...",
              className: "rounded-xl p-2 border-gray-400 border"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/add-event.jsx",
              lineNumber: 63,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV22("label", { htmlFor: "date", children: "Date" }, void 0, !1, {
            fileName: "app/routes/add-event.jsx",
            lineNumber: 71,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV22(
            "input",
            {
              required: !0,
              id: "date",
              name: "date",
              type: "date",
              className: "rounded-xl p-2 border-gray-400 border"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/add-event.jsx",
              lineNumber: 72,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV22("label", { htmlFor: "location", children: "Location" }, void 0, !1, {
            fileName: "app/routes/add-event.jsx",
            lineNumber: 80,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV22(
            "input",
            {
              id: "location",
              name: "location",
              type: "text",
              readOnly: !0,
              placeholder: "Click on the map to select a location",
              value: location ? `${location.lat}, ${location.lng}` : "",
              className: "rounded-xl p-2 border-gray-400 border"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/add-event.jsx",
              lineNumber: 81,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV22(GoogleMapLoader, { children: /* @__PURE__ */ jsxDEV22(
            GoogleMap3,
            {
              mapContainerStyle: { width: "100%", height: "400px" },
              center,
              zoom: 12,
              onClick: handleMapClick,
              onLoad: (map) => {
                mapRef.current = map, map.setOptions({
                  mapId: MAP_ID3
                });
              },
              children: location && /* @__PURE__ */ jsxDEV22(Marker2, { position: location, title: "Selected Location" }, void 0, !1, {
                fileName: "app/routes/add-event.jsx",
                lineNumber: 105,
                columnNumber: 15
              }, this)
            },
            void 0,
            !1,
            {
              fileName: "app/routes/add-event.jsx",
              lineNumber: 92,
              columnNumber: 11
            },
            this
          ) }, void 0, !1, {
            fileName: "app/routes/add-event.jsx",
            lineNumber: 91,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV22("label", { htmlFor: "image", children: "Image URL" }, void 0, !1, {
            fileName: "app/routes/add-event.jsx",
            lineNumber: 110,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV22(
            "input",
            {
              required: !0,
              id: "image",
              name: "image",
              type: "url",
              placeholder: "Paste an image URL...",
              onChange: (e) => setImage(e.target.value),
              className: "rounded-xl p-2 border-gray-400 border"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/add-event.jsx",
              lineNumber: 111,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV22("label", { htmlFor: "image-preview", children: "Image Preview" }, void 0, !1, {
            fileName: "app/routes/add-event.jsx",
            lineNumber: 121,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV22(
            "img",
            {
              id: "image-preview",
              src: image,
              alt: "Preview",
              className: "image-preview m-auto rounded-xl"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/add-event.jsx",
              lineNumber: 122,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV22("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxDEV22(
              "button",
              {
                type: "submit",
                className: "bg-accent hover:bg-primary hover:text-background p-2 rounded-lg",
                children: "Save"
              },
              void 0,
              !1,
              {
                fileName: "app/routes/add-event.jsx",
                lineNumber: 130,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV22(
              "button",
              {
                type: "button",
                className: "text-cancel p-2 rounded-lg",
                onClick: handleCancel,
                children: "Cancel"
              },
              void 0,
              !1,
              {
                fileName: "app/routes/add-event.jsx",
                lineNumber: 136,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/routes/add-event.jsx",
            lineNumber: 129,
            columnNumber: 9
          }, this)
        ]
      },
      void 0,
      !0,
      {
        fileName: "app/routes/add-event.jsx",
        lineNumber: 47,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/routes/add-event.jsx",
    lineNumber: 43,
    columnNumber: 5
  }, this);
}
async function action8({ request }) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), formData = await request.formData(), event = Object.fromEntries(formData);
  return event.creator = user._id, await mongoose15.models.Event.create(event), redirect6("/dashboard");
}

// app/routes/locations.jsx
var locations_exports = {};
__export(locations_exports, {
  default: () => Locations
});
import { Suspense } from "react";

// app/components/ShowAllLocations.jsx
import { GoogleMap as GoogleMap4, Marker as Marker3 } from "@react-google-maps/api";
import { useLoaderData as useLoaderData11 } from "@remix-run/react";
import { json as json9 } from "@remix-run/node";
import mongoose16 from "mongoose";
import { jsxDEV as jsxDEV23 } from "react/jsx-dev-runtime";
function ShowAllLocations() {
  let { locations = [] } = useLoaderData11() || {};
  return console.log("Locations to display on the map:", locations), /* @__PURE__ */ jsxDEV23(GoogleMapLoader, { children: /* @__PURE__ */ jsxDEV23(
    GoogleMap4,
    {
      mapContainerStyle: { width: "100%", height: "500px" },
      center: locations.length > 0 ? { lat: locations[0].lat, lng: locations[0].lng } : { lat: 41.015137, lng: 28.97953 },
      zoom: locations.length > 0 ? 10 : 5,
      options: {
        mapId: "71f267d426ae7773"
      },
      children: locations.map((location, index) => /* @__PURE__ */ jsxDEV23(
        Marker3,
        {
          position: { lat: location.lat, lng: location.lng },
          title: location.name
        },
        index,
        !1,
        {
          fileName: "app/components/ShowAllLocations.jsx",
          lineNumber: 50,
          columnNumber: 11
        },
        this
      ))
    },
    void 0,
    !1,
    {
      fileName: "app/components/ShowAllLocations.jsx",
      lineNumber: 37,
      columnNumber: 7
    },
    this
  ) }, void 0, !1, {
    fileName: "app/components/ShowAllLocations.jsx",
    lineNumber: 36,
    columnNumber: 5
  }, this);
}

// app/routes/locations.jsx
import { jsxDEV as jsxDEV24 } from "react/jsx-dev-runtime";
function Locations() {
  return /* @__PURE__ */ jsxDEV24("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV24("h1", { className: "text-3xl", children: "Locations" }, void 0, !1, {
      fileName: "app/routes/locations.jsx",
      lineNumber: 7,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV24(Suspense, { fallback: /* @__PURE__ */ jsxDEV24("div", { children: "Loading map..." }, void 0, !1, {
      fileName: "app/routes/locations.jsx",
      lineNumber: 8,
      columnNumber: 27
    }, this), children: /* @__PURE__ */ jsxDEV24(ShowAllLocations, {}, void 0, !1, {
      fileName: "app/routes/locations.jsx",
      lineNumber: 9,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/locations.jsx",
      lineNumber: 8,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/locations.jsx",
    lineNumber: 6,
    columnNumber: 5
  }, this);
}

// app/routes/add-post.jsx
var add_post_exports = {};
__export(add_post_exports, {
  action: () => action9,
  default: () => AddPost,
  loader: () => loader14,
  meta: () => meta8
});
import { redirect as redirect7 } from "@remix-run/node";
import { Form as Form9, useNavigate as useNavigate5 } from "@remix-run/react";
import mongoose17 from "mongoose";
import { useState as useState11 } from "react";
import { jsxDEV as jsxDEV25 } from "react/jsx-dev-runtime";
var meta8 = () => [{ title: "Remix Post App - Add New Post" }];
async function loader14({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
}
function AddPost() {
  let [image, setImage] = useState11("https://placehold.co/600x400?text=Add+your+amazing+image"), navigate = useNavigate5();
  function handleCancel() {
    navigate(-1);
  }
  return /* @__PURE__ */ jsxDEV25("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV25("h1", { children: "Add a Post" }, void 0, !1, {
      fileName: "app/routes/add-post.jsx",
      lineNumber: 27,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV25(Form9, { id: "post-form", method: "post", children: [
      /* @__PURE__ */ jsxDEV25("label", { htmlFor: "caption", children: "Caption" }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 29,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV25("input", { id: "caption", name: "caption", type: "text", "aria-label": "caption", placeholder: "Write a caption..." }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 30,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV25("label", { htmlFor: "image", children: "Image URL" }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 32,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV25("input", { name: "image", type: "url", onChange: (e) => setImage(e.target.value), placeholder: "Paste an image URL..." }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 33,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV25("label", { htmlFor: "image-preview", children: "Image Preview" }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 35,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV25(
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
      /* @__PURE__ */ jsxDEV25("div", { className: "btns", children: [
        /* @__PURE__ */ jsxDEV25("button", { children: "Save" }, void 0, !1, {
          fileName: "app/routes/add-post.jsx",
          lineNumber: 45,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV25("button", { type: "button", className: "btn-cancel", onClick: handleCancel, children: "Cancel" }, void 0, !1, {
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
async function action9({ request }) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
  console.log(user);
  let formData = await request.formData(), post = Object.fromEntries(formData);
  return post.user = user._id, await mongoose17.models.Post.create(post), redirect7("/posts");
}

// app/routes/_index.jsx
var index_exports = {};
__export(index_exports, {
  loader: () => loader15,
  meta: () => meta9
});
var meta9 = () => [{ title: "Elevation" }];
async function loader15({ request }) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
    failureRedirect: "/main-dashboard"
  });
}

// app/routes/signin.jsx
var signin_exports = {};
__export(signin_exports, {
  action: () => action10,
  default: () => SignIn,
  loader: () => loader16
});
import { json as json10 } from "@remix-run/node";
import { Form as Form10, NavLink as NavLink5, useLoaderData as useLoaderData12 } from "@remix-run/react";
import { jsxDEV as jsxDEV26 } from "react/jsx-dev-runtime";
async function loader16({ request }) {
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
  return json10({ error }, { headers });
}
function SignIn() {
  let loaderData = useLoaderData12();
  return /* @__PURE__ */ jsxDEV26(
    "div",
    {
      id: "sign-in-page",
      className: " flex flex-col justify-center items-center rounded-lg h-auto w-2/6 ml-auto mr-auto mt-24 p-4 gap-3",
      children: [
        /* @__PURE__ */ jsxDEV26("h1", { className: "text-2xl w-auto", children: "Sign In" }, void 0, !1, {
          fileName: "app/routes/signin.jsx",
          lineNumber: 35,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV26(
          Form10,
          {
            id: "sign-in-form",
            method: "post",
            className: "flex items-center flex-col gap-1 w-full",
            children: [
              /* @__PURE__ */ jsxDEV26("label", { htmlFor: "mail", children: "Email" }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 41,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV26(
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
              /* @__PURE__ */ jsxDEV26("label", { htmlFor: "password", className: "", children: "Password" }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 52,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV26(
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
              /* @__PURE__ */ jsxDEV26("div", { className: "bg-sky-500 text-white hover:bg-sky-600 transition-colors p-2 rounded-xl mt-2 w-32 flex justify-center", children: /* @__PURE__ */ jsxDEV26("button", { children: "Sign In" }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 65,
                columnNumber: 11
              }, this) }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 64,
                columnNumber: 9
              }, this),
              loaderData?.error ? /* @__PURE__ */ jsxDEV26("div", { className: "error-message", children: /* @__PURE__ */ jsxDEV26("p", { children: loaderData?.error?.message }, void 0, !1, {
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
        /* @__PURE__ */ jsxDEV26("p", { className: "flex", children: [
          "No account?",
          " ",
          /* @__PURE__ */ jsxDEV26(NavLink5, { to: "/signup", className: "text-sky-500", children: "Sign up here." }, void 0, !1, {
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
async function action10({ request }) {
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/signin"
  });
}

// app/routes/signup.jsx
var signup_exports = {};
__export(signup_exports, {
  action: () => action11,
  default: () => SignUp,
  loader: () => loader17
});
import { json as json11, redirect as redirect8 } from "@remix-run/node";
import { Form as Form11, NavLink as NavLink6, useLoaderData as useLoaderData13 } from "@remix-run/react";
import mongoose18 from "mongoose";
import { useState as useState12, useRef as useRef4, useEffect as useEffect8 } from "react";
import { jsxDEV as jsxDEV27 } from "react/jsx-dev-runtime";
async function loader17({ request }) {
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
  return json11({ error }, { headers });
}
function SignUp() {
  let loaderData = useLoaderData13(), [selectedHobbies, setSelectedHobbies] = useState12([]), [dropdownOpen, setDropdownOpen] = useState12(!1), dropdownRef = useRef4(null), sportsOptions = ["Surf", "Ski", "Kite"], toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }, handleCheckboxChange = (event) => {
    let { value, checked } = event.target;
    setSelectedHobbies(
      (prev) => checked ? [...prev, value] : prev.filter((hobby) => hobby !== value)
    );
  };
  return useEffect8(() => {
    let handleClickOutside = (event) => {
      dropdownRef.current && !dropdownRef.current.contains(event.target) && setDropdownOpen(!1);
    };
    return document.addEventListener("mousedown", handleClickOutside), () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]), /* @__PURE__ */ jsxDEV27(
    "div",
    {
      id: "sign-up-page",
      className: "flex flex-col justify-center items-center rounded-lg h-auto w-2/6 ml-auto mr-auto mt-24 mb-32 p-4 gap-3",
      children: [
        /* @__PURE__ */ jsxDEV27("h1", { className: "text-2xl w-auto", children: "Sign Up" }, void 0, !1, {
          fileName: "app/routes/signup.jsx",
          lineNumber: 65,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV27(
          Form11,
          {
            id: "sign-up-form",
            method: "post",
            className: "flex items-center flex-col gap-1 w-full",
            children: [
              /* @__PURE__ */ jsxDEV27("label", { htmlFor: "mail", children: "Email" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 71,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV27(
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
              /* @__PURE__ */ jsxDEV27("label", { htmlFor: "password", children: "Password" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 83,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV27(
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
              /* @__PURE__ */ jsxDEV27("label", { htmlFor: "firstName", children: "First name" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 94,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV27(
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
              /* @__PURE__ */ jsxDEV27("label", { htmlFor: "lastName", children: "Last name" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 104,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV27(
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
              /* @__PURE__ */ jsxDEV27("label", { children: "Select your hobbies:" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 114,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV27("div", { className: "relative", ref: dropdownRef, children: [
                /* @__PURE__ */ jsxDEV27(
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
                dropdownOpen && /* @__PURE__ */ jsxDEV27("div", { className: "absolute top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-10", children: sportsOptions.map((sport) => /* @__PURE__ */ jsxDEV27("label", { className: "block p-2", children: [
                  /* @__PURE__ */ jsxDEV27(
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
              /* @__PURE__ */ jsxDEV27("div", { className: "mt-2", children: selectedHobbies.length > 0 && /* @__PURE__ */ jsxDEV27("div", { className: "p-2 bg-gray-100 border rounded-lg", children: [
                /* @__PURE__ */ jsxDEV27("strong", { children: "Selected Hobbies:" }, void 0, !1, {
                  fileName: "app/routes/signup.jsx",
                  lineNumber: 144,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV27("p", { children: selectedHobbies.join(", ") }, void 0, !1, {
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
              /* @__PURE__ */ jsxDEV27(
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
              /* @__PURE__ */ jsxDEV27("div", { className: "bg-sky-500 text-white hover:bg-sky-600 transition-colors p-2 rounded-xl mt-2 w-32 flex justify-center", children: /* @__PURE__ */ jsxDEV27("button", { children: "Sign Up" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 157,
                columnNumber: 11
              }, this) }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 156,
                columnNumber: 9
              }, this),
              loaderData?.error ? /* @__PURE__ */ jsxDEV27("div", { className: "error-message", children: /* @__PURE__ */ jsxDEV27("p", { children: loaderData?.error?.message }, void 0, !1, {
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
        /* @__PURE__ */ jsxDEV27("p", { children: [
          "Already have an account?",
          " ",
          /* @__PURE__ */ jsxDEV27(NavLink6, { to: "/signin", className: "text-sky-500", children: "Sign in here." }, void 0, !1, {
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
async function action11({ request }) {
  try {
    let formData = await request.formData(), newUser = Object.fromEntries(formData);
    return newUser.selectedHobbies = JSON.parse(newUser.selectedHobbies || "[]"), await mongoose18.models.User.create({
      mail: newUser.mail,
      password: newUser.password,
      name: newUser.name,
      lastname: newUser.lastName,
      // Capturing lastname here
      hobbies: newUser.selectedHobbies
      // Optional, based on schema
    }), redirect8("/signin");
  } catch (error) {
    return console.log(error), redirect8("/signup");
  }
}

// app/routes/error.jsx
var error_exports = {};
__export(error_exports, {
  default: () => Example
});
import { Link as Link5 } from "react-router-dom";
import { Fragment, jsxDEV as jsxDEV28 } from "react/jsx-dev-runtime";
function Example() {
  return /* @__PURE__ */ jsxDEV28(Fragment, { children: /* @__PURE__ */ jsxDEV28("main", { className: "relative isolate min-h-full", children: [
    /* @__PURE__ */ jsxDEV28(
      "img",
      {
        src: "https://cdn.pixabay.com/photo/2017/08/10/01/11/field-2616740_1280.jpg",
        alt: "",
        className: "absolute inset-0 -z-10 h-full w-full object-cover ",
        style: {
          filter: "grayscale(100%) contrast(1.5) brightness(0.7)",
          backgroundPosition: "center"
        }
      },
      void 0,
      !1,
      {
        fileName: "app/routes/error.jsx",
        lineNumber: 6,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV28("div", { className: "mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8 text-gray-50", children: [
      /* @__PURE__ */ jsxDEV28("p", { className: "text-base font-semibold leading-8 text-white", children: "404" }, void 0, !1, {
        fileName: "app/routes/error.jsx",
        lineNumber: 16,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV28("h1", { className: "mt-4 text-3xl font-bold tracking-tight  sm:text-5xl", children: "Page not found" }, void 0, !1, {
        fileName: "app/routes/error.jsx",
        lineNumber: 17,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV28("p", { className: "mt-4 text-base  sm:mt-6", children: "Sorry, we couldn\u2019t find the page you\u2019re looking for." }, void 0, !1, {
        fileName: "app/routes/error.jsx",
        lineNumber: 20,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV28("div", { className: "mt-10 flex justify-center", children: /* @__PURE__ */ jsxDEV28(Link5, { to: "/event", className: "text-sm font-semibold leading-7 ", children: [
        /* @__PURE__ */ jsxDEV28("span", { "aria-hidden": "true", children: "\u2190" }, void 0, !1, {
          fileName: "app/routes/error.jsx",
          lineNumber: 25,
          columnNumber: 15
        }, this),
        " Back to home"
      ] }, void 0, !0, {
        fileName: "app/routes/error.jsx",
        lineNumber: 24,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/error.jsx",
        lineNumber: 23,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/error.jsx",
      lineNumber: 15,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/error.jsx",
    lineNumber: 5,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/error.jsx",
    lineNumber: 4,
    columnNumber: 5
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-7HXZCFKR.js", imports: ["/build/_shared/chunk-ZWGWGGVF.js", "/build/_shared/chunk-KKDHQITS.js", "/build/_shared/chunk-LMGUNZ3X.js", "/build/_shared/chunk-GIAAE3CH.js", "/build/_shared/chunk-XU7DNSPJ.js", "/build/_shared/chunk-BOXFZXVX.js", "/build/_shared/chunk-HKPYBBGK.js", "/build/_shared/chunk-UWV35TSL.js", "/build/_shared/chunk-PNG5AS42.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-WESIGUZO.js", imports: ["/build/_shared/chunk-SARLQUTN.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-LOWTLRSB.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/add-event": { id: "routes/add-event", parentId: "root", path: "add-event", index: void 0, caseSensitive: void 0, module: "/build/routes/add-event-V35D6V6Z.js", imports: ["/build/_shared/chunk-UF522VHO.js", "/build/_shared/chunk-NMZL6IDN.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/add-post": { id: "routes/add-post", parentId: "root", path: "add-post", index: void 0, caseSensitive: void 0, module: "/build/routes/add-post-4L7ESQ5R.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/dashboard._index": { id: "routes/dashboard._index", parentId: "root", path: "dashboard", index: !0, caseSensitive: void 0, module: "/build/routes/dashboard._index-PMASWRB4.js", imports: ["/build/_shared/chunk-OJNHMBS7.js", "/build/_shared/chunk-LRDY7B4L.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/error": { id: "routes/error", parentId: "root", path: "error", index: void 0, caseSensitive: void 0, module: "/build/routes/error-HSYC2SWZ.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/event.$eventId": { id: "routes/event.$eventId", parentId: "root", path: "event/:eventId", index: void 0, caseSensitive: void 0, module: "/build/routes/event.$eventId-ES5OUOAN.js", imports: ["/build/_shared/chunk-UF522VHO.js", "/build/_shared/chunk-NMZL6IDN.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/event.$eventId.destroy": { id: "routes/event.$eventId.destroy", parentId: "routes/event.$eventId", path: "destroy", index: void 0, caseSensitive: void 0, module: "/build/routes/event.$eventId.destroy-IHPZH4G4.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/event.$eventId_.update": { id: "routes/event.$eventId_.update", parentId: "root", path: "event/:eventId/update", index: void 0, caseSensitive: void 0, module: "/build/routes/event.$eventId_.update-JO64TKNS.js", imports: ["/build/_shared/chunk-UF522VHO.js", "/build/_shared/chunk-NMZL6IDN.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/event._index": { id: "routes/event._index", parentId: "root", path: "event", index: !0, caseSensitive: void 0, module: "/build/routes/event._index-7FBD3FXD.js", imports: ["/build/_shared/chunk-LRDY7B4L.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/locations": { id: "routes/locations", parentId: "root", path: "locations", index: void 0, caseSensitive: void 0, module: "/build/routes/locations-6RGMJYPN.js", imports: ["/build/_shared/chunk-UF522VHO.js", "/build/_shared/chunk-NMZL6IDN.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/main-dashboard": { id: "routes/main-dashboard", parentId: "root", path: "main-dashboard", index: void 0, caseSensitive: void 0, module: "/build/routes/main-dashboard-V5VWDNYW.js", imports: ["/build/_shared/chunk-OJNHMBS7.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId": { id: "routes/posts.$postId", parentId: "root", path: "posts/:postId", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId-HMMO6SZ2.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId.destroy": { id: "routes/posts.$postId.destroy", parentId: "routes/posts.$postId", path: "destroy", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId.destroy-QJD7CVP4.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId_.update": { id: "routes/posts.$postId_.update", parentId: "root", path: "posts/:postId/update", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId_.update-32ZHGPIC.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/profile.$userId": { id: "routes/profile.$userId", parentId: "root", path: "profile/:userId", index: void 0, caseSensitive: void 0, module: "/build/routes/profile.$userId-BCNZ54EX.js", imports: ["/build/_shared/chunk-LRDY7B4L.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/profile.$userId_.update": { id: "routes/profile.$userId_.update", parentId: "root", path: "profile/:userId/update", index: void 0, caseSensitive: void 0, module: "/build/routes/profile.$userId_.update-QTG4DGRU.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/signin": { id: "routes/signin", parentId: "root", path: "signin", index: void 0, caseSensitive: void 0, module: "/build/routes/signin-E5UMBJ46.js", imports: ["/build/_shared/chunk-QUYRSHBJ.js", "/build/_shared/chunk-G7CHZRZX.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/signup": { id: "routes/signup", parentId: "root", path: "signup", index: void 0, caseSensitive: void 0, module: "/build/routes/signup-SDPVZWSB.js", imports: ["/build/_shared/chunk-QUYRSHBJ.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/userProfile.$userId": { id: "routes/userProfile.$userId", parentId: "root", path: "userProfile/:userId", index: void 0, caseSensitive: void 0, module: "/build/routes/userProfile.$userId-VVJCXQPJ.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/users._index": { id: "routes/users._index", parentId: "root", path: "users", index: !0, caseSensitive: void 0, module: "/build/routes/users._index-6AIM527Q.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "08018d18", hmr: { runtime: "/build/_shared/chunk-HKPYBBGK.js", timestamp: 1733477989318 }, url: "/build/manifest-08018D18.js" };

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
  "routes/profile.$userId_.update": {
    id: "routes/profile.$userId_.update",
    parentId: "root",
    path: "profile/:userId/update",
    index: void 0,
    caseSensitive: void 0,
    module: profile_userId_update_exports
  },
  "routes/event.$eventId.destroy": {
    id: "routes/event.$eventId.destroy",
    parentId: "routes/event.$eventId",
    path: "destroy",
    index: void 0,
    caseSensitive: void 0,
    module: event_eventId_destroy_exports
  },
  "routes/event.$eventId_.update": {
    id: "routes/event.$eventId_.update",
    parentId: "root",
    path: "event/:eventId/update",
    index: void 0,
    caseSensitive: void 0,
    module: event_eventId_update_exports
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
  "routes/userProfile.$userId": {
    id: "routes/userProfile.$userId",
    parentId: "root",
    path: "userProfile/:userId",
    index: void 0,
    caseSensitive: void 0,
    module: userProfile_userId_exports
  },
  "routes/dashboard._index": {
    id: "routes/dashboard._index",
    parentId: "root",
    path: "dashboard",
    index: !0,
    caseSensitive: void 0,
    module: dashboard_index_exports
  },
  "routes/profile.$userId": {
    id: "routes/profile.$userId",
    parentId: "root",
    path: "profile/:userId",
    index: void 0,
    caseSensitive: void 0,
    module: profile_userId_exports
  },
  "routes/event.$eventId": {
    id: "routes/event.$eventId",
    parentId: "root",
    path: "event/:eventId",
    index: void 0,
    caseSensitive: void 0,
    module: event_eventId_exports
  },
  "routes/main-dashboard": {
    id: "routes/main-dashboard",
    parentId: "root",
    path: "main-dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: main_dashboard_exports
  },
  "routes/posts.$postId": {
    id: "routes/posts.$postId",
    parentId: "root",
    path: "posts/:postId",
    index: void 0,
    caseSensitive: void 0,
    module: posts_postId_exports
  },
  "routes/event._index": {
    id: "routes/event._index",
    parentId: "root",
    path: "event",
    index: !0,
    caseSensitive: void 0,
    module: event_index_exports
  },
  "routes/users._index": {
    id: "routes/users._index",
    parentId: "root",
    path: "users",
    index: !0,
    caseSensitive: void 0,
    module: users_index_exports
  },
  "routes/add-event": {
    id: "routes/add-event",
    parentId: "root",
    path: "add-event",
    index: void 0,
    caseSensitive: void 0,
    module: add_event_exports
  },
  "routes/locations": {
    id: "routes/locations",
    parentId: "root",
    path: "locations",
    index: void 0,
    caseSensitive: void 0,
    module: locations_exports
  },
  "routes/add-post": {
    id: "routes/add-post",
    parentId: "root",
    path: "add-post",
    index: void 0,
    caseSensitive: void 0,
    module: add_post_exports
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
  },
  "routes/error": {
    id: "routes/error",
    parentId: "root",
    path: "error",
    index: void 0,
    caseSensitive: void 0,
    module: error_exports
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
