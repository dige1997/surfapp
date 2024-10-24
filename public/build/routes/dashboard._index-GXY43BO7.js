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
import {
  require_react
} from "/build/_shared/chunk-BOXFZXVX.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/dashboard._index.jsx
var import_node = __toESM(require_node(), 1);
var import_mongoose = __toESM(require_browser_umd(), 1);
var import_auth = __toESM(require_auth(), 1);

// app/components/DashboardData.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/DashboardData.jsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/DashboardData.jsx"
  );
  import.meta.hot.lastModified = "1729764420049.612";
}
var DashboardData = () => {
  _s();
  const [weatherData, setWeatherData] = (0, import_react.useState)(null);
  const [city, setCity] = (0, import_react.useState)("Loading...");
  const [inputCity, setInputCity] = (0, import_react.useState)("");
  const apiKey = "84c59fa875b07f0e54b6dd1ce011f187";
  const fetchWeatherData = async (city2) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city2}&appid=${apiKey}&units=metric`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  const fetchCityByCoordinates = async (lat, lon) => {
    const reverseGeoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    try {
      const response = await fetch(reverseGeoUrl);
      const data = await response.json();
      if (data && data.length > 0) {
        setCity(data[0].name);
      }
    } catch (error) {
      console.error("Error fetching city by coordinates:", error);
    }
  };
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const {
          latitude,
          longitude
        } = position.coords;
        fetchCityByCoordinates(latitude, longitude);
      }, (error) => {
        console.error("Error getting user location:", error);
        setCity("London");
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
      setCity("London");
    }
  };
  (0, import_react.useEffect)(() => {
    getUserLocation();
  }, []);
  (0, import_react.useEffect)(() => {
    if (city !== "Loading...") {
      fetchWeatherData(city);
    }
  }, [city]);
  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCity) {
      setCity(inputCity);
      setInputCity("");
    }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: [
      "Weather in ",
      city
    ] }, void 0, true, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 94,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", { onSubmit: handleSearch, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", placeholder: "Enter city name", value: inputCity, onChange: (e) => setInputCity(e.target.value) }, void 0, false, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 96,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", children: "Search" }, void 0, false, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 97,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 95,
      columnNumber: 7
    }, this),
    weatherData ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: weatherData.list && weatherData.list.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
        "Temperature: ",
        weatherData.list[0].main.temp,
        " \xB0C"
      ] }, void 0, true, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 101,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
        "Feels Like: ",
        weatherData.list[0].main.feels_like,
        " \xB0C"
      ] }, void 0, true, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 102,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
        "Weather: ",
        weatherData.list[0].weather[0].description
      ] }, void 0, true, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 103,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
        "Humidity: ",
        weatherData.list[0].main.humidity,
        "%"
      ] }, void 0, true, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 104,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
        "Wind Speed: ",
        weatherData.list[0].wind.speed,
        " m/s"
      ] }, void 0, true, {
        fileName: "app/components/DashboardData.jsx",
        lineNumber: 105,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 100,
      columnNumber: 62
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "No weather data available." }, void 0, false, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 106,
      columnNumber: 19
    }, this) }, void 0, false, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 99,
      columnNumber: 22
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Loading..." }, void 0, false, {
      fileName: "app/components/DashboardData.jsx",
      lineNumber: 107,
      columnNumber: 18
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/DashboardData.jsx",
    lineNumber: 93,
    columnNumber: 10
  }, this);
};
_s(DashboardData, "NwkBMFwa/Q7UVHuORWOgdYZiI+o=");
_c = DashboardData;
var DashboardData_default = DashboardData;
var _c;
$RefreshReg$(_c, "DashboardData");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/routes/dashboard._index.jsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/dashboard._index.jsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/dashboard._index.jsx"
  );
  import.meta.hot.lastModified = "1729764420050.683";
}
var meta = () => {
  return [{
    title: "Remix Post App"
  }];
};
function Index() {
  _s2();
  const {
    posts
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "page", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h1", { children: "Posts" }, void 0, false, {
      fileName: "app/routes/dashboard._index.jsx",
      lineNumber: 52,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(DashboardData_default, {}, void 0, false, {
      fileName: "app/routes/dashboard._index.jsx",
      lineNumber: 53,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/dashboard._index.jsx",
    lineNumber: 51,
    columnNumber: 10
  }, this);
}
_s2(Index, "TAfyE0i9dyPQ7/d8lmPxXUSIugM=", false, function() {
  return [useLoaderData];
});
_c2 = Index;
var _c2;
$RefreshReg$(_c2, "Index");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Index as default,
  meta
};
//# sourceMappingURL=/build/routes/dashboard._index-GXY43BO7.js.map
