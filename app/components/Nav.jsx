import { useState, useEffect, useRef } from "react";
import { NavLink } from "@remix-run/react";

export default function Nav({ user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu when a link is clicked
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Close menu when the close button (✖) is clicked
  const closeMobileMenu = (event) => {
    // Prevent the button's onClick from triggering when the close icon is clicked
    event.stopPropagation();
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-full">
      <nav className="bg-gray-800">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex w-full h-16 items-center ">
            <div className="flex w-full items-center">
              <div className="flex w-full justify-between">
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <div className="shrink-0">{/* Logo */}</div>
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        `text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${
                          isActive ? "bg-gray-900 text-white" : ""
                        }`
                      }
                      onClick={handleLinkClick} // Close the menu on link click
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/add-event"
                      className={({ isActive }) =>
                        `text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${
                          isActive ? "bg-gray-900 text-white" : ""
                        }`
                      }
                      onClick={handleLinkClick} // Close the menu on link click
                    >
                      Add Post
                    </NavLink>
                    <NavLink
                      to="/locations"
                      className={({ isActive }) =>
                        `text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${
                          isActive ? "bg-gray-900 text-white" : ""
                        }`
                      }
                      onClick={handleLinkClick} // Close the menu on link click
                    >
                      See spots
                    </NavLink>
                  </div>
                </div>
                <div className=" items-center hidden md:flex">
                  <NavLink
                    to={`/profile/${user?._id}`}
                    className={({ isActive }) =>
                      `text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${
                        isActive ? "bg-gray-900 text-white" : ""
                      }`
                    }
                    onClick={handleLinkClick} // Close the menu on link click
                  >
                    Profile
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMobileMenu} // Toggle menu visibility
                className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <span className="block">☰</span> // Open icon when menu is closed
                ) : (
                  <span
                    className="block"
                    onClick={closeMobileMenu} // Close the menu when close button (✖) is clicked
                  >
                    ✖
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef} // Reference for detecting clicks outside the menu
          className="md:hidden bg-gray-800 px-2 pt-2 pb-3 space-y-1 sm:px-3"
        >
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium ${
                isActive ? "bg-gray-900 text-white" : ""
              }`
            }
            onClick={handleLinkClick} // Close the menu on link click
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/add-post"
            className={({ isActive }) =>
              `text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium ${
                isActive ? "bg-gray-900 text-white" : ""
              }`
            }
            onClick={handleLinkClick} // Close the menu on link click
          >
            Add Post
          </NavLink>
          <NavLink
            to="/locations"
            className={({ isActive }) =>
              `text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium ${
                isActive ? "bg-gray-900 text-white" : ""
              }`
            }
            onClick={handleLinkClick} // Close the menu on link click
          >
            See spots
          </NavLink>
          <NavLink
            to={`/profile/${user?._id}`}
            className={({ isActive }) =>
              `text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium ${
                isActive ? "bg-gray-900 text-white" : ""
              }`
            }
            onClick={handleLinkClick} // Close the menu on link click
          >
            Profile
          </NavLink>
        </div>
      )}
    </div>
  );
}
