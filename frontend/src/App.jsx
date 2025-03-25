import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Component/Navbar/Navbar";
import Filter from "./Component/Pages/FilterResume";
import Upload from "./Component/Pages/UploadResume";
import Login from "./Component/Pages/Login";
import Register from "./Component/Pages/Register";
import Home from "./Component/Pages/Home";
import Footer from "./Component/Footer/Footer";
import AddSkill from "./Component/Pages/AddSkill";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <div className="main-container">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/find" element={<Filter />} />
          <Route path="/addSkill" element={<AddSkill />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
