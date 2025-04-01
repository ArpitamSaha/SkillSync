import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  Search,
  Award,
  Tag,
  Layers,
  Trash2,
} from "lucide-react";

const AddSkill = () => {
  const [categories, setCategories] = useState([]);
  const [skillsData, setSkillsData] = useState({});
  const [formData, setFormData] = useState({ key: "", value: "" });
  const [deleteFormData, setDeleteFormData] = useState({ key: "", value: "" });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("add");
  const [expandedCategory, setExpandedCategory] = useState(null);


  // Load skills and recent activities on component mount
  useEffect(() => {
    loadSkills();
    const savedActivities = localStorage.getItem("skillActivities");
    if (savedActivities) {
      try {
        const parsedActivities = JSON.parse(savedActivities);
        const activitiesWithDates = parsedActivities.map(activity => ({
          ...activity,
          timestamp: new Date(activity.timestamp)
        }));
        setRecentActivities(activitiesWithDates);
      } catch (error) {
        console.error("Failed to parse saved activities", error);
      }
    }
  }, []);

  // Save recent activities to localStorage
  useEffect(() => {
    if (recentActivities.length > 0) {
      localStorage.setItem("skillActivities", JSON.stringify(recentActivities));
    }
  }, [recentActivities]);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://localhost:7138/api/SkillMapping/get-all-skills");
      const data = response.data;
      
      // Convert the skills data object to categories array
      const categoriesArray = Object.keys(data).map(key => ({
        key: key,
        value: key
      }));
      
      setCategories(categoriesArray);
      setSkillsData(data);

      if (categoriesArray.length > 0) {
        setFormData(prev => ({ ...prev, key: categoriesArray[0].value }));
      }
    } catch (error) {
      console.error("Error loading skills:", error);
      setNotification({
        show: true,
        message: "Failed to load skills. Please refresh the page.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryExpansion = (categoryKey) => {
    setExpandedCategory(expandedCategory === categoryKey ? null : categoryKey);
  };
  const handleAddSkill = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://localhost:7138/api/SkillMapping/add-skill",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setNotification({
        show: true,
        message: "Skill added successfully!",
        type: "success",
      });

      const newActivity = {
        type: "added",
        data: { ...formData },
        timestamp: new Date(),
      };

      setRecentActivities(prev => [newActivity, ...prev].slice(0, 10));
      setFormData({ ...formData, value: "" });
      await loadSkills(); // Refresh the data
    } catch (error) {
      setNotification({
        show: true,
        message: "Skill addition failed! " + (error.response?.data || "Unknown error"),
        type: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 5000);
    }
  };

  const handleDeleteSkill = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.delete(
        "https://localhost:7138/api/SkillMapping/delete-skill",
        {
          data: deleteFormData,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setNotification({
        show: true,
        message: "Skill deleted successfully!",
        type: "success",
      });

      const newActivity = {
        type: "deleted",
        data: { ...deleteFormData },
        timestamp: new Date(),
      };

      setRecentActivities(prev => [newActivity, ...prev].slice(0, 10));
      setDeleteFormData({ key: "", value: "" });
      await loadSkills(); // Refresh the data
    } catch (error) {
      setNotification({
        show: true,
        message: "Skill deletion failed! " + (error.response?.data || "Unknown error"),
        type: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 5000);
    }
  };

  const clearRecentActivities = () => {
    if (window.confirm("Are you sure you want to clear all recent activities?")) {
      setRecentActivities([]);
      localStorage.removeItem("skillActivities");
    }
  };

  const filteredCategories = categories.filter((item) =>
    item.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <motion.div
          className={`absolute top-5 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-md flex items-center shadow-md z-50 ${
            notification.type === "success"
              ? "bg-green-50 text-green-700 border-l-4 border-green-500"
              : "bg-red-50 text-red-700 border-l-4 border-red-500"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {notification.type === "success" ? (
            <CheckCircle className="mr-2 flex-shrink-0" size={20} />
          ) : (
            <AlertTriangle className="mr-2 flex-shrink-0" size={20} />
          )}
          <div>
            <p className="font-medium">
              {notification.type === "success" ? "Success" : "Error"}
            </p>
            <p className="text-sm">{notification.message}</p>
          </div>
        </motion.div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <nav className="flex-1 p-4 space-y-1">
            <button
              onClick={() => setActiveTab("add")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${
                activeTab === "add"
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <PlusCircle size={18} />
              <span>Add Skills</span>
            </button>

            <button
              onClick={() => setActiveTab("delete")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${
                activeTab === "delete"
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Trash2 size={18} />
              <span>Delete Skills</span>
            </button>

            <button
              onClick={() => setActiveTab("browse")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${
                activeTab === "browse"
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Search size={18} />
              <span>Browse Categories</span>
            </button>

            <button
              onClick={() => setActiveTab("recent")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${
                activeTab === "recent"
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Award size={18} />
              <span>Recent Activities</span>
            </button>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-md p-3">
              <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                Quick Stats
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded border border-gray-200">
                  <div className="text-xs text-gray-500">Categories</div>
                  <div className="font-medium">{categories.length}</div>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <div className="text-xs text-gray-500">Activities</div>
                  <div className="font-medium">{recentActivities.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            {/* Add Skills Tab */}
            {activeTab === "add" && (
              <motion.div
                className="max-w-3xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center">
                      <PlusCircle className="text-blue-600 mr-3" size={20} />
                      <h2 className="text-lg font-medium text-gray-800">
                        Add New Skill
                      </h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <form className="space-y-5" onSubmit={handleAddSkill}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="key"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Skill Category
                          </label>
                          <div className="relative">
                            <select
                              id="key"
                              name="key"
                              className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md transition-all duration-200 bg-white"
                              onChange={(e) =>
                                setFormData({ ...formData, key: e.target.value })
                              }
                              required
                              value={formData.key}
                              disabled={loading || categories.length === 0}
                            >
                              {categories.length === 0 && (
                                <option value="">Loading categories...</option>
                              )}
                              {categories.map((item, index) => (
                                <option key={index} value={item.value}>
                                  {item.value}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <Layers className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="value"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Skill Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="value"
                              name="value"
                              value={formData.value}
                              className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Enter the skill name"
                              onChange={(e) =>
                                setFormData({ ...formData, value: e.target.value })
                              }
                              required
                              disabled={loading}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <Tag className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={loading || categories.length === 0}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <PlusCircle className="mr-2" size={16} />
                              Add Skill
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Delete Skills Tab */}
            {activeTab === "delete" && (
              <motion.div
                className="max-w-3xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center">
                      <Trash2 className="text-red-600 mr-3" size={20} />
                      <h2 className="text-lg font-medium text-gray-800">
                        Delete Skill
                      </h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <form className="space-y-5" onSubmit={handleDeleteSkill}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="delete-key"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Skill Category
                          </label>
                          <div className="relative">
                            <select
                              id="delete-key"
                              name="key"
                              className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 rounded-md transition-all duration-200 bg-white"
                              onChange={(e) =>
                                setDeleteFormData({
                                  ...deleteFormData,
                                  key: e.target.value,
                                })
                              }
                              required
                              value={deleteFormData.key}
                              disabled={loading || categories.length === 0}
                            >
                              <option value="">Select a category</option>
                              {categories.map((item, index) => (
                                <option key={index} value={item.value}>
                                  {item.value}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <Layers className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="delete-value"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Skill Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="delete-value"
                              name="value"
                              value={deleteFormData.value}
                              className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                              placeholder="Enter the skill name to delete"
                              onChange={(e) =>
                                setDeleteFormData({
                                  ...deleteFormData,
                                  value: e.target.value,
                                })
                              }
                              required
                              disabled={loading}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <Tag className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={
                            loading ||
                            categories.length === 0 ||
                            !deleteFormData.key ||
                            !deleteFormData.value
                          }
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Trash2 className="mr-2" size={16} />
                              Delete Skill
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Browse Categories Tab */}
            {activeTab === "browse" && (
    <motion.div
      className="max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Search className="text-blue-600 mr-3" size={20} />
              <h2 className="text-lg font-medium text-gray-800">
                Browse Skill Categories
              </h2>
            </div>
            <span className="text-sm text-gray-500">
              {filteredCategories.length} categories
            </span>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((item) => (
                  <div key={item.key} className="border border-gray-200 rounded-md overflow-hidden">
                    <motion.div
                      className="px-4 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      onClick={() => toggleCategoryExpansion(item.key)}
                    >
                      <div className="font-medium text-gray-800">{item.value}</div>
                      <div className="flex items-center">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
                          {skillsData[item.key]?.length || 0} skills
                        </span>
                        <motion.div
                          animate={{ rotate: expandedCategory === item.key ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </motion.div>
                      </div>
                    </motion.div>

                    {expandedCategory === item.key && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white"
                      >
                        <div className="p-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Skills in this category:</h4>
                          <div className="flex flex-wrap gap-2">
                            {skillsData[item.key]?.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  {searchQuery
                    ? "No matching categories found"
                    : "No categories available"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )}

            {/* Recent Activities Tab */}
            {activeTab === "recent" && (
              <motion.div
                className="max-w-4xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Award className="text-blue-600 mr-3" size={20} />
                        <h2 className="text-lg font-medium text-gray-800">
                          Recent Activities
                        </h2>
                      </div>
                      <button
                        onClick={clearRecentActivities}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    {recentActivities.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Action
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Skill Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Category
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Time
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentActivities.map((activity, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    activity.type === "added"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {activity.type === "added" ? "Added" : "Deleted"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">
                                  {activity.data.value}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {activity.data.key}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {activity.timestamp.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="px-6 py-12 text-center text-gray-500">
                        <p>No recent activities</p>
                        <p className="text-sm mt-2">
                          Added or deleted skills will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSkill;