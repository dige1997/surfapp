import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
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
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// empty-module:./services/auth.server
var require_auth = __commonJS({
  "empty-module:./services/auth.server"(exports, module) {
    module.exports = {};
  }
});

// app/tailwind.css
var tailwind_default = "/build/_assets/tailwind-FZTGOBIL.css";

// app/components/Nav.jsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/Nav.jsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/Nav.jsx"
  );
  import.meta.hot.lastModified = "1729764420049.6897";
}
function Nav() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "bg-slate-500", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(NavLink, { to: "/dashboard", children: "Posts" }, void 0, false, {
      fileName: "app/components/Nav.jsx",
      lineNumber: 24,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(NavLink, { to: "/add-post", children: "Add Post" }, void 0, false, {
      fileName: "app/components/Nav.jsx",
      lineNumber: 25,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(NavLink, { to: "/profile", children: "Profile" }, void 0, false, {
      fileName: "app/components/Nav.jsx",
      lineNumber: 26,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/Nav.jsx",
    lineNumber: 23,
    columnNumber: 10
  }, this);
}
_c = Nav;
var _c;
$RefreshReg$(_c, "Nav");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/root.jsx
var import_auth = __toESM(require_auth(), 1);
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/root.jsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/root.jsx"
  );
}
function links() {
  return [{
    rel: "stylesheet",
    href: tailwind_default
  }, {
    rel: "stylesheet",
    href: "/fonts/inter/inter.css"
  }];
}
function App() {
  _s();
  const user = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("html", { lang: "en", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("meta", { charSet: "utf-8" }, void 0, false, {
        fileName: "app/root.jsx",
        lineNumber: 44,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }, void 0, false, {
        fileName: "app/root.jsx",
        lineNumber: 45,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Meta, {}, void 0, false, {
        fileName: "app/root.jsx",
        lineNumber: 46,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Links, {}, void 0, false, {
        fileName: "app/root.jsx",
        lineNumber: 47,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/root.jsx",
      lineNumber: 43,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("body", { children: [
      user ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Nav, {}, void 0, false, {
        fileName: "app/root.jsx",
        lineNumber: 50,
        columnNumber: 17
      }, this) : null,
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Outlet, {}, void 0, false, {
        fileName: "app/root.jsx",
        lineNumber: 52,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(ScrollRestoration, {}, void 0, false, {
        fileName: "app/root.jsx",
        lineNumber: 53,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Scripts, {}, void 0, false, {
        fileName: "app/root.jsx",
        lineNumber: 54,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(LiveReload, {}, void 0, false, {
        fileName: "app/root.jsx",
        lineNumber: 55,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/root.jsx",
      lineNumber: 49,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/root.jsx",
    lineNumber: 42,
    columnNumber: 10
  }, this);
}
_s(App, "bH1LW0VjtDD5/q6YH82IbqfBSnU=", false, function() {
  return [useLoaderData];
});
_c2 = App;
var _c2;
$RefreshReg$(_c2, "App");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  App as default,
  links
};
//# sourceMappingURL=/build/root-HBSXKTRY.js.map
