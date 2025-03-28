// import React, { useState } from 'react';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import { 
//   CheckCircle, 
//   AlertTriangle, 
//   Upload as UploadIcon, 
//   FileText, 
//   Database 
// } from 'lucide-react';

// const UploadResume = () => {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [notification, setNotification] = useState({ 
//     show: false, 
//     message: "", 
//     type: "" 
//   });

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1,
//       transition: { 
//         duration: 0.5,
//         when: "beforeChildren",
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { 
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.4 }
//     }
//   };

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     setFiles(selectedFiles);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (files.length === 0) {
//       setNotification({ 
//         show: true, 
//         message: "Please select at least one file.", 
//         type: "error" 
//       });
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     files.forEach(file => formData.append("files", file));

//     try {
//       await axios.post("https://localhost:7138/api/Resume/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
      
//       setNotification({ 
//         show: true, 
//         message: "Resume uploaded successfully!", 
//         type: "success" 
//       });
      
//       // Reset files
//       setFiles([]);
//     } catch (error) {
//       setNotification({ 
//         show: true, 
//         message: "Upload failed. " + (error.response?.data || "Unknown error"), 
//         type: "error" 
//       });
//     } finally {
//       setLoading(false);
      
//       // Auto-hide notification
//       setTimeout(() => {
//         setNotification({ show: false, message: "", type: "" });
//       }, 5000);
//     }
//   };

//   const renderFileList = () => (
//     <div className="mt-4 space-y-2">
//       {files.map((file, index) => (
//         <motion.div 
//           key={index} 
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: index * 0.1 }}
//           className="flex items-center space-x-3 bg-blue-50 p-3 rounded-md border border-blue-100"
//         >
//           <FileText className="text-blue-500" size={20} />
//           <div className="flex-grow">
//             <p className="text-sm truncate font-medium">{file.name}</p>
//             <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
//       <motion.div 
//         className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 relative overflow-hidden"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {/* Decorative element */}
//         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
//         <motion.div className="flex items-center mb-6" variants={itemVariants}>
//           <Database className="text-blue-600 mr-3" size={24} />
//           <h1 className="text-2xl font-semibold text-gray-800">Upload Resume</h1>
//         </motion.div>
        
//         <p className="text-gray-600 mb-6">
//           Upload your resume in PDF, DOCX format.
//         </p>
        
//         {notification.show && (
//           <motion.div 
//             className={`p-4 mb-6 rounded-md flex items-center ${
//               notification.type === 'success' 
//                 ? 'bg-green-50 text-green-700' 
//                 : 'bg-red-50 text-red-700'
//             }`}
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//           >
//             {notification.type === 'success' ? 
//               <CheckCircle className="mr-2" size={20} /> : 
//               <AlertTriangle className="mr-2" size={20} />
//             }
//             {notification.message}
//           </motion.div>
//         )}
        
//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <motion.div variants={itemVariants} className="relative">
//             <input
//               type="file"
//               multiple
//               onChange={handleFileChange}
//               className="absolute inset-0 opacity-0 cursor-pointer z-10"
//               accept=".pdf,.docx,.txt"
//             />
//             <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition-all">
//               <UploadIcon className="mx-auto text-blue-500 mb-2" size={40} />
//               <p className="text-gray-600">
//                 {files.length > 0 
//                   ? `${files.length} file${files.length > 1 ? 's' : ''} selected` 
//                   : 'Drag and drop or click to upload'}
//               </p>
//             </div>
//           </motion.div>

//           {files.length > 0 && renderFileList()}
          
//           <motion.div className="flex justify-end pt-4" variants={itemVariants}>
//             <button
//               type="submit"
//               disabled={loading || files.length === 0}
//               className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <UploadIcon className="mr-2" size={20} />
//                   Upload Resume
//                 </>
//               )}
//             </button>
//           </motion.div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default UploadResume;


// import React, { useState, useCallback } from 'react';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';

// const UploadResume = () => {
//   const [files, setFiles] = useState([]);
//   const [message, setMessage] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState('idle');
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     setFiles(selectedFiles);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (files.length === 0) {
//       setMessage("Please select at least one file.");
//       return;
//     }

//     setIsUploading(true);
//     const formData = new FormData();
//     files.forEach(file => formData.append("files", file));

//     try {
//       await axios.post("https://localhost:7138/api/Resume/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setMessage("Uploaded successfully!");
//       setUploadStatus('success');
//       setIsDialogOpen(true);
//     } catch (error) {
//       console.error("Upload Error:", error);
//       setMessage("Upload failed.");
//       setUploadStatus('error');
//       setIsDialogOpen(true);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const renderFileList = () => (
//     <div className="mt-4 space-y-2">
//       {files.map((file, index) => (
//         <motion.div 
//           key={index} 
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: index * 0.1 }}
//           className="flex items-center space-x-3 bg-gray-100 p-2 rounded-md"
//         >
//           <FileText className="text-blue-500" size={20} />
//           <div className="flex-grow">
//             <p className="text-sm truncate">{file.name}</p>
//             <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
//         <div className="px-6 py-8">
//           <h2 className="text-3xl font-bold text-blue-800 text-center mb-2">
//             Upload Resume
//           </h2>
//           <p className="text-center text-gray-500 mb-6">
//             Supported formats: PDF, DOCX, TXT
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <motion.div 
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="relative"
//             >
//               <input 
//                 type="file" 
//                 multiple 
//                 onChange={handleFileChange}
//                 className="absolute inset-0 opacity-0 cursor-pointer z-10"
//               />
//               <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition-all">
//                 <Upload className="mx-auto text-blue-500 mb-2" size={40} />
//                 <p className="text-gray-600">
//                   {files.length > 0 
//                     ? `${files.length} file${files.length > 1 ? 's' : ''} selected` 
//                     : 'Drag and drop or click to upload'}
//                 </p>
//               </div>
//             </motion.div>

//             {files.length > 0 && renderFileList()}

//             <button 
//               type="submit" 
//               disabled={isUploading || files.length === 0}
//               className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 
//                          transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isUploading ? 'Uploading...' : 'Upload Resume'}
//             </button>
//           </form>
//         </div>
//       </div>

//       {isDialogOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
//           >
//             <div className="flex flex-col items-center">
//               {uploadStatus === 'success' ? (
//                 <CheckCircle className="text-green-500 mb-4" size={48} />
//               ) : (
//                 <XCircle className="text-red-500 mb-4" size={48} />
//               )}
//               <h3 className="text-xl font-bold mb-2">
//                 {uploadStatus === 'success' ? 'Upload Successful' : 'Upload Failed'}
//               </h3>
//               <p className="text-gray-600 text-center">
//                 {message}
//               </p>
//               <button 
//                 onClick={() => setIsDialogOpen(false)}
//                 className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadResume;


import React, { useState } from "react";
import axios from "axios";

const UploadResume = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => setFiles(e.target.files);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return setMessage("Please select at least one file.");

    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }

    try {
      const response = await axios.post("https://localhost:7138/api/Resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      setMessage("Upload failed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#f4f7f9]">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-semibold text-[#005792] text-center mb-4">Upload Resume</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#005792]"
          />
          <button
            type="submit"
            className="bg-[#005792] text-white py-2 px-4 rounded-md font-semibold hover:bg-[#008cba] transition-all"
          >
            Submit
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center font-medium ${message.includes("failed") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadResume;