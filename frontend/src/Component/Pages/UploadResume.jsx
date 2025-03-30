import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  Upload as UploadIcon,
  FileText,
  Clock,
  FileCheck,
} from "lucide-react";

const UploadResume = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [recentUploads, setRecentUploads] = useState([]);
  const [activeTab, setActiveTab] = useState("upload");

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setNotification({
        show: true,
        message: "Please select at least one file.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      await axios.post("https://localhost:7138/api/Resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNotification({
        show: true,
        message: "Resume uploaded successfully!",
        type: "success",
      });

      // Add to recent uploads
      const newUploads = files.map((file) => ({
        name: file.name,
        type: file.type,
        size: (file.size / 1024).toFixed(2) + " KB",
        date: new Date().toLocaleString(),
      }));
      setRecentUploads((prev) => [...prev, ...newUploads]);

      setFiles([]);
    } catch (error) {
      setNotification({
        show: true,
        message: "Upload failed. " + (error.response?.data || "Unknown error"),
        type: "error",
      });
    } finally {
      setLoading(false);

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <nav className="flex-1 p-4 space-y-1">
            <button
              onClick={() => setActiveTab("upload")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${
                activeTab === "upload"
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <UploadIcon size={18} />
              <span>Upload Resume</span>
            </button>

            <button
              onClick={() => setActiveTab("recent")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm ${
                activeTab === "recent"
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Clock size={18} />
              <span>Recent Uploads</span>
            </button>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-md p-3">
              <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                Quick Stats
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded border border-gray-200">
                  <div className="text-xs text-gray-500">Files Ready</div>
                  <div className="font-medium">{files.length}</div>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <div className="text-xs text-gray-500">Recent</div>
                  <div className="font-medium">{recentUploads.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Notification */}
          {notification.show && (
            <motion.div
            className={`absolute top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md flex items-center shadow-lg z-50 
              ${notification.type === "success" 
                ? "bg-green-600 text-white" 
                : "bg-red-600 text-white"
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

          <div className="flex-1 overflow-auto p-6">
            {/* Upload Tab */}
            {activeTab === "upload" && (
              <motion.div
                className="max-w-3xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center">
                      <UploadIcon className="text-blue-600 mr-3" size={20} />
                      <h2 className="text-lg font-medium text-gray-800">
                        Upload Your Resume
                      </h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Files
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            accept=".pdf,.docx,.txt"
                          />
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-all bg-gray-50">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <UploadIcon className="text-blue-500" size={32} />
                              <p className="text-gray-600 text-sm">
                                {files.length > 0
                                  ? `${files.length} file${
                                      files.length > 1 ? "s" : ""
                                    } selected`
                                  : "Click to browse or drag and drop files"}
                              </p>
                              <p className="text-xs text-gray-500">
                                Supported formats: PDF, DOCX, TXT (Max 5MB each)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={loading || files.length === 0}
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
                              Uploading...
                            </>
                          ) : (
                            <>
                              <UploadIcon className="mr-2" size={16} />
                              Upload Resume
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recent Uploads Tab */}
            {activeTab === "recent" && (
              <motion.div
                className="max-w-4xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center">
                      <Clock className="text-blue-600 mr-3" size={20} />
                      <h2 className="text-lg font-medium text-gray-800">
                        Recently Uploaded Resumes
                      </h2>
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    {recentUploads.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              File Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Type
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Size
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Uploaded
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentUploads.map((file, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FileText className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                                  <div className="font-medium text-gray-900 truncate max-w-xs">
                                    {file.name}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {file.type}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {file.size}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {file.date}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="px-6 py-12 text-center text-gray-500">
                        <FileCheck className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2">No recent uploads</p>
                        <p className="text-sm mt-1">
                          Uploaded files will appear here
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

export default UploadResume;