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
        ref: "Events"
      }
    ],
    eventsAttending: [
      {
        type: mongoose2.Schema.Types.ObjectId,
        ref: "Events"
      }
    ]
  },
  { timestamps: !0 }
), User = mongoose2.model("User", userSchema);
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
    password: await hashPassword("1234")
  });
  console.log(test);
  let test2 = await User2.create({
    mail: "test2@test2.dk",
    name: "Tester test",
    eventsCreated: [],
    eventsAttending: [],
    password: await hashPassword("1234")
  }), event4 = await Event2.create({
    date: new Date(2021, 4, 1),
    image: "https://images.unsplash.com/photo-1566241832378-917a0f30db2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    title: 101,
    creator: test._id,
    location: "aa",
    description: "A beautiful sunset at the beach in Aarhus",
    attendees: [test2._id]
  }), event5 = await Event2.create({
    date: new Date(2021, 4, 1),
    image: "https://images.unsplash.com/photo-1566241832378-917a0f30db2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    title: "Bike ride",
    creator: test._id,
    location: "aa",
    description: "A beautiful bike ride in Silkeborg",
    attendees: [test2._id]
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
var tailwind_default = "/build/_assets/tailwind-JB7DJAU2.css";

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
            lineNumber: 74,
            columnNumber: 19
          },
          this
        ) }, void 0, !1, {
          fileName: "app/components/Nav.jsx",
          lineNumber: 73,
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
              lineNumber: 95,
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
                lineNumber: 99,
                columnNumber: 19
              },
              this
            ) : /* @__PURE__ */ jsxDEV2("span", { className: "block", children: "\u2630" }, void 0, !1, {
              fileName: "app/components/Nav.jsx",
              lineNumber: 97,
              columnNumber: 19
            }, this)
          ]
        },
        void 0,
        !0,
        {
          fileName: "app/components/Nav.jsx",
          lineNumber: 91,
          columnNumber: 15
        },
        this
      ) }, void 0, !1, {
        fileName: "app/components/Nav.jsx",
        lineNumber: 90,
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
              lineNumber: 118,
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
              lineNumber: 129,
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
              lineNumber: 140,
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
        lineNumber: 114,
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
  return /* @__PURE__ */ jsxDEV3("nav", { className: "flex shadow-md justify-between md:justify-items-end items-center", children: [
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
          className: "mx-2  bg-gray-100 hover:bg-gray-200 rounded-xl p-2",
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
  return /* @__PURE__ */ jsxDEV5(
    "html",
    {
      lang: "en",
      className: "bg-gradient-to-t from-blue-50 to-cyan-200 bg-cover bg-no-repeat min-h-screen",
      children: [
        /* @__PURE__ */ jsxDEV5("head", { children: [
          /* @__PURE__ */ jsxDEV5("meta", { charSet: "utf-8" }, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 34,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV5("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 35,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV5(Meta, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 36,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV5(Links, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 37,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/root.jsx",
          lineNumber: 33,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV5("body", { className: "", children: [
          user ? /* @__PURE__ */ jsxDEV5(Nav, { user }, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 40,
            columnNumber: 17
          }, this) : /* @__PURE__ */ jsxDEV5(Nav2, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 40,
            columnNumber: 39
          }, this),
          /* @__PURE__ */ jsxDEV5(Outlet, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 42,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV5(ScrollRestoration, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 43,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV5(Scripts, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 44,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV5(LiveReload, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 45,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV5(Footer, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 46,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/root.jsx",
          lineNumber: 39,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/root.jsx",
      lineNumber: 29,
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
  let user = await mongoose4.models.User.findById(params.userId), userUpdated = await mongoose4.models.User.findOneAndUpdate(user._id).select("+password");
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
      lineNumber: 33,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV6(Form, { method: "post", className: "rounded-lg font-semibold max-w-lg justify-center m-auto flex flex-col gap-y-4 p-4", children: [
      /* @__PURE__ */ jsxDEV6("label", { htmlFor: "name", children: " Name" }, void 0, !1, {
        fileName: "app/routes/profile.$userId_.update.jsx",
        lineNumber: 36,
        columnNumber: 11
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
          lineNumber: 37,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV6("label", { htmlFor: "mail", children: "Mail" }, void 0, !1, {
        fileName: "app/routes/profile.$userId_.update.jsx",
        lineNumber: 45,
        columnNumber: 11
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
          lineNumber: 46,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV6("label", { htmlFor: "password", children: "Password" }, void 0, !1, {
        fileName: "app/routes/profile.$userId_.update.jsx",
        lineNumber: 54,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV6(
        "input",
        {
          type: "password",
          id: "password",
          name: "password",
          placeholder: "Password",
          className: "rounded-xl p-2  border-gray-400 border"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/profile.$userId_.update.jsx",
          lineNumber: 55,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV6("button", { className: "bg-accent hover:bg-primary hover:text-background p-2 rounded-lg mt-4", children: "Update" }, void 0, !1, {
        fileName: "app/routes/profile.$userId_.update.jsx",
        lineNumber: 62,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV6("button", { type: "button", className: "btn-cancel text-cancel", onClick: handleCancel, children: "cancel" }, void 0, !1, {
        fileName: "app/routes/profile.$userId_.update.jsx",
        lineNumber: 65,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/profile.$userId_.update.jsx",
      lineNumber: 35,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/profile.$userId_.update.jsx",
    lineNumber: 32,
    columnNumber: 5
  }, this);
}
async function action({ request }) {
  let authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), formData = new URLSearchParams(await request.text()), name = formData.get("name"), mail = formData.get("mail"), password = formData.get("password");
  try {
    let userToUpdate = await mongoose4.models.User.findOne({ _id: authUser._id });
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
  loader: () => loader4,
  meta: () => meta2
});
import { json as json2, redirect as redirect2 } from "@remix-run/node";
import { Form as Form2, useLoaderData as useLoaderData3, useNavigate as useNavigate2 } from "@remix-run/react";
import mongoose6 from "mongoose";
import { useState as useState2 } from "react";
import { jsxDEV as jsxDEV7 } from "react/jsx-dev-runtime";
function meta2() {
  return [
    {
      title: "Trailblaze - Update event"
    }
  ];
}
async function loader4({ request, params }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
  let event = await mongoose6.models.Event.findById(params.eventId).populate("creator");
  return json2({ event });
}
function UpdateEvent() {
  let { event } = useLoaderData3(), [image, setImage] = useState2(event.image), navigate = useNavigate2();
  function handleCancel() {
    navigate(-1);
  }
  return /* @__PURE__ */ jsxDEV7("div", { className: "page w-full flex-col gap-y-4 justify-center mt-4 mb-4 p-8 ", children: [
    /* @__PURE__ */ jsxDEV7("h1", { className: "m-auto flex justify-center font-semibold text-2xl mb-6", children: "Update Event" }, void 0, !1, {
      fileName: "app/routes/event.$eventId_.update.jsx",
      lineNumber: 35,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV7(Form2, { id: "event-form", method: "post", className: "rounded-lg font-semibold max-w-lg justify-center m-auto flex flex-col gap-y-4 p-4", children: [
      /* @__PURE__ */ jsxDEV7("label", { htmlFor: "title", children: "Title" }, void 0, !1, {
        fileName: "app/routes/event.$eventId_.update.jsx",
        lineNumber: 37,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV7(
        "input",
        {
          id: "title",
          defaultValue: event.title,
          name: "title",
          type: "text",
          "aria-label": "title",
          placeholder: "Write a title...",
          className: "rounded-xl p-2  border-gray-400 border"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/event.$eventId_.update.jsx",
          lineNumber: 38,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV7("label", { htmlFor: "description", children: "Description" }, void 0, !1, {
        fileName: "app/routes/event.$eventId_.update.jsx",
        lineNumber: 48,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV7(
        "textarea",
        {
          id: "description",
          name: "description",
          type: "text",
          "aria-label": "description",
          placeholder: "Write a description...",
          defaultValue: event.description,
          className: "rounded-xl p-2  border-gray-400 border"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/event.$eventId_.update.jsx",
          lineNumber: 49,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV7("label", { htmlFor: "location", children: "Location" }, void 0, !1, {
        fileName: "app/routes/event.$eventId_.update.jsx",
        lineNumber: 58,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV7(
        "input",
        {
          id: "location",
          name: "location",
          type: "text",
          "aria-label": "location",
          placeholder: "Write a location...",
          defaultValue: event.location,
          className: "rounded-xl p-2  border-gray-400 border"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/event.$eventId_.update.jsx",
          lineNumber: 59,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV7("label", { htmlFor: "date", children: "Date" }, void 0, !1, {
        fileName: "app/routes/event.$eventId_.update.jsx",
        lineNumber: 69,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV7(
        "input",
        {
          id: "date",
          name: "date",
          type: "date",
          "aria-label": "date",
          defaultValue: new Date(event.date).toISOString().split("T")[0],
          className: "rounded-xl p-2  border-gray-400 border"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/event.$eventId_.update.jsx",
          lineNumber: 70,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV7("label", { htmlFor: "image", children: "Image URL" }, void 0, !1, {
        fileName: "app/routes/event.$eventId_.update.jsx",
        lineNumber: 79,
        columnNumber: 1
      }, this),
      /* @__PURE__ */ jsxDEV7(
        "input",
        {
          name: "image",
          defaultValue: event.image,
          type: "url",
          onChange: (e) => setImage(e.target.value),
          placeholder: "Paste an image URL...",
          className: "rounded-xl p-2  border-gray-400 border"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/event.$eventId_.update.jsx",
          lineNumber: 80,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV7("label", { htmlFor: "image-preview", children: "Image Preview" }, void 0, !1, {
        fileName: "app/routes/event.$eventId_.update.jsx",
        lineNumber: 89,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV7(
        "img",
        {
          id: "image-preview",
          className: "m-auto rounded-xl",
          src: image || "https://placehold.co/600x400?text=Paste+an+image+URL",
          alt: "Choose",
          onError: (e) => e.target.src = "https://placehold.co/600x400?text=Error+loading+image"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/event.$eventId_.update.jsx",
          lineNumber: 90,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV7("input", { name: "uid", type: "text", defaultValue: event.uid, hidden: !0 }, void 0, !1, {
        fileName: "app/routes/event.$eventId_.update.jsx",
        lineNumber: 98,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV7("div", { className: "btns ", children: [
        /* @__PURE__ */ jsxDEV7("button", { className: "bg-accent hover:bg-primary hover:text-background p-2 rounded-lg mr-6", children: "Save" }, void 0, !1, {
          fileName: "app/routes/event.$eventId_.update.jsx",
          lineNumber: 100,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV7("button", { type: "button", className: "btn-cancel text-cancel", onClick: handleCancel, children: "Cancel" }, void 0, !1, {
          fileName: "app/routes/event.$eventId_.update.jsx",
          lineNumber: 101,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/event.$eventId_.update.jsx",
        lineNumber: 99,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/event.$eventId_.update.jsx",
      lineNumber: 36,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/event.$eventId_.update.jsx",
    lineNumber: 34,
    columnNumber: 5
  }, this);
}
async function action3({ request, params }) {
  let authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), eventToUpdate = await mongoose6.models.Event.findById(params.eventId);
  if (eventToUpdate.creator.toString() !== authUser._id.toString())
    return redirect2(`/event/${params.eventId}`);
  let formData = await request.formData(), event = Object.fromEntries(formData);
  return eventToUpdate.title = event.title, eventToUpdate.image = event.image, eventToUpdate.description = event.description, eventToUpdate.date = event.date, eventToUpdate.location = event.location, await eventToUpdate.save(), redirect2(`/event/${params.eventId}`);
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
  meta: () => meta3
});
import { json as json3, redirect as redirect4 } from "@remix-run/node";
import { Form as Form3, useLoaderData as useLoaderData4, useNavigate as useNavigate3 } from "@remix-run/react";
import mongoose8 from "mongoose";
import { useState as useState3 } from "react";
import { jsxDEV as jsxDEV8 } from "react/jsx-dev-runtime";
function meta3() {
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
  return /* @__PURE__ */ jsxDEV8("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV8("h1", { children: "Update Post" }, void 0, !1, {
      fileName: "app/routes/posts.$postId_.update.jsx",
      lineNumber: 35,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV8(Form3, { id: "post-form", method: "post", children: [
      /* @__PURE__ */ jsxDEV8("label", { htmlFor: "caption", children: "Caption" }, void 0, !1, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 37,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV8(
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
      /* @__PURE__ */ jsxDEV8("label", { htmlFor: "image", children: "Image URL" }, void 0, !1, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 46,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV8(
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
      /* @__PURE__ */ jsxDEV8("label", { htmlFor: "image-preview", children: "Image Preview" }, void 0, !1, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 55,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV8(
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
      /* @__PURE__ */ jsxDEV8("input", { name: "uid", type: "text", defaultValue: post.uid, hidden: !0 }, void 0, !1, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 64,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV8("div", { className: "btns", children: [
        /* @__PURE__ */ jsxDEV8("button", { children: "Save" }, void 0, !1, {
          fileName: "app/routes/posts.$postId_.update.jsx",
          lineNumber: 66,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV8("button", { type: "button", className: "btn-cancel", onClick: handleCancel, children: "Cancel" }, void 0, !1, {
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

// app/routes/dashboard._index.jsx
var dashboard_index_exports = {};
__export(dashboard_index_exports, {
  default: () => Index,
  loader: () => loader7,
  meta: () => meta4
});
import { json as json4 } from "@remix-run/node";
import { Link, useLoaderData as useLoaderData5 } from "@remix-run/react";
import mongoose9 from "mongoose";

// app/components/DashboardData.jsx
import { useEffect as useEffect2, useState as useState4 } from "react";
import { jsxDEV as jsxDEV9 } from "react/jsx-dev-runtime";
var DashboardData = () => {
  let [weatherData, setWeatherData] = useState4(null), [city, setCity] = useState4("Loading..."), [country, setCountry] = useState4(""), [inputCity, setInputCity] = useState4(""), [error, setError] = useState4(""), [activeTab, setActiveTab] = useState4("wind"), apiKey = "84c59fa875b07f0e54b6dd1ce011f187", fetchWeatherData = async (city2) => {
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city2}&appid=${apiKey}&units=metric`;
    try {
      let response = await fetch(apiUrl);
      if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Error: ${errorText}`);
      }
      let data = await response.json();
      setWeatherData(data), setError(""), setCountry(data.city.country);
    } catch (error2) {
      console.error("Error fetching weather data:", error2), setError("Could not fetch weather data. Please try another city.");
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
    navigator.geolocation ? navigator.geolocation.getCurrentPosition(
      (position) => {
        let { latitude, longitude } = position.coords;
        fetchCityByCoordinates(latitude, longitude);
      },
      () => {
        setCity("Copenhagen"), setCountry("DK");
      }
    ) : (setCity("Copenhagen"), setCountry("DK"));
  };
  useEffect2(() => {
    getUserLocation();
  }, []), useEffect2(() => {
    city !== "Loading..." && fetchWeatherData(city);
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
  return /* @__PURE__ */ jsxDEV9("div", { className: "flex flex-col p-4", children: [
    /* @__PURE__ */ jsxDEV9("form", { className: "flex justify-center mt-20", onSubmit: handleSearch, children: [
      /* @__PURE__ */ jsxDEV9(
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
          lineNumber: 123,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV9("button", { className: "bg-slate-50 rounded-r-2xl p-2", type: "submit", children: "\u{1F50D}" }, void 0, !1, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 130,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 122,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV9("div", { className: "flex flex-col md:flex-row", children: [
      /* @__PURE__ */ jsxDEV9("div", { className: "md:w-3/6 md:justify-center md:mx-auto", children: [
        /* @__PURE__ */ jsxDEV9("div", { className: "mt-4 flex justify-center flex-col", children: /* @__PURE__ */ jsxDEV9("div", { children: [
          /* @__PURE__ */ jsxDEV9("h1", { className: "text-7xl font-bold text-center mt-2 capitalize", children: city }, void 0, !1, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 138,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV9("p", { className: "text-4xl font-semibold text-center", children: [
            " ",
            country
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 141,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 137,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 136,
          columnNumber: 11
        }, this),
        error && /* @__PURE__ */ jsxDEV9("p", { className: "text-red-500 text-center", children: error }, void 0, !1, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 145,
          columnNumber: 21
        }, this),
        weatherData ? /* @__PURE__ */ jsxDEV9("div", { className: "bg-s-100 rounded-xl w-full p-6 mt-4 mx-auto", children: [
          /* @__PURE__ */ jsxDEV9("p", { className: "text-3xl flex items-center gap-3", children: [
            "\u{1F321} ",
            weatherData.list[0].main.temp,
            " \xB0C"
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 149,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV9("p", { children: [
            "Feels Like: ",
            weatherData.list[0].main.feels_like,
            " \xB0C"
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 152,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV9("p", { children: [
            "Min Temp: ",
            weatherData.list[0].main.temp_min,
            " \xB0C"
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 153,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV9("p", { children: [
            "Max Temp: ",
            weatherData.list[0].main.temp_max,
            " \xB0C"
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 154,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV9("p", { className: "text-3xl flex items-center gap-3", children: [
            getWeatherEmoji(weatherData.list[0].weather[0].description),
            " ",
            weatherData.list[0].weather[0].description
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 155,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV9("p", { children: [
            "Rain:",
            " ",
            weatherData.list[0].rain ? weatherData.list[0].rain["3h"] : 0,
            " ",
            "mm"
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 159,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV9("p", { className: "text-3xl flex items-center gap-3", children: [
            "\u{1F4A8} ",
            weatherData.list[0].wind.speed,
            " m/s"
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 164,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV9("p", { children: [
            "Wind Direction: ",
            getWindDirection(weatherData.list[0].wind.deg),
            " ",
            "(",
            weatherData.list[0].wind.deg,
            "\xB0)"
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 167,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 148,
          columnNumber: 13
        }, this) : /* @__PURE__ */ jsxDEV9("p", { className: "text-center mt-4", children: "Loading weather data..." }, void 0, !1, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 173,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 135,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV9("div", { className: "w-full h-96 pl-4", children: [
        /* @__PURE__ */ jsxDEV9("div", { className: "flex mt-4", children: [
          /* @__PURE__ */ jsxDEV9(
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
              lineNumber: 179,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV9(
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
              lineNumber: 189,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV9(
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
              lineNumber: 199,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 178,
          columnNumber: 11
        }, this),
        activeTab === "wind" && weatherData && /* @__PURE__ */ jsxDEV9(
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
            lineNumber: 212,
            columnNumber: 13
          },
          this
        ),
        activeTab === "swell" && weatherData && /* @__PURE__ */ jsxDEV9(
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
            lineNumber: 220,
            columnNumber: 13
          },
          this
        ),
        activeTab === "temp" && weatherData && /* @__PURE__ */ jsxDEV9(
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
            lineNumber: 228,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 177,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 134,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/DashboardData.jsx",
    lineNumber: 121,
    columnNumber: 5
  }, this);
}, DashboardData_default = DashboardData;

// app/components/EventListCards.jsx
import { jsxDEV as jsxDEV10 } from "react/jsx-dev-runtime";
function EventCard({ event }) {
  return event ? /* @__PURE__ */ jsxDEV10("article", { className: "flex m-4  p-4 rounded-xl shadow-lg w-full overflow-hidden flex-col bg-slate-50", children: [
    /* @__PURE__ */ jsxDEV10("img", { className: "rounded-xl", src: event?.image, alt: "" }, void 0, !1, {
      fileName: "app/components/EventListCards.jsx",
      lineNumber: 8,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV10("div", { className: "grid grid-cols-3 p-2 ", children: [
      /* @__PURE__ */ jsxDEV10("p", { children: event?.creator?.name }, void 0, !1, {
        fileName: "app/components/EventListCards.jsx",
        lineNumber: 10,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV10("h2", { children: event.title }, void 0, !1, {
        fileName: "app/components/EventListCards.jsx",
        lineNumber: 11,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV10("p", { children: [
        "Date: ",
        new Date(event.date).toLocaleDateString("en-GB")
      ] }, void 0, !0, {
        fileName: "app/components/EventListCards.jsx",
        lineNumber: 12,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV10("p", { children: [
        "Location: ",
        event.location
      ] }, void 0, !0, {
        fileName: "app/components/EventListCards.jsx",
        lineNumber: 13,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV10("p", { className: "truncate", children: [
        "Description: ",
        event.description
      ] }, void 0, !0, {
        fileName: "app/components/EventListCards.jsx",
        lineNumber: 14,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV10("p", { className: "mt-4 flex items-center font-semibold", children: [
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
  }, this) : /* @__PURE__ */ jsxDEV10("p", { children: "No event found." }, void 0, !1, {
    fileName: "app/components/EventListCards.jsx",
    lineNumber: 3,
    columnNumber: 12
  }, this);
}

// app/components/EventCard.jsx
import { useEffect as useEffect3, useState as useState5 } from "react";
import axios from "axios";
import { jsxDEV as jsxDEV11 } from "react/jsx-dev-runtime";
function EventCard2({ event }) {
  let [city, setCity] = useState5(null), fetchCityFromCoordinates = async (lat, lng) => {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyC8mGRx4SS4NLfyl7AIOhktrM_F9EOHWYQ`;
    try {
      let response = await axios.get(url);
      console.log("Google Maps API Response:", response.data);
      let results = response.data.results;
      if (results.length > 0) {
        let addressComponents = results[0].address_components;
        console.log("Address Components:", addressComponents);
        let nearestCity = addressComponents.find(
          (component) => component.types.includes("locality") || component.types.includes("administrative_area_level_1")
        )?.long_name || addressComponents.find(
          (component) => component.types.includes("administrative_area_level_2")
        )?.long_name || "Unknown location";
        console.log("Nearest City:", nearestCity), setCity(nearestCity);
      } else
        console.log("No results found for coordinates."), setCity("Unknown location");
    } catch (error) {
      console.error("Error fetching city:", error), setCity("Error fetching location");
    }
  };
  return useEffect3(() => {
    if (event.location) {
      let [lat, lng] = event.location.split(",").map((coord) => parseFloat(coord.trim()));
      !isNaN(lat) && !isNaN(lng) ? (console.log("Event Coordinates:", lat, lng), fetchCityFromCoordinates(lat, lng)) : (console.log("Invalid event coordinates:", event.location), setCity("No location available"));
    } else
      console.log("No location data found for event."), setCity("No location available");
  }, [event.location]), useEffect3(() => {
    console.log("City state updated:", city);
  }, [city]), /* @__PURE__ */ jsxDEV11("article", { className: "flex p-4 rounded-xl shadow-lg w-full bg-slate-50", children: [
    /* @__PURE__ */ jsxDEV11(
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
        lineNumber: 71,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV11("div", { className: "flex flex-col w-full", children: [
      /* @__PURE__ */ jsxDEV11("div", { className: "p-2 ml-4", children: [
        /* @__PURE__ */ jsxDEV11("h2", { className: "text-xl font-bold mb-2", children: event.title }, void 0, !1, {
          fileName: "app/components/EventCard.jsx",
          lineNumber: 81,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV11("p", { className: "text-gray-500", children: event?.creator?.name }, void 0, !1, {
          fileName: "app/components/EventCard.jsx",
          lineNumber: 82,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/EventCard.jsx",
        lineNumber: 80,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV11("div", { className: "flex flex-col flex-grow ml-4", children: [
        /* @__PURE__ */ jsxDEV11("div", { className: "flex p-2", children: /* @__PURE__ */ jsxDEV11("div", { className: "col-span-2", children: [
          /* @__PURE__ */ jsxDEV11("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxDEV11("h3", { className: "font-semibold mr-1", children: "Date: " }, void 0, !1, {
              fileName: "app/components/EventCard.jsx",
              lineNumber: 88,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV11("p", { children: new Date(event.date).toLocaleDateString("en-GB") }, void 0, !1, {
              fileName: "app/components/EventCard.jsx",
              lineNumber: 89,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/components/EventCard.jsx",
            lineNumber: 87,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV11("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsxDEV11("h3", { className: "mr-1 font-semibold", children: "Location: " }, void 0, !1, {
              fileName: "app/components/EventCard.jsx",
              lineNumber: 92,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV11("p", { children: city || "Fetching city..." }, void 0, !1, {
              fileName: "app/components/EventCard.jsx",
              lineNumber: 93,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/components/EventCard.jsx",
            lineNumber: 91,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/components/EventCard.jsx",
          lineNumber: 86,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/components/EventCard.jsx",
          lineNumber: 85,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV11("div", { className: "grid grid-cols-1 mt-4 ml-2", children: [
          /* @__PURE__ */ jsxDEV11("h3", { className: "mb-2 font-semibold", children: "Description:" }, void 0, !1, {
            fileName: "app/components/EventCard.jsx",
            lineNumber: 98,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV11("p", { className: "truncate", children: event.description }, void 0, !1, {
            fileName: "app/components/EventCard.jsx",
            lineNumber: 99,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV11("p", { className: "mt-4 flex items-center font-semibold", children: [
            "Likes: ",
            event.attendees?.length || 0
          ] }, void 0, !0, {
            fileName: "app/components/EventCard.jsx",
            lineNumber: 100,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/components/EventCard.jsx",
          lineNumber: 97,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/EventCard.jsx",
        lineNumber: 84,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/EventCard.jsx",
      lineNumber: 79,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/EventCard.jsx",
    lineNumber: 70,
    columnNumber: 5
  }, this);
}

// app/routes/dashboard._index.jsx
import { jsxDEV as jsxDEV12 } from "react/jsx-dev-runtime";
var meta4 = () => [{ title: "Remix Post App" }];
async function loader7({ request }) {
  if (!await authenticator.isAuthenticated(request))
    return json4({ mostLikedEvent: null });
  let mostLikedEvent = await mongoose9.models.Event.findOne().sort({ attendees: -1 }).populate("creator").populate("attendees");
  return json4({ mostLikedEvent });
}
function Index() {
  let { mostLikedEvent } = useLoaderData5();
  return mostLikedEvent ? /* @__PURE__ */ jsxDEV12("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV12(DashboardData_default, {}, void 0, !1, {
      fileName: "app/routes/dashboard._index.jsx",
      lineNumber: 43,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV12("div", { className: " p-4", children: /* @__PURE__ */ jsxDEV12(
      Link,
      {
        className: "event-link",
        to: `/event/${mostLikedEvent._id}`,
        children: [
          /* @__PURE__ */ jsxDEV12("div", { className: "md:hidden w-full flex justify-center", children: /* @__PURE__ */ jsxDEV12(EventCard, { event: mostLikedEvent }, void 0, !1, {
            fileName: "app/routes/dashboard._index.jsx",
            lineNumber: 51,
            columnNumber: 13
          }, this) }, void 0, !1, {
            fileName: "app/routes/dashboard._index.jsx",
            lineNumber: 50,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV12("div", { className: "hidden md:flex  w-full  justify-center", children: /* @__PURE__ */ jsxDEV12(EventCard2, { event: mostLikedEvent }, void 0, !1, {
            fileName: "app/routes/dashboard._index.jsx",
            lineNumber: 54,
            columnNumber: 13
          }, this) }, void 0, !1, {
            fileName: "app/routes/dashboard._index.jsx",
            lineNumber: 53,
            columnNumber: 11
          }, this)
        ]
      },
      mostLikedEvent._id,
      !0,
      {
        fileName: "app/routes/dashboard._index.jsx",
        lineNumber: 45,
        columnNumber: 9
      },
      this
    ) }, void 0, !1, {
      fileName: "app/routes/dashboard._index.jsx",
      lineNumber: 44,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/dashboard._index.jsx",
    lineNumber: 42,
    columnNumber: 5
  }, this) : /* @__PURE__ */ jsxDEV12("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV12(DashboardData_default, {}, void 0, !1, {
      fileName: "app/routes/dashboard._index.jsx",
      lineNumber: 34,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV12("p", { children: "No events available at the moment." }, void 0, !1, {
      fileName: "app/routes/dashboard._index.jsx",
      lineNumber: 35,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/dashboard._index.jsx",
    lineNumber: 33,
    columnNumber: 7
  }, this);
}

// app/routes/profile.$userId.jsx
var profile_userId_exports = {};
__export(profile_userId_exports, {
  action: () => action6,
  default: () => Profile,
  loader: () => loader8
});
import { Form as Form4, useLoaderData as useLoaderData6 } from "@remix-run/react";
import mongoose10 from "mongoose";
import { Link as Link2 } from "react-router-dom";
import { jsxDEV as jsxDEV13 } from "react/jsx-dev-runtime";
async function loader8({ request }) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), events = await mongoose10.models.Event.find({ creator: user._id }).populate("creator").populate("attendees"), eventsAttending = await mongoose10.models.Event.find({
    attendees: user._id
  }).populate("creator").populate("attendees");
  return { user: await mongoose10.models.User.findOne({ _id: user._id }), events, eventsAttending };
}
function Profile() {
  let { user, events, eventsAttending } = useLoaderData6();
  return /* @__PURE__ */ jsxDEV13("div", { className: "page flex flex-col justify-center m-auto w-4/6", children: [
    /* @__PURE__ */ jsxDEV13("div", { className: "w-full flex flex-col justify-center m-auto my-8", children: [
      /* @__PURE__ */ jsxDEV13("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsxDEV13("h1", { className: "font-semibold text-xl", children: "Profile" }, void 0, !1, {
          fileName: "app/routes/profile.$userId.jsx",
          lineNumber: 40,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV13(Form4, { children: /* @__PURE__ */ jsxDEV13(Link2, { to: `/profile/${user._id}/update`, children: /* @__PURE__ */ jsxDEV13("button", { children: /* @__PURE__ */ jsxDEV13(
          "svg",
          {
            width: "30px",
            height: "30px",
            className: "hover:stroke-gray-400 stroke-black",
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg",
            children: /* @__PURE__ */ jsxDEV13("g", { id: "Complete", children: /* @__PURE__ */ jsxDEV13("g", { id: "edit", children: /* @__PURE__ */ jsxDEV13("g", { children: [
              /* @__PURE__ */ jsxDEV13(
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
              /* @__PURE__ */ jsxDEV13(
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
      /* @__PURE__ */ jsxDEV13("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsxDEV13("div", { className: "py-2", children: [
          /* @__PURE__ */ jsxDEV13("p", { className: "font-semibold", children: "Name: " }, void 0, !1, {
            fileName: "app/routes/profile.$userId.jsx",
            lineNumber: 78,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV13("p", { children: user?.name }, void 0, !1, {
            fileName: "app/routes/profile.$userId.jsx",
            lineNumber: 79,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/profile.$userId.jsx",
          lineNumber: 77,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV13("div", { className: "py-2", children: [
          /* @__PURE__ */ jsxDEV13("p", { className: "font-semibold", children: "Mail: " }, void 0, !1, {
            fileName: "app/routes/profile.$userId.jsx",
            lineNumber: 82,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV13("p", { children: user?.mail }, void 0, !1, {
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
      /* @__PURE__ */ jsxDEV13(
        Form4,
        {
          method: "post",
          className: "items-center w-1/2 bg-gray-100 hover:bg-gray-200 rounded-xl p-2 m-auto",
          children: /* @__PURE__ */ jsxDEV13("div", { className: "", children: /* @__PURE__ */ jsxDEV13("button", { className: "text-cancel flex flex-row font-semibold w-full justify-center", children: "Logout" }, void 0, !1, {
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
    /* @__PURE__ */ jsxDEV13("div", { className: "py-6", children: /* @__PURE__ */ jsxDEV13("h2", { className: "text-2xl font-semibold", children: "Liked posts" }, void 0, !1, {
      fileName: "app/routes/profile.$userId.jsx",
      lineNumber: 99,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/profile.$userId.jsx",
      lineNumber: 98,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV13("div", { children: eventsAttending.map((event) => /* @__PURE__ */ jsxDEV13("div", { children: /* @__PURE__ */ jsxDEV13(Link2, { className: "event-link", to: `/event/${event._id}`, children: [
      /* @__PURE__ */ jsxDEV13("div", { className: " md:hidden ", children: /* @__PURE__ */ jsxDEV13(EventCard, { event }, void 0, !1, {
        fileName: "app/routes/profile.$userId.jsx",
        lineNumber: 106,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/profile.$userId.jsx",
        lineNumber: 105,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV13("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxDEV13(EventCard2, { event }, void 0, !1, {
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
    /* @__PURE__ */ jsxDEV13("div", { className: "mb-16", children: [
      /* @__PURE__ */ jsxDEV13("h2", { className: "text-lg font-medium pt-6", children: "Posts by me" }, void 0, !1, {
        fileName: "app/routes/profile.$userId.jsx",
        lineNumber: 116,
        columnNumber: 9
      }, this),
      events.map((event) => /* @__PURE__ */ jsxDEV13("div", { children: /* @__PURE__ */ jsxDEV13(Link2, { className: "event-link", to: `/event/${event._id}`, children: [
        /* @__PURE__ */ jsxDEV13("div", { className: " md:hidden ", children: /* @__PURE__ */ jsxDEV13(EventCard, { event }, void 0, !1, {
          fileName: "app/routes/profile.$userId.jsx",
          lineNumber: 121,
          columnNumber: 17
        }, this) }, void 0, !1, {
          fileName: "app/routes/profile.$userId.jsx",
          lineNumber: 120,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV13("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxDEV13(EventCard2, { event }, void 0, !1, {
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
async function action6({ request }) {
  await authenticator.logout(request, { redirectTo: "/main-dashboard" });
}

// app/routes/event.$eventId.jsx
var event_eventId_exports = {};
__export(event_eventId_exports, {
  default: () => Event,
  loader: () => loader9,
  meta: () => meta5
});
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Form as Form5, useLoaderData as useLoaderData7 } from "@remix-run/react";
import { json as json5 } from "@remix-run/node";
import mongoose11 from "mongoose";
import { useEffect as useEffect4, useState as useState6 } from "react";
import { jsxDEV as jsxDEV14 } from "react/jsx-dev-runtime";
var GOOGLE_MAPS_API_KEY = "AIzaSyC8mGRx4SS4NLfyl7AIOhktrM_F9EOHWYQ", MAP_ID = "71f267d426ae7773";
function meta5({ data }) {
  return [
    {
      title: `TrailBlaze - ${data.event.title || "Event"}`
    }
  ];
}
async function loader9({ request, params }) {
  let authUser = await authenticator.isAuthenticated(request), event = await mongoose11.models.Event.findById(params.eventId).populate("attendees").populate("creator");
  return json5({ event, authUser });
}
function Event() {
  let { event, authUser } = useLoaderData7(), [city, setCity] = useState6(null), { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  }), location = event?.location ? {
    lat: parseFloat(event.location.split(",")[0]),
    lng: parseFloat(event.location.split(",")[1])
  } : null;
  if (useEffect4(() => {
    if (location) {
      let fetchCityName = async () => {
        let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${GOOGLE_MAPS_API_KEY}`;
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
  }, [location]), loadError)
    return /* @__PURE__ */ jsxDEV14("div", { children: "Error loading Google Maps" }, void 0, !1, {
      fileName: "app/routes/event.$eventId.jsx",
      lineNumber: 87,
      columnNumber: 25
    }, this);
  if (!isLoaded)
    return /* @__PURE__ */ jsxDEV14("div", { children: "Loading Google Maps..." }, void 0, !1, {
      fileName: "app/routes/event.$eventId.jsx",
      lineNumber: 88,
      columnNumber: 25
    }, this);
  let attending = event?.attendees?.some(
    (attendee) => attendee._id === authUser?._id
  );
  return /* @__PURE__ */ jsxDEV14(
    "div",
    {
      id: "event-page",
      className: "page max-w-5xl flex flex-col justify-center m-auto p-6",
      children: [
        /* @__PURE__ */ jsxDEV14(
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
            lineNumber: 99,
            columnNumber: 7
          },
          this
        ),
        /* @__PURE__ */ jsxDEV14("div", { className: "my-4", children: [
          /* @__PURE__ */ jsxDEV14("h1", { className: "text-3xl", children: event.title }, void 0, !1, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 108,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV14("p", { className: "text-gray-500", children: [
            "Post by: ",
            event?.creator?.name
          ] }, void 0, !0, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 109,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 107,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV14("h3", { children: event.description }, void 0, !1, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 111,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV14("div", { className: "flex my-2", children: [
          /* @__PURE__ */ jsxDEV14("img", { src: "/date.png", alt: "", className: "h-6" }, void 0, !1, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 113,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV14("p", { className: "pl-2", children: new Date(event.date).toLocaleDateString("en-GB") }, void 0, !1, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 114,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 112,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV14("div", { className: "flex my-2", children: [
          /* @__PURE__ */ jsxDEV14("img", { src: "/location.png", alt: "Location Icon", className: "h-6" }, void 0, !1, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 119,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV14("p", { className: "pl-2", children: city || "Fetching location..." }, void 0, !1, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 120,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 118,
          columnNumber: 7
        }, this),
        isLoaded && location ? /* @__PURE__ */ jsxDEV14(
          GoogleMap,
          {
            mapContainerStyle: { width: "100%", height: "400px" },
            center: location,
            zoom: 12,
            options: {
              mapId: MAP_ID
            },
            children: /* @__PURE__ */ jsxDEV14(Marker, { position: location }, void 0, !1, {
              fileName: "app/routes/event.$eventId.jsx",
              lineNumber: 131,
              columnNumber: 11
            }, this)
          },
          void 0,
          !1,
          {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 123,
            columnNumber: 9
          },
          this
        ) : /* @__PURE__ */ jsxDEV14("div", { children: "Loading Google Maps..." }, void 0, !1, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 134,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV14("p", { children: [
          event.attendees.length,
          " Like"
        ] }, void 0, !0, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 137,
          columnNumber: 7
        }, this),
        !attending && authUser ? /* @__PURE__ */ jsxDEV14(Form5, { method: "post", children: /* @__PURE__ */ jsxDEV14("button", { name: "_action", value: "attend", children: "Like" }, void 0, !1, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 140,
          columnNumber: 11
        }, this) }, void 0, !1, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 139,
          columnNumber: 9
        }, this) : authUser ? /* @__PURE__ */ jsxDEV14(Form5, { method: "post", children: /* @__PURE__ */ jsxDEV14("button", { name: "_action", value: "unattend", children: "Unlike" }, void 0, !1, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 146,
          columnNumber: 11
        }, this) }, void 0, !1, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 145,
          columnNumber: 9
        }, this) : null,
        authUser?._id === event?.creator?._id && /* @__PURE__ */ jsxDEV14("div", { className: "flex py-4", children: [
          /* @__PURE__ */ jsxDEV14(Form5, { action: "update", children: /* @__PURE__ */ jsxDEV14("button", { children: "Update" }, void 0, !1, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 154,
            columnNumber: 13
          }, this) }, void 0, !1, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 153,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV14(Form5, { action: "destroy", method: "post", children: /* @__PURE__ */ jsxDEV14("button", { className: "ml-4 text-cancel", children: "Delete this event" }, void 0, !1, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 157,
            columnNumber: 13
          }, this) }, void 0, !1, {
            fileName: "app/routes/event.$eventId.jsx",
            lineNumber: 156,
            columnNumber: 11
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/event.$eventId.jsx",
          lineNumber: 152,
          columnNumber: 9
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/routes/event.$eventId.jsx",
      lineNumber: 95,
      columnNumber: 5
    },
    this
  );
}

// app/routes/main-dashboard.jsx
var main_dashboard_exports = {};
__export(main_dashboard_exports, {
  default: () => MainDashboard,
  meta: () => meta6
});
import "react";
import { jsxDEV as jsxDEV15 } from "react/jsx-dev-runtime";
var meta6 = () => [{ title: "Elevation" }];
function MainDashboard() {
  return /* @__PURE__ */ jsxDEV15("div", { className: "page", children: /* @__PURE__ */ jsxDEV15("div", { className: "page", children: /* @__PURE__ */ jsxDEV15(DashboardData_default, {}, void 0, !1, {
    fileName: "app/routes/main-dashboard.jsx",
    lineNumber: 12,
    columnNumber: 9
  }, this) }, void 0, !1, {
    fileName: "app/routes/main-dashboard.jsx",
    lineNumber: 11,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/main-dashboard.jsx",
    lineNumber: 10,
    columnNumber: 5
  }, this);
}

// app/routes/posts.$postId.jsx
var posts_postId_exports = {};
__export(posts_postId_exports, {
  default: () => Post,
  loader: () => loader10,
  meta: () => meta7
});
import { json as json6 } from "@remix-run/node";
import { Form as Form6, useLoaderData as useLoaderData8 } from "@remix-run/react";
import mongoose12 from "mongoose";

// app/components/UserAvatar.jsx
import { jsxDEV as jsxDEV16 } from "react/jsx-dev-runtime";
function UserAvatar({ user }) {
  return /* @__PURE__ */ jsxDEV16("div", { className: "avatar", children: [
    /* @__PURE__ */ jsxDEV16("img", { src: user.image, alt: user.name }, void 0, !1, {
      fileName: "app/components/UserAvatar.jsx",
      lineNumber: 4,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV16("span", { children: [
      /* @__PURE__ */ jsxDEV16("h3", { children: user.name }, void 0, !1, {
        fileName: "app/components/UserAvatar.jsx",
        lineNumber: 6,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV16("p", { children: user.title }, void 0, !1, {
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
import { jsxDEV as jsxDEV17 } from "react/jsx-dev-runtime";
function PostCard({ post }) {
  return /* @__PURE__ */ jsxDEV17("article", { className: "post-card", children: [
    /* @__PURE__ */ jsxDEV17(UserAvatar, { user: post.user }, void 0, !1, {
      fileName: "app/components/PostCard.jsx",
      lineNumber: 6,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV17("img", { src: post.image, alt: post.caption }, void 0, !1, {
      fileName: "app/components/PostCard.jsx",
      lineNumber: 7,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV17("h3", { children: post.caption }, void 0, !1, {
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
import { jsxDEV as jsxDEV18 } from "react/jsx-dev-runtime";
function meta7({ data }) {
  return [
    {
      title: `Remix Post App - ${data.post.caption || "Post"}`
    }
  ];
}
async function loader10({ request, params }) {
  let authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), post = await mongoose12.models.Post.findById(params.postId).populate("user");
  return json6({ post, authUser });
}
function Post() {
  let { post, authUser } = useLoaderData8();
  function confirmDelete(event) {
    confirm("Please confirm you want to delete this post.") || event.preventDefault();
  }
  return /* @__PURE__ */ jsxDEV18("div", { id: "post-page", className: "page", children: [
    /* @__PURE__ */ jsxDEV18("h1", { children: post.caption }, void 0, !1, {
      fileName: "app/routes/posts.$postId.jsx",
      lineNumber: 37,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV18(PostCard, { post }, void 0, !1, {
      fileName: "app/routes/posts.$postId.jsx",
      lineNumber: 38,
      columnNumber: 7
    }, this),
    authUser._id === post.user._id && /* @__PURE__ */ jsxDEV18("div", { className: "btns", children: [
      /* @__PURE__ */ jsxDEV18(Form6, { action: "update", children: /* @__PURE__ */ jsxDEV18("button", { children: "Update" }, void 0, !1, {
        fileName: "app/routes/posts.$postId.jsx",
        lineNumber: 42,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/posts.$postId.jsx",
        lineNumber: 41,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV18(Form6, { action: "destroy", method: "post", onSubmit: confirmDelete, children: /* @__PURE__ */ jsxDEV18("button", { children: "Delete" }, void 0, !1, {
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
  loader: () => loader11,
  meta: () => meta8
});
import { useLoaderData as useLoaderData9 } from "@remix-run/react";
import { GoogleMap as GoogleMap2, Marker as Marker2, useJsApiLoader as useJsApiLoader2 } from "@react-google-maps/api";
import { useState as useState7, useRef as useRef2 } from "react";
import { json as json7 } from "@remix-run/node";
import mongoose13 from "mongoose";
import { jsxDEV as jsxDEV19 } from "react/jsx-dev-runtime";
var GOOGLE_MAPS_API_KEY2 = "AIzaSyC8mGRx4SS4NLfyl7AIOhktrM_F9EOHWY", MAP_ID2 = "71f267d426ae7773", meta8 = () => [{ title: "Evelation - Post" }];
async function loader11({ request }) {
  let event = await mongoose13.models.Event.find().populate("creator").populate("attendees");
  return json7({ event });
}
function Index2() {
  let { event } = useLoaderData9(), [center] = useState7({ lat: 41.0082, lng: 28.9784 }), mapRef = useRef2(), { isLoaded, loadError } = useJsApiLoader2({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY2,
    libraries: ["places"]
  });
  return loadError ? /* @__PURE__ */ jsxDEV19("div", { children: "Error loading Google Maps" }, void 0, !1, {
    fileName: "app/routes/event._index.jsx",
    lineNumber: 35,
    columnNumber: 12
  }, this) : isLoaded ? /* @__PURE__ */ jsxDEV19("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV19("div", { className: "map-container", children: /* @__PURE__ */ jsxDEV19(
      GoogleMap2,
      {
        mapContainerStyle: { width: "100%", height: "400px" },
        center,
        zoom: 6,
        onLoad: (map) => {
          mapRef.current = map, map.setOptions({
            mapId: MAP_ID2
          });
        },
        children: event.map(
          (evt) => evt.location && // Ensure the event has location data
          /* @__PURE__ */ jsxDEV19(
            Marker2,
            {
              position: {
                lat: evt.location.lat,
                lng: evt.location.lng
              },
              title: evt.title
            },
            evt._id,
            !1,
            {
              fileName: "app/routes/event._index.jsx",
              lineNumber: 59,
              columnNumber: 17
            },
            this
          )
        )
      },
      void 0,
      !1,
      {
        fileName: "app/routes/event._index.jsx",
        lineNumber: 45,
        columnNumber: 9
      },
      this
    ) }, void 0, !1, {
      fileName: "app/routes/event._index.jsx",
      lineNumber: 44,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV19("section", { className: "events-list", children: event.map((evt) => /* @__PURE__ */ jsxDEV19("div", { className: "event-item", children: /* @__PURE__ */ jsxDEV19(EventCard2, { event: evt }, void 0, !1, {
      fileName: "app/routes/event._index.jsx",
      lineNumber: 74,
      columnNumber: 13
    }, this) }, evt._id, !1, {
      fileName: "app/routes/event._index.jsx",
      lineNumber: 73,
      columnNumber: 11
    }, this)) }, void 0, !1, {
      fileName: "app/routes/event._index.jsx",
      lineNumber: 71,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/event._index.jsx",
    lineNumber: 43,
    columnNumber: 5
  }, this) : /* @__PURE__ */ jsxDEV19("div", { children: "Loading..." }, void 0, !1, {
    fileName: "app/routes/event._index.jsx",
    lineNumber: 39,
    columnNumber: 12
  }, this);
}

// app/routes/users._index.jsx
var users_index_exports = {};

// app/routes/add-event.jsx
var add_event_exports = {};
__export(add_event_exports, {
  action: () => action7,
  default: () => AddEvent,
  loader: () => loader12
});
import { useEffect as useEffect6, useRef as useRef3, useState as useState8 } from "react";
import { useNavigate as useNavigate4 } from "@remix-run/react";
import { Form as Form7 } from "@remix-run/react";
import { GoogleMap as GoogleMap3, Marker as Marker3, useJsApiLoader as useJsApiLoader3 } from "@react-google-maps/api";
import mongoose14 from "mongoose";
import { redirect as redirect5 } from "@remix-run/node";
import { jsxDEV as jsxDEV20 } from "react/jsx-dev-runtime";
var GOOGLE_MAPS_API_KEY3 = "AIzaSyC8mGRx4SS4NLfyl7AIOhktrM_F9EOHWYQ", mapLibraries = ["marker"], MAP_ID3 = "71f267d426ae7773";
async function loader12({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
}
function AddEvent() {
  let [image, setImage] = useState8(
    "https://placehold.co/600x400?text=Add+your+amazing+image"
  ), [location, setLocation] = useState8(null), [center] = useState8({ lat: 41.0082, lng: 28.9784 }), mapRef = useRef3(), navigate = useNavigate4(), { isLoaded, loadError } = useJsApiLoader3({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY3,
    libraries: mapLibraries
  }), handleMapClick = (event) => {
    setLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  }, handleCancel = () => navigate("/dashboard");
  return useEffect6(() => {
    if (location && mapRef.current && window.google) {
      let map = mapRef.current;
      if (google.maps.marker.AdvancedMarkerElement) {
        let markerContent = document.createElement("div");
        markerContent.style.fontSize = "24px", new google.maps.marker.AdvancedMarkerElement({
          position: location,
          map,
          content: markerContent
        });
      } else
        console.warn("AdvancedMarkerElement is not available.");
    }
  }, [location]), loadError ? /* @__PURE__ */ jsxDEV20("div", { children: "Error loading Google Maps" }, void 0, !1, {
    fileName: "app/routes/add-event.jsx",
    lineNumber: 64,
    columnNumber: 12
  }, this) : isLoaded ? /* @__PURE__ */ jsxDEV20("div", { className: "page w-full flex-col gap-y-4 justify-center mt-4 mb-4 p-8", children: [
    /* @__PURE__ */ jsxDEV20("h1", { className: "m-auto flex justify-center font-semibold text-2xl mb-6", children: "Create New Event" }, void 0, !1, {
      fileName: "app/routes/add-event.jsx",
      lineNumber: 73,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV20(
      Form7,
      {
        id: "event-form",
        method: "post",
        className: "rounded-lg font-semibold max-w-lg justify-center m-auto flex flex-col gap-y-4 p-4",
        children: [
          /* @__PURE__ */ jsxDEV20("label", { htmlFor: "title", children: "Event Title" }, void 0, !1, {
            fileName: "app/routes/add-event.jsx",
            lineNumber: 81,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV20(
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
              lineNumber: 82,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV20("label", { htmlFor: "description", children: "Description" }, void 0, !1, {
            fileName: "app/routes/add-event.jsx",
            lineNumber: 91,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV20(
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
              lineNumber: 92,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV20("label", { htmlFor: "date", children: "Date" }, void 0, !1, {
            fileName: "app/routes/add-event.jsx",
            lineNumber: 100,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV20(
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
              lineNumber: 101,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV20("label", { htmlFor: "location", children: "Location" }, void 0, !1, {
            fileName: "app/routes/add-event.jsx",
            lineNumber: 109,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV20(
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
              lineNumber: 110,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV20(
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
              children: location && /* @__PURE__ */ jsxDEV20(Marker3, { position: location, title: "Selected Location" }, void 0, !1, {
                fileName: "app/routes/add-event.jsx",
                lineNumber: 132,
                columnNumber: 24
              }, this)
            },
            void 0,
            !1,
            {
              fileName: "app/routes/add-event.jsx",
              lineNumber: 120,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV20("label", { htmlFor: "image", children: "Image URL" }, void 0, !1, {
            fileName: "app/routes/add-event.jsx",
            lineNumber: 135,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV20(
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
              lineNumber: 136,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV20("label", { htmlFor: "image-preview", children: "Image Preview" }, void 0, !1, {
            fileName: "app/routes/add-event.jsx",
            lineNumber: 146,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV20(
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
              lineNumber: 147,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV20("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxDEV20(
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
                lineNumber: 155,
                columnNumber: 11
              },
              this
            ),
            /* @__PURE__ */ jsxDEV20(
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
                lineNumber: 161,
                columnNumber: 11
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/routes/add-event.jsx",
            lineNumber: 154,
            columnNumber: 9
          }, this)
        ]
      },
      void 0,
      !0,
      {
        fileName: "app/routes/add-event.jsx",
        lineNumber: 76,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/routes/add-event.jsx",
    lineNumber: 72,
    columnNumber: 5
  }, this) : /* @__PURE__ */ jsxDEV20("div", { children: "Loading..." }, void 0, !1, {
    fileName: "app/routes/add-event.jsx",
    lineNumber: 68,
    columnNumber: 12
  }, this);
}
async function action7({ request }) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  }), formData = await request.formData(), event = Object.fromEntries(formData);
  return event.creator = user._id, await mongoose14.models.Event.create(event), redirect5("/dashboard");
}

// app/routes/add-post.jsx
var add_post_exports = {};
__export(add_post_exports, {
  action: () => action8,
  default: () => AddPost,
  loader: () => loader13,
  meta: () => meta9
});
import { redirect as redirect6 } from "@remix-run/node";
import { Form as Form8, useNavigate as useNavigate5 } from "@remix-run/react";
import mongoose15 from "mongoose";
import { useState as useState9 } from "react";
import { jsxDEV as jsxDEV21 } from "react/jsx-dev-runtime";
var meta9 = () => [{ title: "Remix Post App - Add New Post" }];
async function loader13({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
}
function AddPost() {
  let [image, setImage] = useState9("https://placehold.co/600x400?text=Add+your+amazing+image"), navigate = useNavigate5();
  function handleCancel() {
    navigate(-1);
  }
  return /* @__PURE__ */ jsxDEV21("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV21("h1", { children: "Add a Post" }, void 0, !1, {
      fileName: "app/routes/add-post.jsx",
      lineNumber: 27,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV21(Form8, { id: "post-form", method: "post", children: [
      /* @__PURE__ */ jsxDEV21("label", { htmlFor: "caption", children: "Caption" }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 29,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV21("input", { id: "caption", name: "caption", type: "text", "aria-label": "caption", placeholder: "Write a caption..." }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 30,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV21("label", { htmlFor: "image", children: "Image URL" }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 32,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV21("input", { name: "image", type: "url", onChange: (e) => setImage(e.target.value), placeholder: "Paste an image URL..." }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 33,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV21("label", { htmlFor: "image-preview", children: "Image Preview" }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 35,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV21(
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
      /* @__PURE__ */ jsxDEV21("div", { className: "btns", children: [
        /* @__PURE__ */ jsxDEV21("button", { children: "Save" }, void 0, !1, {
          fileName: "app/routes/add-post.jsx",
          lineNumber: 45,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV21("button", { type: "button", className: "btn-cancel", onClick: handleCancel, children: "Cancel" }, void 0, !1, {
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
async function action8({ request }) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
  console.log(user);
  let formData = await request.formData(), post = Object.fromEntries(formData);
  return post.user = user._id, await mongoose15.models.Post.create(post), redirect6("/posts");
}

// app/routes/profile1.jsx
var profile1_exports = {};
__export(profile1_exports, {
  action: () => action9,
  default: () => Profile2,
  loader: () => loader14
});
import { Form as Form9, useLoaderData as useLoaderData10 } from "@remix-run/react";
import "@remix-run/react";
import { jsxDEV as jsxDEV22 } from "react/jsx-dev-runtime";
async function loader14({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
}
function Profile2() {
  let user = useLoaderData10();
  return /* @__PURE__ */ jsxDEV22("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV22("div", { className: "bg-slate-800 p-8", children: /* @__PURE__ */ jsxDEV22("div", { className: "flex justify-center items-center space-x-4", children: [
      /* @__PURE__ */ jsxDEV22(
        "img",
        {
          src: user.avatar,
          alt: "Profile",
          className: "rounded-full h-24 w-24 border-4 border-white"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/profile1.jsx",
          lineNumber: 20,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV22("div", { children: [
        /* @__PURE__ */ jsxDEV22("p", { className: "text-white font-bold text-3xl", children: [
          user.name,
          " ",
          user.lastname
        ] }, void 0, !0, {
          fileName: "app/routes/profile1.jsx",
          lineNumber: 26,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV22("p", { className: "text-white text-lg", children: user.mail }, void 0, !1, {
          fileName: "app/routes/profile1.jsx",
          lineNumber: 29,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV22("p", { className: "text-white", children: [
          "Your sports: ",
          user.hobbies.join(", ")
        ] }, void 0, !0, {
          fileName: "app/routes/profile1.jsx",
          lineNumber: 30,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/profile1.jsx",
        lineNumber: 25,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/profile1.jsx",
      lineNumber: 19,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/profile1.jsx",
      lineNumber: 18,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV22(Form9, { method: "post", className: "flex justify-center mt-4", children: /* @__PURE__ */ jsxDEV22("button", { className: "bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700", children: "Logout" }, void 0, !1, {
      fileName: "app/routes/profile1.jsx",
      lineNumber: 36,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/profile1.jsx",
      lineNumber: 35,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/profile1.jsx",
    lineNumber: 17,
    columnNumber: 5
  }, this);
}
async function action9({ request }) {
  await authenticator.logout(request, { redirectTo: "/signin" });
}

// app/routes/_index.jsx
var index_exports = {};
__export(index_exports, {
  loader: () => loader15,
  meta: () => meta10
});
var meta10 = () => [{ title: "Elevation" }];
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
import { json as json8 } from "@remix-run/node";
import { Form as Form10, NavLink as NavLink3, useLoaderData as useLoaderData11 } from "@remix-run/react";
import { jsxDEV as jsxDEV23 } from "react/jsx-dev-runtime";
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
  return json8({ error }, { headers });
}
function SignIn() {
  let loaderData = useLoaderData11();
  return /* @__PURE__ */ jsxDEV23(
    "div",
    {
      id: "sign-in-page",
      className: " flex flex-col justify-center items-center rounded-lg h-auto w-2/6 ml-auto mr-auto mt-24 p-4 gap-3",
      children: [
        /* @__PURE__ */ jsxDEV23("h1", { className: "text-2xl w-auto", children: "Sign In" }, void 0, !1, {
          fileName: "app/routes/signin.jsx",
          lineNumber: 35,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV23(
          Form10,
          {
            id: "sign-in-form",
            method: "post",
            className: "flex items-center flex-col gap-1 w-full",
            children: [
              /* @__PURE__ */ jsxDEV23("label", { htmlFor: "mail", children: "Email" }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 41,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV23(
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
              /* @__PURE__ */ jsxDEV23("label", { htmlFor: "password", className: "", children: "Password" }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 52,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV23(
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
              /* @__PURE__ */ jsxDEV23("div", { className: "bg-sky-500 text-white hover:bg-sky-600 transition-colors p-2 rounded-xl mt-2 w-32 flex justify-center", children: /* @__PURE__ */ jsxDEV23("button", { children: "Sign In" }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 65,
                columnNumber: 11
              }, this) }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 64,
                columnNumber: 9
              }, this),
              loaderData?.error ? /* @__PURE__ */ jsxDEV23("div", { className: "error-message", children: /* @__PURE__ */ jsxDEV23("p", { children: loaderData?.error?.message }, void 0, !1, {
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
        /* @__PURE__ */ jsxDEV23("p", { className: "flex", children: [
          "No account?",
          " ",
          /* @__PURE__ */ jsxDEV23(NavLink3, { to: "/signup", className: "text-sky-500", children: "Sign up here." }, void 0, !1, {
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
import { json as json9, redirect as redirect7 } from "@remix-run/node";
import { Form as Form11, NavLink as NavLink4, useLoaderData as useLoaderData12 } from "@remix-run/react";
import mongoose16 from "mongoose";
import { useState as useState10, useRef as useRef4, useEffect as useEffect7 } from "react";
import { jsxDEV as jsxDEV24 } from "react/jsx-dev-runtime";
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
  return json9({ error }, { headers });
}
function SignUp() {
  let loaderData = useLoaderData12(), [selectedHobbies, setSelectedHobbies] = useState10([]), [dropdownOpen, setDropdownOpen] = useState10(!1), dropdownRef = useRef4(null), sportsOptions = ["Surf", "Ski", "Kite"], toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }, handleCheckboxChange = (event) => {
    let { value, checked } = event.target;
    setSelectedHobbies(
      (prev) => checked ? [...prev, value] : prev.filter((hobby) => hobby !== value)
    );
  };
  return useEffect7(() => {
    let handleClickOutside = (event) => {
      dropdownRef.current && !dropdownRef.current.contains(event.target) && setDropdownOpen(!1);
    };
    return document.addEventListener("mousedown", handleClickOutside), () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]), /* @__PURE__ */ jsxDEV24(
    "div",
    {
      id: "sign-up-page",
      className: "flex flex-col justify-center items-center rounded-lg h-auto w-2/6 ml-auto mr-auto mt-24 mb-32 p-4 gap-3",
      children: [
        /* @__PURE__ */ jsxDEV24("h1", { className: "text-2xl w-auto", children: "Sign Up" }, void 0, !1, {
          fileName: "app/routes/signup.jsx",
          lineNumber: 65,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV24(
          Form11,
          {
            id: "sign-up-form",
            method: "post",
            className: "flex items-center flex-col gap-1 w-full",
            children: [
              /* @__PURE__ */ jsxDEV24("label", { htmlFor: "mail", children: "Email" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 71,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV24(
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
              /* @__PURE__ */ jsxDEV24("label", { htmlFor: "password", children: "Password" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 83,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV24(
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
              /* @__PURE__ */ jsxDEV24("label", { htmlFor: "firstName", children: "First name" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 94,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV24(
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
              /* @__PURE__ */ jsxDEV24("label", { htmlFor: "lastName", children: "Last name" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 104,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV24(
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
              /* @__PURE__ */ jsxDEV24("label", { children: "Select your hobbies:" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 114,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV24("div", { className: "relative", ref: dropdownRef, children: [
                /* @__PURE__ */ jsxDEV24(
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
                dropdownOpen && /* @__PURE__ */ jsxDEV24("div", { className: "absolute top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-10", children: sportsOptions.map((sport) => /* @__PURE__ */ jsxDEV24("label", { className: "block p-2", children: [
                  /* @__PURE__ */ jsxDEV24(
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
              /* @__PURE__ */ jsxDEV24("div", { className: "mt-2", children: selectedHobbies.length > 0 && /* @__PURE__ */ jsxDEV24("div", { className: "p-2 bg-gray-100 border rounded-lg", children: [
                /* @__PURE__ */ jsxDEV24("strong", { children: "Selected Hobbies:" }, void 0, !1, {
                  fileName: "app/routes/signup.jsx",
                  lineNumber: 144,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV24("p", { children: selectedHobbies.join(", ") }, void 0, !1, {
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
              /* @__PURE__ */ jsxDEV24(
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
              /* @__PURE__ */ jsxDEV24("div", { className: "bg-sky-500 text-white hover:bg-sky-600 transition-colors p-2 rounded-xl mt-2 w-32 flex justify-center", children: /* @__PURE__ */ jsxDEV24("button", { children: "Sign Up" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 157,
                columnNumber: 11
              }, this) }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 156,
                columnNumber: 9
              }, this),
              loaderData?.error ? /* @__PURE__ */ jsxDEV24("div", { className: "error-message", children: /* @__PURE__ */ jsxDEV24("p", { children: loaderData?.error?.message }, void 0, !1, {
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
        /* @__PURE__ */ jsxDEV24("p", { children: [
          "Already have an account?",
          " ",
          /* @__PURE__ */ jsxDEV24(NavLink4, { to: "/signin", className: "text-sky-500", children: "Sign in here." }, void 0, !1, {
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
    return newUser.selectedHobbies = JSON.parse(newUser.selectedHobbies || "[]"), await mongoose16.models.User.create({
      mail: newUser.mail,
      password: newUser.password,
      name: newUser.name,
      lastname: newUser.lastName,
      // Capturing lastname here
      hobbies: newUser.selectedHobbies
      // Optional, based on schema
    }), redirect7("/signin");
  } catch (error) {
    return console.log(error), redirect7("/signup");
  }
}

// app/routes/error.jsx
var error_exports = {};
__export(error_exports, {
  default: () => Example
});
import { Link as Link4 } from "react-router-dom";
import { Fragment, jsxDEV as jsxDEV25 } from "react/jsx-dev-runtime";
function Example() {
  return /* @__PURE__ */ jsxDEV25(Fragment, { children: /* @__PURE__ */ jsxDEV25("main", { className: "relative isolate min-h-full", children: [
    /* @__PURE__ */ jsxDEV25(
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
    /* @__PURE__ */ jsxDEV25("div", { className: "mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8 text-gray-50", children: [
      /* @__PURE__ */ jsxDEV25("p", { className: "text-base font-semibold leading-8 text-white", children: "404" }, void 0, !1, {
        fileName: "app/routes/error.jsx",
        lineNumber: 16,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV25("h1", { className: "mt-4 text-3xl font-bold tracking-tight  sm:text-5xl", children: "Page not found" }, void 0, !1, {
        fileName: "app/routes/error.jsx",
        lineNumber: 17,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV25("p", { className: "mt-4 text-base  sm:mt-6", children: "Sorry, we couldn\u2019t find the page you\u2019re looking for." }, void 0, !1, {
        fileName: "app/routes/error.jsx",
        lineNumber: 20,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV25("div", { className: "mt-10 flex justify-center", children: /* @__PURE__ */ jsxDEV25(Link4, { to: "/event", className: "text-sm font-semibold leading-7 ", children: [
        /* @__PURE__ */ jsxDEV25("span", { "aria-hidden": "true", children: "\u2190" }, void 0, !1, {
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
var assets_manifest_default = { entry: { module: "/build/entry.client-7HXZCFKR.js", imports: ["/build/_shared/chunk-ZWGWGGVF.js", "/build/_shared/chunk-KKDHQITS.js", "/build/_shared/chunk-LMGUNZ3X.js", "/build/_shared/chunk-GIAAE3CH.js", "/build/_shared/chunk-XU7DNSPJ.js", "/build/_shared/chunk-BOXFZXVX.js", "/build/_shared/chunk-HKPYBBGK.js", "/build/_shared/chunk-UWV35TSL.js", "/build/_shared/chunk-PNG5AS42.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-EHWSPLNU.js", imports: ["/build/_shared/chunk-SARLQUTN.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-YBNG2UBP.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/add-event": { id: "routes/add-event", parentId: "root", path: "add-event", index: void 0, caseSensitive: void 0, module: "/build/routes/add-event-2NMNLWPF.js", imports: ["/build/_shared/chunk-SDEB5LWC.js", "/build/_shared/chunk-NMZL6IDN.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/add-post": { id: "routes/add-post", parentId: "root", path: "add-post", index: void 0, caseSensitive: void 0, module: "/build/routes/add-post-4L7ESQ5R.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/dashboard._index": { id: "routes/dashboard._index", parentId: "root", path: "dashboard", index: !0, caseSensitive: void 0, module: "/build/routes/dashboard._index-BA4PIDIS.js", imports: ["/build/_shared/chunk-V6KE3PNR.js", "/build/_shared/chunk-P6JZWUJZ.js", "/build/_shared/chunk-UJ252UTL.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/error": { id: "routes/error", parentId: "root", path: "error", index: void 0, caseSensitive: void 0, module: "/build/routes/error-HSYC2SWZ.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/event.$eventId": { id: "routes/event.$eventId", parentId: "root", path: "event/:eventId", index: void 0, caseSensitive: void 0, module: "/build/routes/event.$eventId-OVVHWV6T.js", imports: ["/build/_shared/chunk-SDEB5LWC.js", "/build/_shared/chunk-NMZL6IDN.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/event.$eventId.destroy": { id: "routes/event.$eventId.destroy", parentId: "routes/event.$eventId", path: "destroy", index: void 0, caseSensitive: void 0, module: "/build/routes/event.$eventId.destroy-IHPZH4G4.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/event.$eventId_.update": { id: "routes/event.$eventId_.update", parentId: "root", path: "event/:eventId/update", index: void 0, caseSensitive: void 0, module: "/build/routes/event.$eventId_.update-BZH6KNVR.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/event._index": { id: "routes/event._index", parentId: "root", path: "event", index: !0, caseSensitive: void 0, module: "/build/routes/event._index-VUK66PBI.js", imports: ["/build/_shared/chunk-SDEB5LWC.js", "/build/_shared/chunk-NMZL6IDN.js", "/build/_shared/chunk-UJ252UTL.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/main-dashboard": { id: "routes/main-dashboard", parentId: "root", path: "main-dashboard", index: void 0, caseSensitive: void 0, module: "/build/routes/main-dashboard-SSFNCLYP.js", imports: ["/build/_shared/chunk-P6JZWUJZ.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId": { id: "routes/posts.$postId", parentId: "root", path: "posts/:postId", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId-KLV5VW7H.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId.destroy": { id: "routes/posts.$postId.destroy", parentId: "routes/posts.$postId", path: "destroy", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId.destroy-QJD7CVP4.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId_.update": { id: "routes/posts.$postId_.update", parentId: "root", path: "posts/:postId/update", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId_.update-32ZHGPIC.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/profile.$userId": { id: "routes/profile.$userId", parentId: "root", path: "profile/:userId", index: void 0, caseSensitive: void 0, module: "/build/routes/profile.$userId-CHP4HAEV.js", imports: ["/build/_shared/chunk-V6KE3PNR.js", "/build/_shared/chunk-UJ252UTL.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/profile.$userId_.update": { id: "routes/profile.$userId_.update", parentId: "root", path: "profile/:userId/update", index: void 0, caseSensitive: void 0, module: "/build/routes/profile.$userId_.update-BQVAG5LU.js", imports: ["/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/profile1": { id: "routes/profile1", parentId: "root", path: "profile1", index: void 0, caseSensitive: void 0, module: "/build/routes/profile1-CL2CFHKQ.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/signin": { id: "routes/signin", parentId: "root", path: "signin", index: void 0, caseSensitive: void 0, module: "/build/routes/signin-E5UMBJ46.js", imports: ["/build/_shared/chunk-QUYRSHBJ.js", "/build/_shared/chunk-G7CHZRZX.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/signup": { id: "routes/signup", parentId: "root", path: "signup", index: void 0, caseSensitive: void 0, module: "/build/routes/signup-SDPVZWSB.js", imports: ["/build/_shared/chunk-QUYRSHBJ.js", "/build/_shared/chunk-G7CHZRZX.js", "/build/_shared/chunk-GMSPC5K3.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/users._index": { id: "routes/users._index", parentId: "root", path: "users", index: !0, caseSensitive: void 0, module: "/build/routes/users._index-6AIM527Q.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "1d3c4e1f", hmr: { runtime: "/build/_shared/chunk-HKPYBBGK.js", timestamp: 1732895610053 }, url: "/build/manifest-1D3C4E1F.js" };

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
  "routes/add-post": {
    id: "routes/add-post",
    parentId: "root",
    path: "add-post",
    index: void 0,
    caseSensitive: void 0,
    module: add_post_exports
  },
  "routes/profile1": {
    id: "routes/profile1",
    parentId: "root",
    path: "profile1",
    index: void 0,
    caseSensitive: void 0,
    module: profile1_exports
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
