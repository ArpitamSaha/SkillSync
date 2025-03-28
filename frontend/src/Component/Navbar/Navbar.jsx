// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { 
//   faSignOutAlt, 
//   faUserPlus, 
//   faHome, 
//   faUpload, 
//   faSearch, 
//   faPlus,
//   faBars,
//   faTimes
// } from "@fortawesome/free-solid-svg-icons";
// import Logo from "../../assets/gyansys-logo-black.png";

// const Navbar = ({ user, setUser }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/login");
//   };

//   const isActive = (path) => {
//     return location.pathname === path;
//   };

//   const navItems = [
//     { name: "Home", path: "/", icon: faHome },
//     { name: "Upload", path: "/upload", icon: faUpload },
//     { name: "Find", path: "/find", icon: faSearch },
//     { name: "Add Skill", path: "/addSkill", icon: faPlus },
//   ];

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <>
//       {/* Top Navbar */}
//       <nav className="bg-white flex justify-between items-center px-4 py-3 shadow-md border-b border-gray-200 sticky top-0 z-10">
//         {/* Logo Section */}
//         <div className="flex items-center">
//           <img 
//             src={Logo} 
//             alt="GyanSys Logo" 
//             className="h-10 cursor-pointer transition-all duration-200 hover:opacity-80 mr-3" 
//             onClick={() => navigate("/")} 
//           />
//           <span className="text-gray-700 font-medium text-xl">| Resume Filter</span>
//         </div>

//         {/* Right Section: User Authentication */}
//         <div className="flex items-center">
//           {user ? (
//             <span className="font-medium text-gray-700 mr-4">
//               {user.name || user.email}
//             </span>
//           ) : null}
          
//           <button 
//             onClick={toggleSidebar}
//             className="text-gray-700 hover:text-[#005792] transition-colors"
//           >
//             <FontAwesomeIcon icon={faBars} className="text-xl" />
//           </button>
//         </div>
//       </nav>

//       {/* Side Sidebar */}
//       <div 
//         className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-20 transform transition-transform duration-300 ease-in-out ${
//           isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//         <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//           <div className="flex-grow"></div>
//           <button 
//             onClick={toggleSidebar}
//             className="text-gray-700 hover:text-[#005792] transition-colors"
//           >
//             <FontAwesomeIcon icon={faTimes} className="text-xl" />
//           </button>
//         </div>

//         <div className="p-4 space-y-2">
//           {navItems.map((item) => (
//             <button
//               key={item.path}
//               onClick={() => {
//                 navigate(item.path);
//                 setIsSidebarOpen(false);
//               }}
//               className={`w-full px-4 py-3 rounded-lg flex items-center transition-all duration-200 ${
//                 isActive(item.path)
//                   ? "bg-[#005792] text-white font-medium"
//                   : "text-gray-700 hover:bg-gray-50 hover:text-[#005792]"
//               }`}
//             >
//               <FontAwesomeIcon icon={item.icon} className="mr-3" />
//               {item.name}
//             </button>
//           ))}
          
//           {user && (
//             <>
//               <hr className="my-3 border-gray-200" />
//               <button
//                 onClick={handleLogout}
//                 className="w-full px-4 py-3 rounded-lg flex items-center text-red-600 hover:bg-red-50 font-medium"
//               >
//                 <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
//                 Logout
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Overlay when sidebar is open */}
//       {isSidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-5 z-10"
//           onClick={toggleSidebar}
//         />
//       )}
//     </>
//   );
// };

// export default Navbar;

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-white flex justify-between items-center px-4 py-3 shadow-md border-b border-gray-200 sticky top-0 z-10">
        {/* Logo Section */}
        <div className="flex items-center">
          <img 
            src={Logo} 
            alt="GyanSys Logo" 
            className="h-10 cursor-pointer transition-all duration-200 hover:opacity-80 mr-3" 
            onClick={() => navigate("/")} 
          />
          <span className="text-gray-700 font-medium text-xl">| Resume Filter</span>
        </div>

        {/* Right Section: User Authentication */}
        <div className="flex items-center">
          {user ? (
            <span className="font-medium text-gray-700 mr-4">
              {user.name || user.email}
            </span>
          ) : null}
          
          <button 
            onClick={toggleSidebar}
            className="text-gray-700 hover:text-[#005792] transition-colors"
          >
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </button>
        </div>
      </nav>

      {/* Side Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-20 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex-grow"></div>
          <button 
            onClick={toggleSidebar}
            className="text-gray-700 hover:text-[#005792] transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
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

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-10"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Navbar;