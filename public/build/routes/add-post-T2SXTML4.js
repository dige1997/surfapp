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
  useNavigate
} from "/build/_shared/chunk-32OR2PNH.js";
import "/build/_shared/chunk-GIAAE3CH.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XU7DNSPJ.js";
import {
  createHotContext
} from "/build/_shared/chunk-HKPYBBGK.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  require_react
} from "/build/_shared/chunk-BOXFZXVX.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/add-post.jsx
var import_node = __toESM(require_node(), 1);
var import_mongoose = __toESM(require_browser_umd(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_auth = __toESM(require_auth(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/add-post.jsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/add-post.jsx"
  );
  import.meta.hot.lastModified = "1729764420050.5789";
}
var meta = () => {
  return [{
    title: "Remix Post App - Add New Post"
  }];
};
function AddPost() {
  _s();
  const [image, setImage] = (0, import_react2.useState)("https://placehold.co/600x400?text=Add+your+amazing+image");
  const navigate = useNavigate();
  function handleCancel() {
    navigate(-1);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: "Add a Post" }, void 0, false, {
      fileName: "app/routes/add-post.jsx",
      lineNumber: 47,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { id: "post-form", method: "post", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "caption", children: "Caption" }, void 0, false, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 49,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "caption", name: "caption", type: "text", "aria-label": "caption", placeholder: "Write a caption..." }, void 0, false, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 50,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "image", children: "Image URL" }, void 0, false, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 52,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { name: "image", type: "url", onChange: (e) => setImage(e.target.value), placeholder: "Paste an image URL..." }, void 0, false, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 53,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "image-preview", children: "Image Preview" }, void 0, false, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 55,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { id: "image-preview", className: "image-preview", src: image ? image : "https://placehold.co/600x400?text=Paste+an+image+URL", alt: "Choose", onError: (e) => e.target.src = "https://placehold.co/600x400?text=Error+loading+image" }, void 0, false, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 56,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "btns", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { children: "Save" }, void 0, false, {
          fileName: "app/routes/add-post.jsx",
          lineNumber: 59,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", className: "btn-cancel", onClick: handleCancel, children: "Cancel" }, void 0, false, {
          fileName: "app/routes/add-post.jsx",
          lineNumber: 60,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/add-post.jsx",
        lineNumber: 58,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/add-post.jsx",
      lineNumber: 48,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/add-post.jsx",
    lineNumber: 46,
    columnNumber: 10
  }, this);
}
_s(AddPost, "QpCxe6nt8u8U+ySuIgQvx54vUkc=", false, function() {
  return [useNavigate];
});
_c = AddPost;
var _c;
$RefreshReg$(_c, "AddPost");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  AddPost as default,
  meta
};
//# sourceMappingURL=/build/routes/add-post-T2SXTML4.js.map
