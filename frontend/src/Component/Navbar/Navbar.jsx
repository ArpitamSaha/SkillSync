import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSignOutAlt, 
  faUserPlus, 
  faHome, 
  faUpload, 
  faSearch, 
  faPlus,
  faBars,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../assets/gyansys-logo-black.png";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: "Home", path: "/", icon: faHome },
    { name: "Upload", path: "/upload", icon: faUpload },
    { name: "Find", path: "/find", icon: faSearch },
    { name: "Add Skill", path: "/addSkill", icon: faPlus },
  ];

  return (
    <nav className="bg-white flex justify-between items-center px-4 md:px-8 py-3 shadow-md border-b border-gray-200 sticky top-0 z-10">
      {/* Logo Section */}
      <div className="flex items-center">
        <img 
          src={Logo} 
          alt="GyanSys Logo" 
          className="h-10 cursor-pointer transition-all duration-200 hover:opacity-80" 
          onClick={() => navigate("/")} 
        />
      </div>

      {/* Navigation Items - Center aligned for desktop */}
      <div className="hidden lg:flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`px-5 py-2 rounded-lg flex items-center transition-all duration-300 ${
              isActive(item.path)
                ? "bg-[#005792] text-white font-medium shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-[#005792]"
            }`}
          >
            <FontAwesomeIcon icon={item.icon} className={`mr-2 ${isActive(item.path) ? "" : "text-[#005792]"}`} />
            {item.name}
          </button>
        ))}
      </div>

      {/* Right Section: Logout Button & Mobile Menu Toggle */}
      <div className="flex items-center">
        {/* User Authentication Section */}
        {user ? (
          <div className="flex items-center">
            <span className="mr-3 hidden md:block font-medium text-gray-700">
              {user.name || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-sm"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center px-5 py-2 rounded-lg bg-[#005792] text-white hover:bg-[#004d80] transition-all duration-300 shadow-sm"
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Sign In
          </button>
        )}

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden flex items-center justify-center h-10 w-10 rounded-md text-gray-700 hover:bg-gray-100 transition-colors ml-4"
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="text-lg" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute top-16 right-0 w-64 bg-white h-screen p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg flex items-center transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-[#005792] text-white font-medium"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#005792]"
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-3" />
                  {item.name}
                </button>
              ))}
              
              {user && (
                <>
                  <hr className="my-3 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-lg flex items-center text-red-600 hover:bg-red-50 font-medium"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;