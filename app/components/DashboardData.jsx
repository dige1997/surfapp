import React, { useEffect, useState } from "react";

const DashboardData = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Loading...");
  const [inputCity, setInputCity] = useState("");
  const apiKey = "84c59fa875b07f0e54b6dd1ce011f187";

  // Function to fetch weather data based on city name
  const fetchWeatherData = async (city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
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

  // Function to fetch the user's location and get the city name
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

  // Geolocation API - get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCityByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setCity("Copenhagen"); // Fallback city in case of error
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setCity("Copenhagen"); // Fallback city if geolocation is unavailable
    }
  };

  useEffect(() => {
    getUserLocation(); // Get user's location on component mount
  }, []);

  useEffect(() => {
    if (city !== "Loading...") {
      fetchWeatherData(city); // Fetch weather data when the city changes
    }
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (inputCity) {
      setCity(inputCity); // Update the city state to the user's input
      setInputCity(""); // Clear the input field
    }
  };

  return (
    <div className="flex flex-col  p-4">
      <div className="">
        <form className="flex flex-row  justify-center" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter city name"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            className="bg-slate-50 p-2 rounded-l-2xl focus:outline-none"
          />
          <button className="bg-slate-50 rounded-r-2xl p-2 " type="submit">
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                stroke="gray"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </form>
        <h1 className="text-3xl font-bold justify-center flex"> {city}</h1>
      </div>
      {weatherData ? (
        <div className="bg-s-100 rounded-xl w-1/2 justify-normal p-6">
          {weatherData.list && weatherData.list.length > 0 ? (
            <>
              <p className="flex flex-row text-3xl gap-3 items-center">
                <svg
                  fill="#000000"
                  width="20px"
                  height="20px"
                  viewBox="0 0 32 32"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>temperature-half</title>
                  <path d="M20.75 6.008c0-6.246-9.501-6.248-9.5 0v13.238c-1.235 1.224-2 2.921-2 4.796 0 3.728 3.022 6.75 6.75 6.75s6.75-3.022 6.75-6.75c0-1.875-0.765-3.572-2-4.796l-0.001-0zM16 29.25c-2.9-0-5.25-2.351-5.25-5.251 0-1.553 0.674-2.948 1.745-3.909l0.005-0.004 0.006-0.012c0.13-0.122 0.215-0.29 0.231-0.477l0-0.003c0.001-0.014 0.007-0.024 0.008-0.038l0.006-0.029v-13.52c-0.003-0.053-0.005-0.115-0.005-0.178 0-1.704 1.381-3.085 3.085-3.085 0.060 0 0.12 0.002 0.179 0.005l-0.008-0c0.051-0.003 0.11-0.005 0.17-0.005 1.704 0 3.085 1.381 3.085 3.085 0 0.063-0.002 0.125-0.006 0.186l0-0.008v13.52l0.006 0.029 0.007 0.036c0.015 0.191 0.101 0.36 0.231 0.482l0 0 0.006 0.012c1.076 0.966 1.75 2.361 1.75 3.913 0 2.9-2.35 5.25-5.25 5.251h-0zM16.75 21.367v-7.866c0-0.414-0.336-0.75-0.75-0.75s-0.75 0.336-0.75 0.75v0 7.866c-1.164 0.338-2 1.394-2 2.646 0 1.519 1.231 2.75 2.75 2.75s2.75-1.231 2.75-2.75c0-1.252-0.836-2.308-1.981-2.641l-0.019-0.005zM26.5 2.25c-1.795 0-3.25 1.455-3.25 3.25s1.455 3.25 3.25 3.25c1.795 0 3.25-1.455 3.25-3.25v0c-0.002-1.794-1.456-3.248-3.25-3.25h-0zM26.5 7.25c-0.966 0-1.75-0.784-1.75-1.75s0.784-1.75 1.75-1.75c0.966 0 1.75 0.784 1.75 1.75v0c-0.001 0.966-0.784 1.749-1.75 1.75h-0z"></path>
                </svg>{" "}
                {weatherData.list[0].main.temp} °C
              </p>
              <p>Feels Like: {weatherData.list[0].main.feels_like} °C</p>
              <p className="flex flex-row gap-3 text-3xl items-center">
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.45508 2V3M11.3438 3.61084L10.6366 4.31795M4.27344 10.6821L3.56633 11.3892M1.95508 7.5H2.95508M3.56641 3.61084L4.27351 4.31795M6.50049 9.21251C6.38862 9.15163 6.2832 9.08038 6.18553 9.00006C5.73952 8.63325 5.45508 8.07714 5.45508 7.45459C5.45508 6.35002 6.35051 5.45459 7.45508 5.45459C8.21398 5.45459 8.87416 5.87727 9.21303 6.50006C9.29756 6.65541 9.3621 6.82321 9.40319 7M9.8 21C7.14903 21 5 18.9466 5 16.4137C5 14.3144 6.6 12.375 9 12C9.75283 10.274 11.5346 9 13.6127 9C16.2747 9 18.4504 10.9907 18.6 13.5C20.0127 14.0956 21 15.5574 21 17.1402C21 19.2719 19.2091 21 17 21L9.8 21Z"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {weatherData.list[0].weather[0].description}
              </p>
              <p className="flex flex-row gap-3 text-3xl items-center">
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.0066 3.25608C16.8483 2.85737 19.1331 2.8773 22.2423 3.65268C22.7781 3.78629 23.1038 4.32791 22.9699 4.86241C22.836 5.39691 22.2931 5.7219 21.7573 5.58829C18.8666 4.86742 16.9015 4.88747 15.4308 5.20587C13.9555 5.52524 12.895 6.15867 11.7715 6.84363L11.6874 6.89494C10.6044 7.55565 9.40515 8.28729 7.82073 8.55069C6.17734 8.82388 4.23602 8.58235 1.62883 7.54187C1.11607 7.33724 0.866674 6.75667 1.0718 6.24513C1.27692 5.73359 1.85889 5.48479 2.37165 5.68943C4.76435 6.6443 6.32295 6.77699 7.492 6.58265C8.67888 6.38535 9.58373 5.83916 10.7286 5.14119C11.855 4.45445 13.1694 3.6538 15.0066 3.25608Z"
                    fill="#0F0F0F"
                  />
                  <path
                    d="M22.2423 7.64302C19.1331 6.86765 16.8483 6.84772 15.0066 7.24642C13.1694 7.64415 11.855 8.44479 10.7286 9.13153C9.58373 9.8295 8.67888 10.3757 7.492 10.573C6.32295 10.7673 4.76435 10.6346 2.37165 9.67977C1.85889 9.47514 1.27692 9.72393 1.0718 10.2355C0.866674 10.747 1.11607 11.3276 1.62883 11.5322C4.23602 12.5727 6.17734 12.8142 7.82073 12.541C9.40515 12.2776 10.6044 11.546 11.6874 10.8853L11.7715 10.834C12.895 10.149 13.9555 9.51558 15.4308 9.19621C16.9015 8.87781 18.8666 8.85777 21.7573 9.57863C22.2931 9.71224 22.836 9.38726 22.9699 8.85275C23.1038 8.31825 22.7781 7.77663 22.2423 7.64302Z"
                    fill="#0F0F0F"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.9998 10.0266C18.6526 10.0266 18.3633 10.2059 18.1614 10.4772C18.0905 10.573 17.9266 10.7972 17.7089 11.111C17.4193 11.5283 17.0317 12.1082 16.6424 12.7555C16.255 13.3996 15.8553 14.128 15.5495 14.8397C15.2567 15.5213 14.9989 16.2614 14.9999 17.0117C15.0006 17.2223 15.0258 17.4339 15.0604 17.6412C15.1182 17.9872 15.2356 18.4636 15.4804 18.9521C15.7272 19.4446 16.1131 19.9674 16.7107 20.3648C17.3146 20.7664 18.0748 21 18.9998 21C19.9248 21 20.685 20.7664 21.2888 20.3648C21.8864 19.9674 22.2724 19.4446 22.5192 18.9522C22.764 18.4636 22.8815 17.9872 22.9393 17.6413C22.974 17.4337 22.9995 17.2215 22.9998 17.0107C23.0001 16.2604 22.743 15.5214 22.4501 14.8397C22.1444 14.128 21.7447 13.3996 21.3573 12.7555C20.968 12.1082 20.5803 11.5283 20.2907 11.111C20.073 10.7972 19.909 10.573 19.8382 10.4772C19.6363 10.2059 19.3469 10.0266 18.9998 10.0266ZM20.6119 15.6257C20.3552 15.0281 20.0049 14.3848 19.6423 13.782C19.4218 13.4154 19.2007 13.0702 18.9998 12.7674C18.7989 13.0702 18.5778 13.4154 18.3573 13.782C17.9948 14.3848 17.6445 15.0281 17.3878 15.6257L17.3732 15.6595C17.1965 16.0704 16.9877 16.5562 17.0001 17.0101C17.0121 17.3691 17.1088 17.7397 17.2693 18.0599C17.3974 18.3157 17.574 18.5411 17.8201 18.7048C18.06 18.8643 18.4248 19.0048 18.9998 19.0048C19.5748 19.0048 19.9396 18.8643 20.1795 18.7048C20.4256 18.5411 20.6022 18.3156 20.7304 18.0599C20.8909 17.7397 20.9876 17.3691 20.9996 17.01C21.0121 16.5563 20.8032 16.0705 20.6265 15.6597L20.6119 15.6257Z"
                    fill="#0F0F0F"
                  />
                  <path
                    d="M14.1296 11.5308C14.8899 11.2847 15.4728 12.076 15.1153 12.7892C14.952 13.1151 14.7683 13.3924 14.4031 13.5214C13.426 13.8666 12.6166 14.3527 11.7715 14.8679L11.6874 14.9192C10.6044 15.5799 9.40516 16.3115 7.82074 16.5749C6.17735 16.8481 4.23604 16.6066 1.62884 15.5661C1.11608 15.3615 0.866688 14.7809 1.07181 14.2694C1.27694 13.7578 1.8589 13.509 2.37167 13.7137C4.76436 14.6685 6.32297 14.8012 7.49201 14.6069C8.67889 14.4096 9.58374 13.8634 10.7286 13.1654C11.8166 12.5021 12.9363 11.9171 14.1296 11.5308Z"
                    fill="#0F0F0F"
                  />
                </svg>
                {weatherData.list[0].main.humidity}%
              </p>
              <p className="flex flex-row gap-3 text-3xl items-center">
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 30 30"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
                >
                  <title>wind-flag</title>
                  <desc>Created with Sketch Beta.</desc>
                  <defs></defs>
                  <g
                    id="Page-1"
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                    sketch:type="MSPage"
                  >
                    <g
                      id="Icon-Set"
                      sketch:type="MSLayerGroup"
                      transform="translate(-465.000000, -776.000000)"
                      fill="#000000"
                    >
                      <path
                        d="M493,786.066 C493,786.877 492.935,787 492,787 L489,787.3 L489,779.7 L492,780 C492.935,780 493,780.123 493,780.934 L493,786.066 L493,786.066 Z M487,787.5 L481,788.1 L481,778.9 L487,779.5 L487,787.5 L487,787.5 Z M479,788.3 L472,789 C471.065,789 471,788.811 471,788 L471,779 C471,778.19 471.065,778 472,778 L479,778.7 L479,788.3 L479,788.3 Z M493,778 L471,776 C469.896,776 469,776.896 469,778 L469,789 C469,790.104 469.896,791 471,791 L493,789 C494.104,789 495,788.104 495,787 L495,780 C495,778.896 494.104,778 493,778 L493,778 Z M466,776 C465.447,776 465,776.448 465,777 L465,805 C465,805.553 465.447,806 466,806 C466.553,806 467,805.553 467,805 L467,777 C467,776.448 466.553,776 466,776 L466,776 Z"
                        id="wind-flag"
                        sketch:type="MSShapeGroup"
                      ></path>
                    </g>
                  </g>
                </svg>{" "}
                {weatherData.list[0].wind.speed} m/s
              </p>
            </>
          ) : (
            <p>No weather data available.</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DashboardData;
