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
var tailwind_default = "/build/_assets/tailwind-TIUGHYBZ.css";

// app/components/Nav.jsx
import { NavLink } from "@remix-run/react";
import { jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";
function Nav() {
  return /* @__PURE__ */ jsxDEV2("div", { className: " min-h-screen  fixed bg-cyan-50 ", children: /* @__PURE__ */ jsxDEV2("nav", { className: " flex flex-col mt-5 ", children: [
    /* @__PURE__ */ jsxDEV2(
      NavLink,
      {
        to: "/dashboard",
        className: "hover:bg-cyan-100 p-2 justify-center ",
        children: [
          /* @__PURE__ */ jsxDEV2(
            "svg",
            {
              width: "40px",
              height: "40px",
              viewBox: "0 -0.5 25 25",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsxDEV2(
                "path",
                {
                  d: "M12.5 11.75C12.9142 11.75 13.25 11.4142 13.25 11C13.25 10.5858 12.9142 10.25 12.5 10.25V11.75ZM5.5 10.25C5.08579 10.25 4.75 10.5858 4.75 11C4.75 11.4142 5.08579 11.75 5.5 11.75V10.25ZM12.5 10.25C12.0858 10.25 11.75 10.5858 11.75 11C11.75 11.4142 12.0858 11.75 12.5 11.75V10.25ZM19.5 11.75C19.9142 11.75 20.25 11.4142 20.25 11C20.25 10.5858 19.9142 10.25 19.5 10.25V11.75ZM11.75 11C11.75 11.4142 12.0858 11.75 12.5 11.75C12.9142 11.75 13.25 11.4142 13.25 11H11.75ZM13.25 5C13.25 4.58579 12.9142 4.25 12.5 4.25C12.0858 4.25 11.75 4.58579 11.75 5H13.25ZM6.25 11C6.25 10.5858 5.91421 10.25 5.5 10.25C5.08579 10.25 4.75 10.5858 4.75 11H6.25ZM20.25 11C20.25 10.5858 19.9142 10.25 19.5 10.25C19.0858 10.25 18.75 10.5858 18.75 11H20.25ZM4.75 11C4.75 11.4142 5.08579 11.75 5.5 11.75C5.91421 11.75 6.25 11.4142 6.25 11H4.75ZM12.5 5.75C12.9142 5.75 13.25 5.41421 13.25 5C13.25 4.58579 12.9142 4.25 12.5 4.25V5.75ZM18.75 11C18.75 11.4142 19.0858 11.75 19.5 11.75C19.9142 11.75 20.25 11.4142 20.25 11H18.75ZM12.5 4.25C12.0858 4.25 11.75 4.58579 11.75 5C11.75 5.41421 12.0858 5.75 12.5 5.75V4.25ZM12.5 10.25H5.5V11.75H12.5V10.25ZM12.5 11.75H19.5V10.25H12.5V11.75ZM13.25 11V5H11.75V11H13.25ZM4.75 11V15H6.25V11H4.75ZM4.75 15C4.75 17.6234 6.87665 19.75 9.5 19.75V18.25C7.70507 18.25 6.25 16.7949 6.25 15H4.75ZM9.5 19.75H15.5V18.25H9.5V19.75ZM15.5 19.75C18.1234 19.75 20.25 17.6234 20.25 15H18.75C18.75 16.7949 17.2949 18.25 15.5 18.25V19.75ZM20.25 15V11H18.75V15H20.25ZM6.25 11V9H4.75V11H6.25ZM6.25 9C6.25 7.20507 7.70507 5.75 9.5 5.75V4.25C6.87665 4.25 4.75 6.37665 4.75 9H6.25ZM9.5 5.75H12.5V4.25H9.5V5.75ZM20.25 11V9H18.75V11H20.25ZM20.25 9C20.25 6.37665 18.1234 4.25 15.5 4.25V5.75C17.2949 5.75 18.75 7.20507 18.75 9H20.25ZM15.5 4.25H12.5V5.75H15.5V4.25Z",
                  fill: "#000000"
                },
                void 0,
                !1,
                {
                  fileName: "app/components/Nav.jsx",
                  lineNumber: 18,
                  columnNumber: 13
                },
                this
              )
            },
            void 0,
            !1,
            {
              fileName: "app/components/Nav.jsx",
              lineNumber: 11,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ jsxDEV2("p", { className: "text-xs", children: "Dashboard" }, void 0, !1, {
            fileName: "app/components/Nav.jsx",
            lineNumber: 23,
            columnNumber: 11
          }, this)
        ]
      },
      void 0,
      !0,
      {
        fileName: "app/components/Nav.jsx",
        lineNumber: 7,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV2(NavLink, { to: "/add-post", className: "hover:bg-cyan-100 p-2", children: [
      /* @__PURE__ */ jsxDEV2(
        "svg",
        {
          width: "40px",
          height: "40px",
          viewBox: "0 -0.5 25 25",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          children: [
            /* @__PURE__ */ jsxDEV2(
              "path",
              {
                "fill-rule": "evenodd",
                "clip-rule": "evenodd",
                d: "M9.808 4.00001H15.329C15.3863 4.00001 15.4433 4.00367 15.5 4.01101C17.7473 4.16817 19.4924 6.0332 19.5 8.28601V14.715C19.4917 17.0871 17.5641 19.0044 15.192 19H9.808C7.43551 19.0044 5.50772 17.0865 5.5 14.714V8.28601C5.50772 5.91353 7.43551 3.99558 9.808 4.00001Z",
                stroke: "#000000",
                "stroke-width": "1.5",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              },
              void 0,
              !1,
              {
                fileName: "app/components/Nav.jsx",
                lineNumber: 33,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV2(
              "path",
              {
                "fill-rule": "evenodd",
                "clip-rule": "evenodd",
                d: "M10.214 7.12902L8.72301 8.32902C8.57898 8.46627 8.49798 8.65687 8.49911 8.85582C8.50025 9.05476 8.58343 9.24442 8.72901 9.38002L9.69201 10.539L13.718 15.38C13.7851 15.458 13.875 15.5129 13.975 15.537L15.975 15.994C16.2395 16.009 16.4697 15.8152 16.5 15.552L16.407 13.606C16.4001 13.5061 16.36 13.4114 16.293 13.337L12.36 8.60702L11.3 7.33402C11.0448 6.99622 10.5748 6.90749 10.214 7.12902Z",
                stroke: "#000000",
                "stroke-width": "1.5",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              },
              void 0,
              !1,
              {
                fileName: "app/components/Nav.jsx",
                lineNumber: 42,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV2(
              "path",
              {
                d: "M19.5 9.07599C19.9142 9.07599 20.25 8.7402 20.25 8.32599C20.25 7.91177 19.9142 7.57599 19.5 7.57599V9.07599ZM15.5 8.32599H14.75C14.75 8.7402 15.0858 9.07599 15.5 9.07599V8.32599ZM16.25 4.01099C16.25 3.59677 15.9142 3.26099 15.5 3.26099C15.0858 3.26099 14.75 3.59677 14.75 4.01099H16.25ZM13.0989 8.7397C13.17 8.33163 12.8968 7.9432 12.4887 7.87211C12.0806 7.80103 11.6922 8.07421 11.6211 8.48227L13.0989 8.7397ZM9.80281 9.79422C9.39314 9.73302 9.01143 10.0155 8.95023 10.4252C8.88903 10.8348 9.17152 11.2166 9.58119 11.2778L9.80281 9.79422ZM19.5 7.57599H15.5V9.07599H19.5V7.57599ZM16.25 8.32599V4.01099H14.75V8.32599H16.25ZM11.6211 8.48227C11.4716 9.34065 10.6645 9.92295 9.80281 9.79422L9.58119 11.2778C11.2483 11.5268 12.8096 10.4003 13.0989 8.7397L11.6211 8.48227Z",
                fill: "#000000"
              },
              void 0,
              !1,
              {
                fileName: "app/components/Nav.jsx",
                lineNumber: 51,
                columnNumber: 13
              },
              this
            )
          ]
        },
        void 0,
        !0,
        {
          fileName: "app/components/Nav.jsx",
          lineNumber: 26,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV2("p", { className: "text-xs", children: "Add post" }, void 0, !1, {
        fileName: "app/components/Nav.jsx",
        lineNumber: 56,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/Nav.jsx",
      lineNumber: 25,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV2(NavLink, { to: "/profile", className: "hover:bg-cyan-100 p-2", children: [
      /* @__PURE__ */ jsxDEV2(
        "svg",
        {
          width: "40px",
          height: "40px",
          viewBox: "0 -0.5 25 25",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          children: [
            /* @__PURE__ */ jsxDEV2(
              "path",
              {
                "fill-rule": "evenodd",
                "clip-rule": "evenodd",
                d: "M15.5 8C15.5 9.65685 14.1569 11 12.5 11C10.8431 11 9.5 9.65685 9.5 8C9.5 6.34315 10.8431 5 12.5 5C13.2956 5 14.0587 5.31607 14.6213 5.87868C15.1839 6.44129 15.5 7.20435 15.5 8Z",
                stroke: "#000000",
                "stroke-width": "1.5",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              },
              void 0,
              !1,
              {
                fileName: "app/components/Nav.jsx",
                lineNumber: 66,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV2(
              "path",
              {
                "fill-rule": "evenodd",
                "clip-rule": "evenodd",
                d: "M16 14H9C7.61929 14 6.5 15.1193 6.5 16.5C6.5 17.8807 7.61929 19 9 19H16C17.3807 19 18.5 17.8807 18.5 16.5C18.5 15.1193 17.3807 14 16 14V14Z",
                stroke: "#000000",
                "stroke-width": "1.5",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              },
              void 0,
              !1,
              {
                fileName: "app/components/Nav.jsx",
                lineNumber: 75,
                columnNumber: 13
              },
              this
            )
          ]
        },
        void 0,
        !0,
        {
          fileName: "app/components/Nav.jsx",
          lineNumber: 59,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV2("p", { className: "text-xs", children: "Profile" }, void 0, !1, {
        fileName: "app/components/Nav.jsx",
        lineNumber: 85,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/Nav.jsx",
      lineNumber: 58,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/Nav.jsx",
    lineNumber: 6,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/components/Nav.jsx",
    lineNumber: 5,
    columnNumber: 5
  }, this);
}

// app/components/NavAll.jsx
import { NavLink as NavLink2 } from "@remix-run/react";

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

// app/components/NavAll.jsx
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

// app/root.jsx
import { jsxDEV as jsxDEV4 } from "react/jsx-dev-runtime";
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
  return /* @__PURE__ */ jsxDEV4(
    "html",
    {
      lang: "en",
      className: "bg-gradient-to-t from-blue-50 to-cyan-200 bg-cover bg-no-repeat min-h-screen",
      children: [
        /* @__PURE__ */ jsxDEV4("head", { children: [
          /* @__PURE__ */ jsxDEV4("meta", { charSet: "utf-8" }, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 33,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV4("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 34,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV4(Meta, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 35,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV4(Links, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 36,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/root.jsx",
          lineNumber: 32,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV4("body", { children: [
          user ? /* @__PURE__ */ jsxDEV4(Nav, { user }, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 39,
            columnNumber: 17
          }, this) : /* @__PURE__ */ jsxDEV4(Nav2, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 39,
            columnNumber: 39
          }, this),
          /* @__PURE__ */ jsxDEV4(Outlet, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 41,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV4(ScrollRestoration, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 42,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV4(Scripts, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 43,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV4(LiveReload, {}, void 0, !1, {
            fileName: "app/root.jsx",
            lineNumber: 44,
            columnNumber: 9
          }, this)
        ] }, void 0, !0, {
          fileName: "app/root.jsx",
          lineNumber: 38,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    !0,
    {
      fileName: "app/root.jsx",
      lineNumber: 28,
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
import { jsxDEV as jsxDEV5 } from "react/jsx-dev-runtime";
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
  return /* @__PURE__ */ jsxDEV5("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV5("h1", { children: "Update Post" }, void 0, !1, {
      fileName: "app/routes/posts.$postId_.update.jsx",
      lineNumber: 35,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV5(Form, { id: "post-form", method: "post", children: [
      /* @__PURE__ */ jsxDEV5("label", { htmlFor: "caption", children: "Caption" }, void 0, !1, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 37,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5(
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
      /* @__PURE__ */ jsxDEV5("label", { htmlFor: "image", children: "Image URL" }, void 0, !1, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 46,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5(
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
      /* @__PURE__ */ jsxDEV5("label", { htmlFor: "image-preview", children: "Image Preview" }, void 0, !1, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 55,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5(
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
      /* @__PURE__ */ jsxDEV5("input", { name: "uid", type: "text", defaultValue: post.uid, hidden: !0 }, void 0, !1, {
        fileName: "app/routes/posts.$postId_.update.jsx",
        lineNumber: 64,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5("div", { className: "btns", children: [
        /* @__PURE__ */ jsxDEV5("button", { children: "Save" }, void 0, !1, {
          fileName: "app/routes/posts.$postId_.update.jsx",
          lineNumber: 66,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV5("button", { type: "button", className: "btn-cancel", onClick: handleCancel, children: "Cancel" }, void 0, !1, {
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
import { jsxDEV as jsxDEV6 } from "react/jsx-dev-runtime";
var DashboardData = () => {
  let [weatherData, setWeatherData] = useState2(null), [city, setCity] = useState2("Loading..."), [inputCity, setInputCity] = useState2(""), [error, setError] = useState2(""), [activeTab, setActiveTab] = useState2("wind"), apiKey = "84c59fa875b07f0e54b6dd1ce011f187", fetchWeatherData = async (city2) => {
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city2}&appid=${apiKey}&units=metric`;
    try {
      let response = await fetch(apiUrl);
      if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Error: ${errorText}`);
      }
      let data = await response.json();
      setWeatherData(data), setError("");
    } catch (error2) {
      console.error("Error fetching weather data:", error2), setError("Could not fetch weather data. Please try another city.");
    }
  }, fetchCityByCoordinates = async (lat, lon) => {
    let reverseGeoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    try {
      let data = await (await fetch(reverseGeoUrl)).json();
      data && data.length > 0 && setCity(data[0].name);
    } catch (error2) {
      console.error("Error fetching city by coordinates:", error2), setCity("Copenhagen");
    }
  }, getUserLocation = () => {
    navigator.geolocation ? navigator.geolocation.getCurrentPosition(
      (position) => {
        let { latitude, longitude } = position.coords;
        fetchCityByCoordinates(latitude, longitude);
      },
      () => setCity("Copenhagen")
      // Fallback city if location fails
    ) : setCity("Copenhagen");
  };
  return useEffect(() => {
    getUserLocation();
  }, []), useEffect(() => {
    city !== "Loading..." && fetchWeatherData(city);
  }, [city]), /* @__PURE__ */ jsxDEV6("div", { className: "flex flex-row p-4 ", children: [
    /* @__PURE__ */ jsxDEV6("div", { className: "w-60 ml-16", children: [
      /* @__PURE__ */ jsxDEV6("div", { className: "mt-4 flex justify-center flex-col", children: [
        /* @__PURE__ */ jsxDEV6("form", { className: "flex justify-center", onSubmit: (e) => {
          e.preventDefault(), inputCity && (setCity(inputCity), setInputCity(""));
        }, children: [
          /* @__PURE__ */ jsxDEV6(
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
              lineNumber: 82,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV6("button", { className: "bg-slate-50 rounded-r-2xl p-2", type: "submit", children: "\u{1F50D}" }, void 0, !1, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 89,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 81,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV6("h1", { className: "text-3xl font-bold text-center mt-2", children: city }, void 0, !1, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 93,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 80,
        columnNumber: 9
      }, this),
      error && /* @__PURE__ */ jsxDEV6("p", { className: "text-red-500 text-center", children: error }, void 0, !1, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 96,
        columnNumber: 19
      }, this),
      weatherData ? /* @__PURE__ */ jsxDEV6("div", { className: "bg-s-100 rounded-xl w-full  p-6 mt-4 mx-auto", children: [
        /* @__PURE__ */ jsxDEV6("p", { className: "text-3xl flex items-center gap-3", children: [
          "\u{1F321} ",
          weatherData.list[0].main.temp,
          " \xB0C"
        ] }, void 0, !0, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 100,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV6("p", { children: [
          "Feels Like: ",
          weatherData.list[0].main.feels_like,
          " \xB0C"
        ] }, void 0, !0, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 103,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV6("p", { className: "text-3xl flex items-center gap-3", children: [
          "\u{1F324} ",
          weatherData.list[0].weather[0].description
        ] }, void 0, !0, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 104,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV6("p", { className: "text-3xl flex items-center gap-3", children: [
          "\u{1F4A8} ",
          weatherData.list[0].wind.speed,
          " m/s"
        ] }, void 0, !0, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 107,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 99,
        columnNumber: 11
      }, this) : /* @__PURE__ */ jsxDEV6("p", { className: "text-center mt-4", children: "Loading weather data..." }, void 0, !1, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 112,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 79,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV6("div", { className: "w-full", children: [
      /* @__PURE__ */ jsxDEV6("div", { className: "flex justify-center mt-4", children: [
        /* @__PURE__ */ jsxDEV6(
          "button",
          {
            className: `p-2 mx-2 rounded-xl shadow-md ${activeTab === "wind" ? "bg-blue-500 text-white" : "bg-slate-100 hover:bg-slate-400"}`,
            onClick: () => setActiveTab("wind"),
            children: "Wind Map"
          },
          void 0,
          !1,
          {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 117,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV6(
          "button",
          {
            className: `p-2 mx-2 rounded-xl shadow-md ${activeTab === "swell" ? "bg-blue-500 text-white" : "bg-slate-100 hover:bg-slate-400"}`,
            onClick: () => setActiveTab("swell"),
            children: "Swell Map"
          },
          void 0,
          !1,
          {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 127,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 116,
        columnNumber: 9
      }, this),
      activeTab === "wind" ? /* @__PURE__ */ jsxDEV6(
        "iframe",
        {
          title: "Windy Map",
          src: `https://embed.windy.com/embed.html?lat=${weatherData?.city?.coord?.lat || 55.615}&lon=${weatherData?.city?.coord?.lon || 12.347}&zoom=5&overlay=wind&metricTemp=\xB0C&metricWind=m/s`,
          className: " w-4/6 h-96 mt-4 mx-auto border-0 rounded-xl"
        },
        void 0,
        !1,
        {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 140,
          columnNumber: 11
        },
        this
      ) : /* @__PURE__ */ jsxDEV6(
        "iframe",
        {
          title: "Windy Map Swell",
          src: `https://embed.windy.com/embed.html?lat=${weatherData?.city?.coord?.lat || 55.615}&lon=${weatherData?.city?.coord?.lon || 12.347}&zoom=5&overlay=swell1&product=ecmwfWaves&level=surface`,
          className: "w-4/6  h-96 mt-4 mx-auto border-0 rounded-xl"
        },
        void 0,
        !1,
        {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 150,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 115,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/components/DashboardData.jsx",
    lineNumber: 78,
    columnNumber: 5
  }, this);
}, DashboardData_default = DashboardData;

// app/routes/dashboard._index.jsx
import { jsxDEV as jsxDEV7 } from "react/jsx-dev-runtime";
var meta2 = () => [{ title: "Remix Post App" }];
async function loader4({ request }) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/main-dashboard"
  });
  let posts = await mongoose6.models.Post.find().sort({ createdAt: -1 }).populate("user");
  return json2({ posts });
}
function Index() {
  let { posts } = useLoaderData3();
  return /* @__PURE__ */ jsxDEV7("div", { className: "page", children: /* @__PURE__ */ jsxDEV7(DashboardData_default, {}, void 0, !1, {
    fileName: "app/routes/dashboard._index.jsx",
    lineNumber: 27,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/dashboard._index.jsx",
    lineNumber: 26,
    columnNumber: 5
  }, this);
}

// app/routes/main-dashboard.jsx
var main_dashboard_exports = {};
__export(main_dashboard_exports, {
  default: () => MainDashboard,
  meta: () => meta3
});
import "react";
import { jsxDEV as jsxDEV8 } from "react/jsx-dev-runtime";
var meta3 = () => [{ title: "Elevation" }];
function MainDashboard() {
  return /* @__PURE__ */ jsxDEV8("div", { className: "page", children: /* @__PURE__ */ jsxDEV8("div", { className: "page", children: /* @__PURE__ */ jsxDEV8(DashboardData_default, {}, void 0, !1, {
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
  loader: () => loader5,
  meta: () => meta4
});
import { json as json3 } from "@remix-run/node";
import { Form as Form2, useLoaderData as useLoaderData4 } from "@remix-run/react";
import mongoose7 from "mongoose";

// app/components/UserAvatar.jsx
import { jsxDEV as jsxDEV9 } from "react/jsx-dev-runtime";
function UserAvatar({ user }) {
  return /* @__PURE__ */ jsxDEV9("div", { className: "avatar", children: [
    /* @__PURE__ */ jsxDEV9("img", { src: user.image, alt: user.name }, void 0, !1, {
      fileName: "app/components/UserAvatar.jsx",
      lineNumber: 4,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV9("span", { children: [
      /* @__PURE__ */ jsxDEV9("h3", { children: user.name }, void 0, !1, {
        fileName: "app/components/UserAvatar.jsx",
        lineNumber: 6,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV9("p", { children: user.title }, void 0, !1, {
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
import { jsxDEV as jsxDEV10 } from "react/jsx-dev-runtime";
function PostCard({ post }) {
  return /* @__PURE__ */ jsxDEV10("article", { className: "post-card", children: [
    /* @__PURE__ */ jsxDEV10(UserAvatar, { user: post.user }, void 0, !1, {
      fileName: "app/components/PostCard.jsx",
      lineNumber: 6,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV10("img", { src: post.image, alt: post.caption }, void 0, !1, {
      fileName: "app/components/PostCard.jsx",
      lineNumber: 7,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV10("h3", { children: post.caption }, void 0, !1, {
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
import { jsxDEV as jsxDEV11 } from "react/jsx-dev-runtime";
function meta4({ data }) {
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
  return /* @__PURE__ */ jsxDEV11("div", { id: "post-page", className: "page", children: [
    /* @__PURE__ */ jsxDEV11("h1", { children: post.caption }, void 0, !1, {
      fileName: "app/routes/posts.$postId.jsx",
      lineNumber: 37,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV11(PostCard, { post }, void 0, !1, {
      fileName: "app/routes/posts.$postId.jsx",
      lineNumber: 38,
      columnNumber: 7
    }, this),
    authUser._id === post.user._id && /* @__PURE__ */ jsxDEV11("div", { className: "btns", children: [
      /* @__PURE__ */ jsxDEV11(Form2, { action: "update", children: /* @__PURE__ */ jsxDEV11("button", { children: "Update" }, void 0, !1, {
        fileName: "app/routes/posts.$postId.jsx",
        lineNumber: 42,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/posts.$postId.jsx",
        lineNumber: 41,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV11(Form2, { action: "destroy", method: "post", onSubmit: confirmDelete, children: /* @__PURE__ */ jsxDEV11("button", { children: "Delete" }, void 0, !1, {
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
  meta: () => meta5
});
import { redirect as redirect3 } from "@remix-run/node";
import { Form as Form3, useNavigate as useNavigate2 } from "@remix-run/react";
import mongoose8 from "mongoose";
import { useState as useState3 } from "react";
import { jsxDEV as jsxDEV12 } from "react/jsx-dev-runtime";
var meta5 = () => [{ title: "Remix Post App - Add New Post" }];
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
  return /* @__PURE__ */ jsxDEV12("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV12("h1", { children: "Add a Post" }, void 0, !1, {
      fileName: "app/routes/add-post.jsx",
      lineNumber: 27,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV12(Form3, { id: "post-form", method: "post", children: [
      /* @__PURE__ */ jsxDEV12("label", { htmlFor: "caption", children: "Caption" }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 29,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV12("input", { id: "caption", name: "caption", type: "text", "aria-label": "caption", placeholder: "Write a caption..." }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 30,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV12("label", { htmlFor: "image", children: "Image URL" }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 32,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV12("input", { name: "image", type: "url", onChange: (e) => setImage(e.target.value), placeholder: "Paste an image URL..." }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 33,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV12("label", { htmlFor: "image-preview", children: "Image Preview" }, void 0, !1, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 35,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV12(
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
      /* @__PURE__ */ jsxDEV12("div", { className: "btns", children: [
        /* @__PURE__ */ jsxDEV12("button", { children: "Save" }, void 0, !1, {
          fileName: "app/routes/add-post.jsx",
          lineNumber: 45,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV12("button", { type: "button", className: "btn-cancel", onClick: handleCancel, children: "Cancel" }, void 0, !1, {
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
import { jsxDEV as jsxDEV13 } from "react/jsx-dev-runtime";
async function loader7({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
}
function Profile() {
  let user = useLoaderData5();
  return /* @__PURE__ */ jsxDEV13("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV13("p", { children: [
      "Name: ",
      user.name,
      " \xA0",
      user.lastname
    ] }, void 0, !0, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 15,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV13("p", { children: [
      "Mail: ",
      user.mail
    ] }, void 0, !0, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 19,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV13("p", { children: [
      "Your sports: ",
      user.hobbies.join(", ")
    ] }, void 0, !0, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 20,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV13(Form4, { method: "post", children: /* @__PURE__ */ jsxDEV13("button", { children: "Logout" }, void 0, !1, {
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
  meta: () => meta6
});
var meta6 = () => [{ title: "Elevation" }];
async function loader8({ request }) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
    failureRedirect: "/main-dashboard"
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
import { Form as Form5, NavLink as NavLink3, useLoaderData as useLoaderData6 } from "@remix-run/react";
import { jsxDEV as jsxDEV14 } from "react/jsx-dev-runtime";
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
  return /* @__PURE__ */ jsxDEV14(
    "div",
    {
      id: "sign-in-page",
      className: " flex flex-col justify-center items-center rounded-lg h-auto w-2/6 ml-auto mr-auto mt-24 p-4 gap-3",
      children: [
        /* @__PURE__ */ jsxDEV14("h1", { className: "text-2xl w-auto", children: "Sign In" }, void 0, !1, {
          fileName: "app/routes/signin.jsx",
          lineNumber: 35,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV14(
          Form5,
          {
            id: "sign-in-form",
            method: "post",
            className: "flex items-center flex-col gap-1 w-full",
            children: [
              /* @__PURE__ */ jsxDEV14("label", { htmlFor: "mail", children: "Email" }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 41,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV14(
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
              /* @__PURE__ */ jsxDEV14("label", { htmlFor: "password", className: "", children: "Password" }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 52,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV14(
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
              /* @__PURE__ */ jsxDEV14("div", { className: "bg-sky-500 text-white hover:bg-sky-600 transition-colors p-2 rounded-xl mt-2 w-32 flex justify-center", children: /* @__PURE__ */ jsxDEV14("button", { children: "Sign In" }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 65,
                columnNumber: 11
              }, this) }, void 0, !1, {
                fileName: "app/routes/signin.jsx",
                lineNumber: 64,
                columnNumber: 9
              }, this),
              loaderData?.error ? /* @__PURE__ */ jsxDEV14("div", { className: "error-message", children: /* @__PURE__ */ jsxDEV14("p", { children: loaderData?.error?.message }, void 0, !1, {
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
        /* @__PURE__ */ jsxDEV14("p", { className: "flex", children: [
          "No account?",
          " ",
          /* @__PURE__ */ jsxDEV14(NavLink3, { to: "/signup", className: "text-sky-500", children: "Sign up here." }, void 0, !1, {
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
import { Form as Form6, NavLink as NavLink4, useLoaderData as useLoaderData7 } from "@remix-run/react";
import mongoose9 from "mongoose";
import { useState as useState4, useRef, useEffect as useEffect2 } from "react";
import { jsxDEV as jsxDEV15 } from "react/jsx-dev-runtime";
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
  }, [dropdownRef]), /* @__PURE__ */ jsxDEV15(
    "div",
    {
      id: "sign-up-page",
      className: "flex flex-col justify-center items-center rounded-lg h-auto w-2/6 ml-auto mr-auto mt-24 mb-32 p-4 gap-3",
      children: [
        /* @__PURE__ */ jsxDEV15("h1", { className: "text-2xl w-auto", children: "Sign Up" }, void 0, !1, {
          fileName: "app/routes/signup.jsx",
          lineNumber: 65,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV15(
          Form6,
          {
            id: "sign-up-form",
            method: "post",
            className: "flex items-center flex-col gap-1 w-full",
            children: [
              /* @__PURE__ */ jsxDEV15("label", { htmlFor: "mail", children: "Email" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 71,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV15(
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
              /* @__PURE__ */ jsxDEV15("label", { htmlFor: "password", children: "Password" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 83,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV15(
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
              /* @__PURE__ */ jsxDEV15("label", { htmlFor: "firstName", children: "First name" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 94,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV15(
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
              /* @__PURE__ */ jsxDEV15("label", { htmlFor: "lastName", children: "Last name" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 104,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV15(
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
              /* @__PURE__ */ jsxDEV15("label", { children: "Select your hobbies:" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 114,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV15("div", { className: "relative", ref: dropdownRef, children: [
                /* @__PURE__ */ jsxDEV15(
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
                dropdownOpen && /* @__PURE__ */ jsxDEV15("div", { className: "absolute top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-10", children: sportsOptions.map((sport) => /* @__PURE__ */ jsxDEV15("label", { className: "block p-2", children: [
                  /* @__PURE__ */ jsxDEV15(
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
              /* @__PURE__ */ jsxDEV15("div", { className: "mt-2", children: selectedHobbies.length > 0 && /* @__PURE__ */ jsxDEV15("div", { className: "p-2 bg-gray-100 border rounded-lg", children: [
                /* @__PURE__ */ jsxDEV15("strong", { children: "Selected Hobbies:" }, void 0, !1, {
                  fileName: "app/routes/signup.jsx",
                  lineNumber: 144,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV15("p", { children: selectedHobbies.join(", ") }, void 0, !1, {
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
              /* @__PURE__ */ jsxDEV15(
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
              /* @__PURE__ */ jsxDEV15("div", { className: "bg-sky-500 text-white hover:bg-sky-600 transition-colors p-2 rounded-xl mt-2 w-32 flex justify-center", children: /* @__PURE__ */ jsxDEV15("button", { children: "Sign Up" }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 157,
                columnNumber: 11
              }, this) }, void 0, !1, {
                fileName: "app/routes/signup.jsx",
                lineNumber: 156,
                columnNumber: 9
              }, this),
              loaderData?.error ? /* @__PURE__ */ jsxDEV15("div", { className: "error-message", children: /* @__PURE__ */ jsxDEV15("p", { children: loaderData?.error?.message }, void 0, !1, {
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
        /* @__PURE__ */ jsxDEV15("p", { children: [
          "Already have an account?",
          " ",
          /* @__PURE__ */ jsxDEV15(NavLink4, { to: "/signin", className: "text-sky-500", children: "Sign in here." }, void 0, !1, {
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
var assets_manifest_default = { entry: { module: "/build/entry.client-HCYC4TVW.js", imports: ["/build/_shared/chunk-ZWGWGGVF.js", "/build/_shared/chunk-6CCLUK2Q.js", "/build/_shared/chunk-GIAAE3CH.js", "/build/_shared/chunk-XU7DNSPJ.js", "/build/_shared/chunk-BOXFZXVX.js", "/build/_shared/chunk-HKPYBBGK.js", "/build/_shared/chunk-UWV35TSL.js", "/build/_shared/chunk-PNG5AS42.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-4YUGVTUK.js", imports: ["/build/_shared/chunk-SARLQUTN.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-RQHBDQFA.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/add-post": { id: "routes/add-post", parentId: "root", path: "add-post", index: void 0, caseSensitive: void 0, module: "/build/routes/add-post-GSATLGJD.js", imports: ["/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/dashboard._index": { id: "routes/dashboard._index", parentId: "root", path: "dashboard", index: !0, caseSensitive: void 0, module: "/build/routes/dashboard._index-JBJW3CDA.js", imports: ["/build/_shared/chunk-36ODWHMZ.js", "/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/main-dashboard": { id: "routes/main-dashboard", parentId: "root", path: "main-dashboard", index: void 0, caseSensitive: void 0, module: "/build/routes/main-dashboard-AA2FRI7K.js", imports: ["/build/_shared/chunk-36ODWHMZ.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId": { id: "routes/posts.$postId", parentId: "root", path: "posts/:postId", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId-GEVDNPHB.js", imports: ["/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId.destroy": { id: "routes/posts.$postId.destroy", parentId: "routes/posts.$postId", path: "destroy", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId.destroy-QJD7CVP4.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId_.update": { id: "routes/posts.$postId_.update", parentId: "root", path: "posts/:postId/update", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId_.update-YDXDBDK3.js", imports: ["/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/profile": { id: "routes/profile", parentId: "root", path: "profile", index: void 0, caseSensitive: void 0, module: "/build/routes/profile-LXCHMBVT.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/signin": { id: "routes/signin", parentId: "root", path: "signin", index: void 0, caseSensitive: void 0, module: "/build/routes/signin-TTPXRYMS.js", imports: ["/build/_shared/chunk-QUYRSHBJ.js", "/build/_shared/chunk-G7CHZRZX.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/signup": { id: "routes/signup", parentId: "root", path: "signup", index: void 0, caseSensitive: void 0, module: "/build/routes/signup-SKUY376W.js", imports: ["/build/_shared/chunk-QUYRSHBJ.js", "/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/users._index": { id: "routes/users._index", parentId: "root", path: "users", index: !0, caseSensitive: void 0, module: "/build/routes/users._index-6AIM527Q.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "6f6078fd", hmr: { runtime: "/build/_shared/chunk-HKPYBBGK.js", timestamp: 1731406534536 }, url: "/build/manifest-6F6078FD.js" };

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
