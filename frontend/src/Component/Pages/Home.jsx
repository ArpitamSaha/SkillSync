import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Search, 
  FileText, 
  Filter, 
  PlusCircle, 
  UploadCloud,
  User,
  ChevronRight,
  BarChart2,
  Zap
} from "lucide-react";

// Placeholder images (replace with your actual imports)
import HeroImage from "../../assets/Background.jpg";
import AnalysisImage from "../../assets/AnalysisImage.jpg";
import SkillsImage from "../../assets/SkillsImage.jpg";

const Home = () => {
  const navigate = useNavigate();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      } 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section - Reduced height */}
      <div className="relative h-72 overflow-hidden">
        <img 
          src={HeroImage}
          alt="Resume Analysis"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-800/70" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="relative max-w-7xl mx-auto px-6 h-full flex items-center"
        >
          <div className="max-w-2xl text-white">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Smart Resume Filtering <br />
            </motion.h1>
            <motion.p 
              className="text-base mb-6 text-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Automatically analyze, categorize and filter resumes with our intelligent platform
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium shadow-lg hover:bg-blue-50 transition-all"
              onClick={() => navigate("/find")}
            >
              Get Started
              <Zap className="ml-2 w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
<motion.section 
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "100px" }} 
  variants={container}
  className="max-w-7xl mx-auto px-6 py-10 mt-6" 
>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Resume Card */}
    <motion.div
      variants={slideUp}
      className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-xl bg-blue-100 text-blue-600 mr-4">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Resume Analysis</h3>
      </div>
      <p className="text-gray-600 mb-6">
        Automatically extract key information from resumes with our advanced parsing technology
      </p>
      <button
        onClick={() => navigate("/find")}
        className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
      >
        Try Now
        <ChevronRight className="ml-1 w-5 h-5" />
      </button>
    </motion.div>

    {/* Skills Card */}
    <motion.div
      variants={slideUp}
      className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-xl bg-purple-100 text-purple-600 mr-4">
          <BarChart2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Skill Management</h3>
      </div>
      <p className="text-gray-600 mb-6">
        Organize and categorize skills to create powerful filters for candidate selection
      </p>
      <button
        onClick={() => navigate("/addSkill")}
        className="flex items-center text-purple-600 hover:text-purple-800 font-medium"
      >
        Manage Skills
        <ChevronRight className="ml-1 w-5 h-5" />
      </button>
    </motion.div>

    {/* Upload Card */}
    <motion.div
      variants={slideUp}
      className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-xl bg-green-100 text-green-600 mr-4">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Batch Upload</h3>
      </div>
      <p className="text-gray-600 mb-6">
        Upload multiple resumes at once and let our system process them automatically
      </p>
      <button
        onClick={() => navigate("/upload")}
        className="flex items-center text-green-600 hover:text-green-800 font-medium"
      >
        Upload Resumes
        <ChevronRight className="ml-1 w-5 h-5" />
      </button>
    </motion.div>
  </div>
</motion.section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Powerful Features
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
        </motion.div>

        {/* Feature 1 - Reduced image size */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <motion.div variants={slideUp} className="order-1 md:order-2">
            <div className="max-w-md mx-auto md:mx-0">
              <img 
                src={AnalysisImage}
                alt="Resume Analysis"
                className="rounded-xl shadow-lg w-full h-auto object-cover max-h-64"
              />
            </div>
          </motion.div>
          <motion.div variants={slideUp} className="order-2 md:order-1">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Filter className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Smart Filtering</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Intelligent Resume Processing
            </h3>
            <p className="text-gray-600 mb-6">
              Our system automatically extracts and categorizes key information from resumes including skills, 
              experience levels, and educational qualifications with 95% accuracy.
            </p>
            <button
              onClick={() => navigate("/find")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Resume Filter
            </button>
          </motion.div>
        </motion.div>

        {/* Feature 2 - Reduced image size */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <motion.div variants={slideUp}>
            <div className="max-w-md mx-auto md:mx-0">
              <img 
                src={SkillsImage}
                alt="Skill Management"
                className="rounded-xl shadow-lg w-full h-auto object-cover max-h-64"
              />
            </div>
          </motion.div>
          <motion.div variants={slideUp}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-600 mb-4">
              <PlusCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Skill Database</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Comprehensive Skill Management
            </h3>
            <p className="text-gray-600 mb-6">
              Create and organize a centralized skill database with categories and synonyms to ensure 
              no qualified candidate slips through your filters.
            </p>
            <button
              onClick={() => navigate("/addSkill")}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Manage Skills
            </button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;