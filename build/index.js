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
    // Field for last name
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
    likes: { type: Number, default: 0 },
    // Default likes to 0
    tags: [String]
  },
  { timestamps: !0 }
), User = mongoose.model("User", userSchema), Post = mongoose.model("Post", postSchema);
async function initData() {
  let userCount = await User.countDocuments(), postCount = await Post.countDocuments();
  (userCount === 0 || postCount === 0) && await insertData();
}
async function insertData() {
  console.log("Dropping collections..."), await User.collection.drop().catch(() => console.log("User collection does not exist.")), await Post.collection.drop().catch(() => console.log("Post collection does not exist.")), console.log("Inserting data...");
  let nicolai = await User.create({
    image: "https://www.baaa.dk/media/b5ahrlra/maria-louise-bendixen.jpg?anchor=center&mode=crop&width=800&height=450&rnd=132792921650330000&format=webp",
    mail: "test@test.com",
    name: "Nicolai",
    lastname: "Doe",
    // Example last name
    password: "1234",
    // Plain text password (hashed by the pre-save hook)
    hobbies: ["Surf", "Ski"]
    // Example hobbies
  });
  console.log("Inserted user:", nicolai);
}
var models = [
  { name: "User", schema: userSchema, collection: "users" },
  { name: "Post", schema: postSchema, collection: "posts" }
], models_default = models;

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
    models_default.length,
    models_default.length === 1 ? "model" : "models",
    models_default.map((model) => model.name).join(", ")
  );
  for (let model of models_default)
    mongoose2.model(model.name, model.schema, model.collection);
  let readyState = mongoose2.connection.readyState;
  if (readyState > 0) {
    console.log(
      "Mongoose: Re-using existing connection (readyState: %d)",
      readyState
    );
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
var tailwind_default = "/build/_assets/tailwind-HKD6J3FY.css";

// app/components/Nav.jsx
import { useState, useEffect, useRef } from "react";
import { NavLink } from "@remix-run/react";
import { jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";
function Nav() {
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
              to: "/add-post",
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
            to: "/profile",
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
                onClick: (event) => {
                  event.stopPropagation(), setIsMobileMenuOpen(!1);
                },
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
              to: "/profile",
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
        }, this),
        /* @__PURE__ */ jsxDEV4("footer", {}, void 0, !1, {
          fileName: "app/root.jsx",
          lineNumber: 46,
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
import { useState as useState2 } from "react";
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
  let { post } = useLoaderData2(), [image, setImage] = useState2(post.image), navigate = useNavigate();
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
import { useEffect as useEffect2, useState as useState3 } from "react";
import { jsxDEV as jsxDEV6 } from "react/jsx-dev-runtime";
var DashboardData = () => {
  let [weatherData, setWeatherData] = useState3(null), [city, setCity] = useState3("Loading..."), [country, setCountry] = useState3(""), [inputCity, setInputCity] = useState3(""), [error, setError] = useState3(""), [activeTab, setActiveTab] = useState3("wind"), apiKey = "84c59fa875b07f0e54b6dd1ce011f187", fetchWeatherData = async (city2) => {
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
  return /* @__PURE__ */ jsxDEV6("div", { className: "flex flex-col p-4", children: [
    /* @__PURE__ */ jsxDEV6("form", { className: "flex justify-center mt-20", onSubmit: handleSearch, children: [
      /* @__PURE__ */ jsxDEV6(
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
      /* @__PURE__ */ jsxDEV6("button", { className: "bg-slate-50 rounded-r-2xl p-2", type: "submit", children: "\u{1F50D}" }, void 0, !1, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 130,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 122,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV6("div", { className: "flex flex-col md:flex-row", children: [
      /* @__PURE__ */ jsxDEV6("div", { className: "md:w-3/6 md:justify-center md:mx-auto", children: [
        /* @__PURE__ */ jsxDEV6("div", { className: "mt-4 flex justify-center flex-col", children: /* @__PURE__ */ jsxDEV6("div", { children: [
          /* @__PURE__ */ jsxDEV6("h1", { className: "text-7xl font-bold text-center mt-2 capitalize", children: city }, void 0, !1, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 138,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV6("p", { className: "text-4xl font-semibold text-center", children: [
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
        error && /* @__PURE__ */ jsxDEV6("p", { className: "text-red-500 text-center", children: error }, void 0, !1, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 145,
          columnNumber: 21
        }, this),
        weatherData ? /* @__PURE__ */ jsxDEV6("div", { className: "bg-s-100 rounded-xl w-full p-6 mt-4 mx-auto", children: [
          /* @__PURE__ */ jsxDEV6("p", { className: "text-3xl flex items-center gap-3", children: [
            "\u{1F321} ",
            weatherData.list[0].main.temp,
            " \xB0C"
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 149,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV6("p", { children: [
            "Feels Like: ",
            weatherData.list[0].main.feels_like,
            " \xB0C"
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 152,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV6("p", { children: [
            "Min Temp: ",
            weatherData.list[0].main.temp_min,
            " \xB0C"
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 153,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV6("p", { children: [
            "Max Temp: ",
            weatherData.list[0].main.temp_max,
            " \xB0C"
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 154,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV6("p", { className: "text-3xl flex items-center gap-3", children: [
            getWeatherEmoji(weatherData.list[0].weather[0].description),
            " ",
            weatherData.list[0].weather[0].description
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 155,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV6("p", { children: [
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
          /* @__PURE__ */ jsxDEV6("p", { className: "text-3xl flex items-center gap-3", children: [
            "\u{1F4A8} ",
            weatherData.list[0].wind.speed,
            " m/s"
          ] }, void 0, !0, {
            fileName: "app/components/DashboardData.jsx",
            lineNumber: 164,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV6("p", { children: [
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
        }, this) : /* @__PURE__ */ jsxDEV6("p", { className: "text-center mt-4", children: "Loading weather data..." }, void 0, !1, {
          fileName: "app/components/DashboardData.jsx",
          lineNumber: 173,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 135,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV6("div", { className: "w-full h-96 px-4", children: [
        /* @__PURE__ */ jsxDEV6("div", { className: "flex mt-4", children: [
          /* @__PURE__ */ jsxDEV6(
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
          /* @__PURE__ */ jsxDEV6(
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
          /* @__PURE__ */ jsxDEV6(
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
        activeTab === "wind" && weatherData && /* @__PURE__ */ jsxDEV6(
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
        activeTab === "swell" && weatherData && /* @__PURE__ */ jsxDEV6(
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
        activeTab === "temp" && weatherData && /* @__PURE__ */ jsxDEV6(
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
  default: () => Post2,
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
function Post2() {
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
import { useState as useState4 } from "react";
import { jsxDEV as jsxDEV12 } from "react/jsx-dev-runtime";
var meta5 = () => [{ title: "Remix Post App - Add New Post" }];
async function loader6({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
}
function AddPost() {
  let [image, setImage] = useState4("https://placehold.co/600x400?text=Add+your+amazing+image"), navigate = useNavigate2();
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
import "@remix-run/react";
import { jsxDEV as jsxDEV13 } from "react/jsx-dev-runtime";
async function loader7({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
}
function Profile() {
  let user = useLoaderData5();
  return /* @__PURE__ */ jsxDEV13("div", { className: "page", children: [
    /* @__PURE__ */ jsxDEV13("div", { className: "bg-slate-800 p-8", children: /* @__PURE__ */ jsxDEV13("div", { className: "flex justify-center items-center space-x-4", children: [
      /* @__PURE__ */ jsxDEV13(
        "img",
        {
          src: user.avatar,
          alt: "Profile",
          className: "rounded-full h-24 w-24 border-4 border-white"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/profile.jsx",
          lineNumber: 20,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV13("div", { children: [
        /* @__PURE__ */ jsxDEV13("p", { className: "text-white font-bold text-3xl", children: [
          user.name,
          " ",
          user.lastname
        ] }, void 0, !0, {
          fileName: "app/routes/profile.jsx",
          lineNumber: 26,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV13("p", { className: "text-white text-lg", children: user.mail }, void 0, !1, {
          fileName: "app/routes/profile.jsx",
          lineNumber: 29,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV13("p", { className: "text-white", children: [
          "Your sports: ",
          user.hobbies.join(", ")
        ] }, void 0, !0, {
          fileName: "app/routes/profile.jsx",
          lineNumber: 30,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/profile.jsx",
        lineNumber: 25,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 19,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 18,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV13(Form4, { method: "post", className: "flex justify-center mt-4", children: /* @__PURE__ */ jsxDEV13("button", { className: "bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700", children: "Logout" }, void 0, !1, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 36,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/profile.jsx",
      lineNumber: 35,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/profile.jsx",
    lineNumber: 17,
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
import { useState as useState5, useRef as useRef2, useEffect as useEffect3 } from "react";
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
  let loaderData = useLoaderData7(), [selectedHobbies, setSelectedHobbies] = useState5([]), [dropdownOpen, setDropdownOpen] = useState5(!1), dropdownRef = useRef2(null), sportsOptions = ["Surf", "Ski", "Kite"], toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }, handleCheckboxChange = (event) => {
    let { value, checked } = event.target;
    setSelectedHobbies(
      (prev) => checked ? [...prev, value] : prev.filter((hobby) => hobby !== value)
    );
  };
  return useEffect3(() => {
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
var assets_manifest_default = { entry: { module: "/build/entry.client-HCYC4TVW.js", imports: ["/build/_shared/chunk-ZWGWGGVF.js", "/build/_shared/chunk-6CCLUK2Q.js", "/build/_shared/chunk-GIAAE3CH.js", "/build/_shared/chunk-XU7DNSPJ.js", "/build/_shared/chunk-BOXFZXVX.js", "/build/_shared/chunk-HKPYBBGK.js", "/build/_shared/chunk-UWV35TSL.js", "/build/_shared/chunk-PNG5AS42.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-WCTWWKGD.js", imports: ["/build/_shared/chunk-SARLQUTN.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-YBNG2UBP.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/add-post": { id: "routes/add-post", parentId: "root", path: "add-post", index: void 0, caseSensitive: void 0, module: "/build/routes/add-post-GSATLGJD.js", imports: ["/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/dashboard._index": { id: "routes/dashboard._index", parentId: "root", path: "dashboard", index: !0, caseSensitive: void 0, module: "/build/routes/dashboard._index-BKDLEUVS.js", imports: ["/build/_shared/chunk-Y5YAR7JF.js", "/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/main-dashboard": { id: "routes/main-dashboard", parentId: "root", path: "main-dashboard", index: void 0, caseSensitive: void 0, module: "/build/routes/main-dashboard-3Z7EBUDG.js", imports: ["/build/_shared/chunk-Y5YAR7JF.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId": { id: "routes/posts.$postId", parentId: "root", path: "posts/:postId", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId-GEVDNPHB.js", imports: ["/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId.destroy": { id: "routes/posts.$postId.destroy", parentId: "routes/posts.$postId", path: "destroy", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId.destroy-QJD7CVP4.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/posts.$postId_.update": { id: "routes/posts.$postId_.update", parentId: "root", path: "posts/:postId/update", index: void 0, caseSensitive: void 0, module: "/build/routes/posts.$postId_.update-YDXDBDK3.js", imports: ["/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/profile": { id: "routes/profile", parentId: "root", path: "profile", index: void 0, caseSensitive: void 0, module: "/build/routes/profile-S36GYSDU.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/signin": { id: "routes/signin", parentId: "root", path: "signin", index: void 0, caseSensitive: void 0, module: "/build/routes/signin-TTPXRYMS.js", imports: ["/build/_shared/chunk-QUYRSHBJ.js", "/build/_shared/chunk-G7CHZRZX.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/signup": { id: "routes/signup", parentId: "root", path: "signup", index: void 0, caseSensitive: void 0, module: "/build/routes/signup-SKUY376W.js", imports: ["/build/_shared/chunk-QUYRSHBJ.js", "/build/_shared/chunk-GMSPC5K3.js", "/build/_shared/chunk-G7CHZRZX.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/users._index": { id: "routes/users._index", parentId: "root", path: "users", index: !0, caseSensitive: void 0, module: "/build/routes/users._index-6AIM527Q.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "24d3d6b3", hmr: { runtime: "/build/_shared/chunk-HKPYBBGK.js", timestamp: 1732603477017 }, url: "/build/manifest-24D3D6B3.js" };

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
