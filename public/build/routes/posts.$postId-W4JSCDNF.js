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

// app/routes/posts.$postId.jsx
var import_node = __toESM(require_node(), 1);
var import_mongoose = __toESM(require_browser_umd(), 1);

// app/components/UserAvatar.jsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/UserAvatar.jsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/UserAvatar.jsx"
  );
  import.meta.hot.lastModified = "1729764420049.8423";
}
function UserAvatar({
  user
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "avatar", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: user.image, alt: user.name }, void 0, false, {
      fileName: "app/components/UserAvatar.jsx",
      lineNumber: 25,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { children: user.name }, void 0, false, {
        fileName: "app/components/UserAvatar.jsx",
        lineNumber: 27,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: user.title }, void 0, false, {
        fileName: "app/components/UserAvatar.jsx",
        lineNumber: 28,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/UserAvatar.jsx",
      lineNumber: 26,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/UserAvatar.jsx",
    lineNumber: 24,
    columnNumber: 10
  }, this);
}
_c = UserAvatar;
var _c;
$RefreshReg$(_c, "UserAvatar");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/PostCard.jsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/PostCard.jsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/PostCard.jsx"
  );
  import.meta.hot.lastModified = "1729764420049.7654";
}
function PostCard({
  post
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("article", { className: "post-card", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(UserAvatar, { user: post.user }, void 0, false, {
      fileName: "app/components/PostCard.jsx",
      lineNumber: 26,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("img", { src: post.image, alt: post.caption }, void 0, false, {
      fileName: "app/components/PostCard.jsx",
      lineNumber: 27,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h3", { children: post.caption }, void 0, false, {
      fileName: "app/components/PostCard.jsx",
      lineNumber: 28,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/PostCard.jsx",
    lineNumber: 25,
    columnNumber: 10
  }, this);
}
_c2 = PostCard;
var _c2;
$RefreshReg$(_c2, "PostCard");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/routes/posts.$postId.jsx
var import_auth = __toESM(require_auth(), 1);
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/posts.$postId.jsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/posts.$postId.jsx"
  );
  import.meta.hot.lastModified = "1729764420050.844";
}
function meta({
  data
}) {
  return [{
    title: `Remix Post App - ${data.post.caption || "Post"}`
  }];
}
function Post() {
  _s();
  const {
    post,
    authUser
  } = useLoaderData();
  function confirmDelete(event) {
    const response = confirm("Please confirm you want to delete this post.");
    if (!response) {
      event.preventDefault();
    }
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { id: "post-page", className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("h1", { children: post.caption }, void 0, false, {
      fileName: "app/routes/posts.$postId.jsx",
      lineNumber: 62,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(PostCard, { post }, void 0, false, {
      fileName: "app/routes/posts.$postId.jsx",
      lineNumber: 63,
      columnNumber: 7
    }, this),
    authUser._id === post.user._id && /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "btns", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Form, { action: "update", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("button", { children: "Update" }, void 0, false, {
        fileName: "app/routes/posts.$postId.jsx",
        lineNumber: 66,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/posts.$postId.jsx",
        lineNumber: 65,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Form, { action: "destroy", method: "post", onSubmit: confirmDelete, children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("button", { children: "Delete" }, void 0, false, {
        fileName: "app/routes/posts.$postId.jsx",
        lineNumber: 69,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/posts.$postId.jsx",
        lineNumber: 68,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/posts.$postId.jsx",
      lineNumber: 64,
      columnNumber: 42
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/posts.$postId.jsx",
    lineNumber: 61,
    columnNumber: 10
  }, this);
}
_s(Post, "1dVDoPRk8+sj6r+hHb/21FE4zZw=", false, function() {
  return [useLoaderData];
});
_c3 = Post;
var _c3;
$RefreshReg$(_c3, "Post");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Post as default,
  meta
};
//# sourceMappingURL=/build/routes/posts.$postId-W4JSCDNF.js.map
