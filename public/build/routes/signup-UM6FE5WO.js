import {
  require_session
} from "/build/_shared/chunk-QUYRSHBJ.js";
import {
  require_browser_umd
} from "/build/_shared/chunk-GMSPC5K3.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  require_auth
} from "/build/_shared/chunk-SARLQUTN.js";
import {
  Form,
  NavLink,
  useLoaderData
} from "/build/_shared/chunk-32OR2PNH.js";
import "/build/_shared/chunk-GIAAE3CH.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XU7DNSPJ.js";
import {
  createHotContext
} from "/build/_shared/chunk-HKPYBBGK.js";
import "/build/_shared/chunk-UWV35TSL.js";
import "/build/_shared/chunk-BOXFZXVX.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/signup.jsx
var import_node = __toESM(require_node(), 1);
var import_mongoose = __toESM(require_browser_umd(), 1);
var import_auth = __toESM(require_auth(), 1);
var import_session = __toESM(require_session(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/signup.jsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/signup.jsx"
  );
  import.meta.hot.lastModified = "1729764420051.176";
}
function SignUp() {
  _s();
  const loaderData = useLoaderData();
  console.log("error:", loaderData?.error);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { id: "sign-up-page", className: "bg-slate-200 flex flex-col justify-center items-center rounded-lg h-80 w-72 ml-auto mr-auto mt-52 p-4 gap-3", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl w-auto", children: "Sign Up" }, void 0, false, {
      fileName: "app/routes/signup.jsx",
      lineNumber: 56,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { id: "sign-up-form", method: "post", className: "flex items-center flex-col gap-1 w-full", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "mail", children: "Mail" }, void 0, false, {
        fileName: "app/routes/signup.jsx",
        lineNumber: 58,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "mail", type: "email", name: "mail", "aria-label": "mail", placeholder: "Type your mail...", required: true, autoComplete: "off", className: "p-2 rounded-xl w-full" }, void 0, false, {
        fileName: "app/routes/signup.jsx",
        lineNumber: 59,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "password", children: "Password" }, void 0, false, {
        fileName: "app/routes/signup.jsx",
        lineNumber: 61,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "password", type: "password", name: "password", "aria-label": "password", placeholder: "Type your password...", autoComplete: "current-password", className: "p-2 rounded-xl w-full" }, void 0, false, {
        fileName: "app/routes/signup.jsx",
        lineNumber: 63,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-sky-500 text-white hover:bg-sky-600 transition-colors p-2 rounded-xl mt-2 w-32 flex justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { children: "Sign Up" }, void 0, false, {
        fileName: "app/routes/signup.jsx",
        lineNumber: 65,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/signup.jsx",
        lineNumber: 64,
        columnNumber: 9
      }, this),
      loaderData?.error ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "error-message", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: loaderData?.error?.message }, void 0, false, {
        fileName: "app/routes/signup.jsx",
        lineNumber: 69,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/signup.jsx",
        lineNumber: 68,
        columnNumber: 30
      }, this) : null
    ] }, void 0, true, {
      fileName: "app/routes/signup.jsx",
      lineNumber: 57,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
      "Already have an account?",
      " ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(NavLink, { to: "/signin", className: "text-sky-500", children: "Sign in here." }, void 0, false, {
        fileName: "app/routes/signup.jsx",
        lineNumber: 74,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/signup.jsx",
      lineNumber: 72,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/signup.jsx",
    lineNumber: 55,
    columnNumber: 10
  }, this);
}
_s(SignUp, "ceKF1Gd7W4lGV+M78eBsU+KQIkw=", false, function() {
  return [useLoaderData];
});
_c = SignUp;
var _c;
$RefreshReg$(_c, "SignUp");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  SignUp as default
};
//# sourceMappingURL=/build/routes/signup-UM6FE5WO.js.map
