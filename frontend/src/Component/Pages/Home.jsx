
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AIResume from "../../assets/AIResume.jpg";
import ManagerResume from "../../assets/ManagerResume.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    resumes: 0,
    candidates: 0,
    placements: 0,
  });

  useEffect(() => {
    setIsVisible(true);

    // Animate stats counters
    const interval = setInterval(() => {
      setStats((prevStats) => {
        if (prevStats.resumes >= 5000) {
          clearInterval(interval);
          return prevStats;
        }
        return {
          resumes: Math.min(prevStats.resumes + 250, 5000),
          candidates: Math.min(prevStats.candidates + 100, 2000),
          placements: Math.min(prevStats.placements + 25, 500),
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (path) => {
    localStorage.getItem("token") ? navigate(path) : navigate("/login");
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section with Animation */}
      <section
        className={`w-full max-w-7xl transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="relative overflow-hidden rounded-xl shadow-2xl m-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/90 to-indigo-600/80 z-10"></div>
          <img
            src={AIResume}
            alt="Background"
            className="w-full h-96 object-cover"
          />

          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-8 md:px-16">
              <div className="max-w-xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Talent Acquisition{" "}
                  <span className="text-blue-200">Reimagined</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                  Our intelligent resume analysis system streamlines your
                  recruitment process with precision and efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl py-16 px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Our Platform
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 mb-6"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            Enterprise-grade recruitment technology powered by advanced AI and
            machine learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="h-48 overflow-hidden">
              <img
                src={ManagerResume}
                alt="Resume Processing"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Intelligent Processing
              </h3>
              <p className="text-gray-600 mb-4">
                Advanced AI automatically extracts and categorizes key
                information including skills, experience levels, and educational
                qualifications.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="h-48 overflow-hidden">
              <img
                src={AIResume}
                alt="Filter Resumes"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Precision Matching
              </h3>
              <p className="text-gray-600 mb-4">
                Our proprietary algorithms assess candidate suitability beyond
                keyword matching, identifying talent that truly aligns with your
                requirements.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="h-48 overflow-hidden">
              <img
                src={ManagerResume}
                alt="Candidate Management"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Enterprise Collaboration
              </h3>
              <p className="text-gray-600 mb-4">
                Centralized candidate management with role-based permissions,
                allowing seamless collaboration across departments and
                recruitment teams.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
