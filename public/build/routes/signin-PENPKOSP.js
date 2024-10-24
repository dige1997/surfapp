import {
  require_session
} from "/build/_shared/chunk-QUYRSHBJ.js";
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
} from "/build/_shared/chunk-6MDPFZXO.js";
import "/build/_shared/chunk-GIAAE3CH.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XU7DNSPJ.js";
import {
  createHotContext
} from "/build/_shared/chunk-CFF6AHJP.js";
import "/build/_shared/chunk-UWV35TSL.js";
import "/build/_shared/chunk-BOXFZXVX.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/signin.jsx
var import_node = __toESM(require_node(), 1);
var import_auth = __toESM(require_auth(), 1);
var import_session = __toESM(require_session(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/signin.jsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/signin.jsx"
  );
  import.meta.hot.lastModified = "1729768150740.2131";
}
function SignIn() {
  _s();
  const loaderData = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { id: "sign-in-page", className: "bg-slate-200 flex flex-col justify-center items-center rounded-lg h-80 w-72 ml-auto mr-auto mt-52 p-4 gap-3", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl w-auto", children: "Sign In" }, void 0, false, {
      fileName: "app/routes/signin.jsx",
      lineNumber: 54,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { id: "sign-in-form", method: "post", className: "flex items-center flex-col gap-1 w-full", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "mail", children: "Mail" }, void 0, false, {
        fileName: "app/routes/signin.jsx",
        lineNumber: 56,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "mail", type: "email", name: "mail", "aria-label": "mail", placeholder: "Type your mail...", required: true, className: "p-2 rounded-xl w-full" }, void 0, false, {
        fileName: "app/routes/signin.jsx",
        lineNumber: 57,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "password", className: "", children: "Password" }, void 0, false, {
        fileName: "app/routes/signin.jsx",
        lineNumber: 59,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "password", type: "password", name: "password", "aria-label": "password", placeholder: "Type your password...", autoComplete: "current-password", className: "p-2 rounded-xl w-full" }, void 0, false, {
        fileName: "app/routes/signin.jsx",
        lineNumber: 62,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-sky-500 text-white hover:bg-sky-600 transition-colors p-2 rounded-xl mt-2 w-32 flex justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { children: "Sign In" }, void 0, false, {
        fileName: "app/routes/signin.jsx",
        lineNumber: 64,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/signin.jsx",
        lineNumber: 63,
        columnNumber: 9
      }, this),
      loaderData?.error ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "error-message", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: loaderData?.error?.message }, void 0, false, {
        fileName: "app/routes/signin.jsx",
        lineNumber: 68,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/signin.jsx",
        lineNumber: 67,
        columnNumber: 30
      }, this) : null
    ] }, void 0, true, {
      fileName: "app/routes/signin.jsx",
      lineNumber: 55,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "flex", children: [
      "No account?",
      " ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(NavLink, { to: "/signup", className: "text-sky-500", children: "Sign up here." }, void 0, false, {
        fileName: "app/routes/signin.jsx",
        lineNumber: 73,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/signin.jsx",
      lineNumber: 71,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/signin.jsx",
    lineNumber: 53,
    columnNumber: 10
  }, this);
}
_s(SignIn, "ceKF1Gd7W4lGV+M78eBsU+KQIkw=", false, function() {
  return [useLoaderData];
});
_c = SignIn;
var _c;
$RefreshReg$(_c, "SignIn");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  SignIn as default
};
//# sourceMappingURL=/build/routes/signin-PENPKOSP.js.map
