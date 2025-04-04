import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSignOutAlt, 
  faHome, 
  faUpload, 
  faSearch, 
  faPlus,
  faBars,
  faTimes,
  faUserCircle,
  faChevronLeft,
  faSignInAlt
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../assets/gyansys-logo-black.png";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isHoverSidebarOpen, setIsHoverSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("skillActivities");
    localStorage.removeItem("recentSearches");
    localStorage.removeItem("resumesPerPage");
    setUser(null);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: "Home", path: "/", icon: faHome },
    { name: "Upload Resume", path: "/upload", icon: faUpload },
    { name: "Find Resumes", path: "/find", icon: faSearch },
    { name: "Add Skill", path: "/addSkill", icon: faPlus },
  ];

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMouseEnter = () => {
    setIsHoverSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    setIsHoverSidebarOpen(false);
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left section - Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src={Logo} 
                  alt="GyanSys Logo" 
                  className="h-10 cursor-pointer transition-all duration-200 hover:opacity-80" 
                  onClick={() => navigate("/")} 
                />
                <span className="ml-3 text-gray-700 font-medium text-lg">
                  | Resume Filter
                </span>
              </div>
            </div>

            {/* Right section - only hamburger menu */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileSidebar}
                className="md:hidden inline-flex items-center justify-center p-2 ml-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                <FontAwesomeIcon 
                  icon={isMobileSidebarOpen ? faTimes : faBars} 
                  className="block h-6 w-6" 
                />
              </button>

              {/* Hover sidebar trigger for desktop */}
              <div 
                className="hidden md:flex items-center justify-center ml-4 cursor-pointer p-1 rounded-md hover:bg-gray-100"
                onClick={() => setIsHoverSidebarOpen(!isHoverSidebarOpen)}
              >
                <FontAwesomeIcon icon={faBars} className="text-gray-600 text-lg" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar (left side) */}
      <div 
        className={`md:hidden fixed inset-0 z-20 transform transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative w-full max-w-xs h-full bg-white shadow-xl">
          <div className="px-4 pt-5 pb-2 flex justify-between items-center border-b border-gray-200">
            <div className="flex items-center">
              <img 
                src={Logo} 
                alt="GyanSys Logo" 
                className="h-10 cursor-pointer transition-all duration-200 hover:opacity-80" 
                onClick={() => {
                  navigate("/");
                  setIsMobileSidebarOpen(false);
                }} 
              />
              <span className="ml-3 text-gray-700 font-medium text-lg">
                Resume Filter
              </span>
            </div>
            <button 
              onClick={toggleMobileSidebar}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Close menu</span>
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>
          </div>

          {/* User info if logged in */}
          {user && (
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                  <FontAwesomeIcon icon={faUserCircle} className="text-xl" />
                </div>
                <span className="ml-2 text-gray-700 font-medium">
                  {user.firstName || user.email}
                </span>
              </div>
            </div>
          )}

          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 flex items-center ${
                  isActive(item.path)
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-3 ml-1" />
                {item.name}
              </button>
            ))}
            
            {/* Authentication buttons in mobile menu */}
            <hr className="border-gray-200 my-2" />
            
            {user ? (
              // Logout button for logged in users
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileSidebarOpen(false);
                }}
                className="w-full text-left px-4 py-3 flex items-center text-red-600 hover:bg-red-50"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 ml-1" />
                Sign out
              </button>
            ) : (
              // Login button for guests
              <button
                onClick={() => {
                  handleLogin();
                  setIsMobileSidebarOpen(false);
                }}
                className="w-full text-left px-4 py-3 flex items-center text-indigo-600 hover:bg-indigo-50"
              >
                <FontAwesomeIcon icon={faSignInAlt} className="mr-3 ml-1" />
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay when mobile sidebar is open */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-10"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Right hover sidebar for desktop - Professional Version */}
      <div
        ref={sidebarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`hidden md:block fixed right-0 top-0 h-full bg-white shadow-lg z-30 transition-all duration-300 ease-in-out ${
          isHoverSidebarOpen ? 'w-64' : 'w-1'
        }`}
        style={{ 
          boxShadow: isHoverSidebarOpen ? '0 0 15px rgba(0, 0, 0, 0.1)' : 'none',
          borderLeft: isHoverSidebarOpen ? '1px solid #e5e7eb' : 'none'
        }}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className={`border-b border-gray-200 p-4 flex justify-between items-center ${
            isHoverSidebarOpen ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-200`}>
            <h2 className="font-medium text-gray-800">Navigation</h2>
            <button
              onClick={() => setIsHoverSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          </div>
          
          {/* User info if logged in */}
          {user && isHoverSidebarOpen && (
            <div className="px-4 py-3 border-b border-gray-200 flex items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                <FontAwesomeIcon icon={faUserCircle} className="text-xl" />
              </div>
              <span className="ml-3 text-gray-700 font-medium">
                {user.firstName || user.email}
              </span>
            </div>
          )}

          {/* Sidebar content */}
          <div className={`flex-1 overflow-y-auto py-6 px-4 ${
            isHoverSidebarOpen ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-200`}>
            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full text-left px-4 py-3 flex items-center rounded-lg transition-colors duration-150 ${
                    isActive(item.path)
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-3 w-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
              
              {/* Authentication section */}
              <div className="pt-6 pb-3">
                <div className="border-t border-gray-200"></div>
              </div>
              
              {user ? (
                // Logout button for logged in users
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 flex items-center rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 w-5" />
                  <span className="font-medium">Sign out</span>
                </button>
              ) : (
                // Login button for guests
                <button
                  onClick={handleLogin}
                  className="w-full text-left px-4 py-3 flex items-center rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="mr-3 w-5" />
                  <span className="font-medium">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hover trigger area when sidebar is closed */}
      {!isHoverSidebarOpen && (
        <div 
          className="hidden md:block fixed right-0 top-0 h-full w-2 z-20 cursor-pointer"
          onMouseEnter={handleMouseEnter}
        />
      )}
    </>
  );
};

export default Navbar;