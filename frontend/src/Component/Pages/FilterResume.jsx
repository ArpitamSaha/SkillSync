// import { useState, useEffect } from "react";
// import axios from "axios";
// import { renderAsync } from "docx-preview";
// import ReactPaginate from "react-paginate";

// const ResumeFilter = () => {
//   const [resumes, setResumes] = useState([]);
//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [skillTags, setSkillTags] = useState([]);
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [noResults, setNoResults] = useState(false);
//   const [sortBy, setSortBy] = useState("fileName");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [notification, setNotification] = useState(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const resumesPerPage = 10;
//   const apiUrl = "https://localhost:7138/api/Resume/all"; // Replace with your API endpoint

//   useEffect(() => {
//     fetchResumes();
//     fetchSkillTags();
//   }, []);

//   const fetchSkillTags = async () => {
//     // Simulate fetching popular skills
//     setTimeout(() => {
//       setSkillTags([
//         "React",
//         "JavaScript",
//         "TypeScript",
//         "Node.js",
//         "Python",
//         "Java",
//         "C#",
//         "SQL",
//         "MongoDB",
//         "AWS",
//         "Azure",
//         "Docker",
//         "Kubernetes",
//         "TensorFlow",
//         "PyTorch",
//         "NLP",
//         "OpenCV",
//         "GraphQL",
//         "Microservices",
//         "Spring Boot",
//         ".NET",
//         "Flutter",
//         "Selenium",
//       ]);
//     }, 500);
//   };

//   const fetchResumes = async (keyword) => {
//     try {
//       setLoading(true);
//       setNoResults(false);
//       setResumes([]); // Clear previous results
  
//       const url = keyword
//         ? `https://localhost:7138/api/Resume/all?keyword=${encodeURIComponent(keyword)}`
//         : "https://localhost:7138/api/Resume/all";
  
//       const response = await fetch(url);
//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let chunkBuffer = "";
  
//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
  
//         chunkBuffer += decoder.decode(value, { stream: true });
  
//         let match;
//         const regex = /{[^}]+}/g; // Matches JSON objects like {"id":12,"fileName":"resume.pdf"}
  
//         while ((match = regex.exec(chunkBuffer)) !== null) {
//           try {
//             const resumeObj = JSON.parse(match[0]);
  
//             setResumes(prevResumes => {
//               if (!prevResumes.some(r => r.id === resumeObj.id)) {
//                 return [...prevResumes, resumeObj]; // ✅ Display resumes one by one
//               }
//               return prevResumes;
//             });
//           } catch (e) {
//             continue; // Ignore invalid JSON and wait for more data
//           }
//         }
//       }
  
//       setNoResults(resumes.length === 0);
//     } catch (err) {
//       setError("Failed to load resumes.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const handleSearch = () => {
//     fetchResumes(searchKeyword);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   const getMimeType = (extension) => {
//     switch (extension.toLowerCase()) {
//       case "pdf":
//         return "application/pdf";
//       case "docx":
//         return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
//       case "doc":
//         return "application/msword";
//       default:
//         return "application/octet-stream";
//     }
//   };

//   const handleViewResume = async (id, fileName) => {
//     try {
//       setLoading(true);
//       showNotification("Preparing resume for viewing...");

//       const response = await axios.get(`https://localhost:7138/api/Resume/${id}`, {
//         responseType: "blob",
//       });

//       const fileExtension = fileName.split(".").pop().toLowerCase();
//       const mimeType = getMimeType(fileExtension);
//       const fileBlob = new Blob([response.data], { type: mimeType });
//       const fileURL = URL.createObjectURL(fileBlob);

//       if (fileExtension === "pdf") {
//         window.open(fileURL, "_blank", "noopener,noreferrer");
//         showNotification("PDF opened in new tab", "success");
//       } else if (fileExtension === "doc" || fileExtension === "docx") {
//         const arrayBuffer = await fileBlob.arrayBuffer();
//         const viewerWindow = window.open("", "_blank");
//         if (!viewerWindow) {
//           showNotification("Popup blocked. Please allow popups for this site.", "error");
//           return;
//         }
//         viewerWindow.document.write(`
//           <html>
//             <head>
//               <title>${fileName}</title>
//               <style>
//                 body { font-family: Arial, sans-serif; margin: 20px; }
//               </style>
//             </head>
//             <body>
//               <div id="docx-container">Loading document...</div>
//             </body>
//           </html>
//         `);
//         viewerWindow.document.close();
//         const container = viewerWindow.document.getElementById("docx-container");
//         await renderAsync(arrayBuffer, container);
//         showNotification("DOCX rendered for viewing", "success");
//       } else {
//         const link = document.createElement("a");
//         link.href = fileURL;
//         link.setAttribute("download", fileName);
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         showNotification("File downloading", "success");
//       }

//       setTimeout(() => {
//         URL.revokeObjectURL(fileURL);
//       }, 100);
//     } catch (err) {
//       setError("Failed to load the selected resume.");
//       showNotification("Failed to load resume", "error");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSkillSelect = (skill) => {
//     if (selectedSkills.includes(skill)) {
//       setSelectedSkills(selectedSkills.filter((s) => s !== skill));
//     } else {
//       setSelectedSkills([...selectedSkills, skill]);
//     }
//   };

//   const applySkillFilter = () => {
//     if (selectedSkills.length > 0) {
//       const skillString = selectedSkills.join(",");
//       setSearchKeyword(skillString);
//       fetchResumes(skillString);
//     }
//   };

//   const clearFilters = () => {
//     setSearchKeyword("");
//     setSelectedSkills([]);
//     fetchResumes();
//   };

//   // Sorting and pagination logic
//   const sortedResumes = [...resumes].sort((a, b) => {
//     if (sortOrder === "asc") {
//       return a[sortBy] > b[sortBy] ? 1 : -1;
//     } else {
//       return a[sortBy] < b[sortBy] ? 1 : -1;
//     }
//   });

//   const pageCount = Math.ceil(sortedResumes.length / resumesPerPage);
//   const displayedResumes = sortedResumes.slice(
//     currentPage * resumesPerPage,
//     (currentPage + 1) * resumesPerPage
//   );

//   // Handle page change
//   const handlePageClick = (data) => {
//     setCurrentPage(data.selected);
//   };

//   const showNotification = (message, type = "info") => {
//     setNotification({ message, type });
//     setTimeout(() => {
//       setNotification(null);
//     }, 3000);
//   };

//   const handleDownload = (id, fileName) => {
//     // Handle download functionality
//   };

//   const getFileIcon = (extension) => {
//     switch (extension.toLowerCase()) {
//       case "pdf":
//         return (
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
//             ></path>
//           </svg>
//         );
//       case "doc":
//       case "docx":
//         return (
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//             ></path>
//           </svg>
//         );
//       default:
//         return (
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//             ></path>
//           </svg>
//         );
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Side Filter Panel */}
//       <div className="w-72 bg-white shadow-md p-6 flex flex-col">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Resume Library</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             {resumes.length} {resumes.length === 1 ? "Resume" : "Resumes"} Available
//           </p>
//         </div>

//         <div className="mb-6">
//           <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
//             Search
//           </h2>
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Keywords or skills..."
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
//               value={searchKeyword}
//               onChange={(e) => setSearchKeyword(e.target.value)}
//               onKeyPress={handleKeyPress}
//             />
//             <button
//               onClick={handleSearch}
//               className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 ></path>
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div className="mb-6">
//           <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
//             Skills
//           </h2>
//           <div className="max-h-40 overflow-y-auto mb-3">
//             <div className="flex flex-wrap gap-2">
//               {skillTags.map((skill) => (
//                 <span
//                   key={skill}
//                   onClick={() => handleSkillSelect(skill)}
//                   className={`px-2 py-1 rounded-full text-xs cursor-pointer transition-colors ${
//                     selectedSkills.includes(skill)
//                       ? "bg-indigo-100 text-indigo-800 border-indigo-300"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   } border`}
//                 >
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           </div>
//           <div className="flex flex-col space-y-2">
//             <button
//               className="w-full px-3 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={applySkillFilter}
//               disabled={selectedSkills.length === 0}
//             >
//               Apply Filters
//             </button>
//             <button
//               className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
//               onClick={clearFilters}
//             >
//               Clear All
//             </button>
//           </div>
//         </div>

//         <div className="mt-auto">
//           <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
//             Sort Options
//           </h2>
//           <div className="flex justify-between items-center">
//             <select
//               className="block w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <option value="fileName">File Name</option>
//               <option value="uploadDate">Upload Date</option>
//               <option value="fileSize">File Size</option>
//             </select>
//             <button
//               className="ml-2 p-2 rounded hover:bg-gray-100"
//               onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
//             >
//               {sortOrder === "asc" ? (
//                 <svg
//                   className="w-5 h-5 text-gray-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
//                   ></path>
//                 </svg>
//               ) : (
//                 <svg
//                   className="w-5 h-5 text-gray-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
//                   ></path>
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 overflow-auto p-6">
//         {/* Notification */}
//         {notification && (
//           <div
//             className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg ${
//               notification.type === "success"
//                 ? "bg-green-100 text-green-800 border-l-4 border-green-500"
//                 : notification.type === "error"
//                 ? "bg-red-100 text-red-800 border-l-4 border-red-500"
//                 : "bg-blue-100 text-blue-800 border-l-4 border-blue-500"
//             }`}
//           >
//             <div className="flex items-center">
//               {notification.type === "success" ? (
//                 <svg
//                   className="w-5 h-5 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M5 13l4 4L19 7"
//                   ></path>
//                 </svg>
//               ) : notification.type === "error" ? (
//                 <svg
//                   className="w-5 h-5 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M6 18L18 6M6 6l12 12"
//                   ></path>
//                 </svg>
//               ) : (
//                 <svg
//                   className="w-5 h-5 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   ></path>
//                 </svg>
//               )}
//               {notification.message}
//             </div>
//           </div>
//         )}

//         {/* Loading State */}
//         {loading && (
//           <div className="flex items-center justify-center h-full">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//           </div>
//         )}

//         {/* Error State */}
//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
//             <div className="flex">
//               <svg
//                 className="h-5 w-5 text-red-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* No Results State */}
//         {noResults && !loading && (
//           <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
//             <div className="flex">
//               <svg
//                 className="h-5 w-5 text-yellow-500"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
//               </svg>
//               <div className="ml-3">
//                 <p className="text-sm text-yellow-700">
//                   No resumes found for the selected criteria. Please try different keywords or clear filters.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Resume Table */}
//         {!loading && displayedResumes.length > 0 && (
//           <div className="bg-white shadow-md rounded-lg overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     File
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Type
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Size
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Uploaded
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {displayedResumes.map((resume) => {
//                   const fileExtension = resume.fileName.split(".").pop().toLowerCase();
//                   return (
//                     <tr key={resume.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div
//                             className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
//                               fileExtension === "pdf"
//                                 ? "bg-red-50 text-red-500"
//                                 : fileExtension === "doc" || fileExtension === "docx"
//                                 ? "bg-blue-50 text-blue-500"
//                                 : "bg-gray-50 text-gray-500"
//                             }`}
//                           >
//                             {getFileIcon(fileExtension)}
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">
//                               {resume.fileName}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               {resume.description || "No description"}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             fileExtension === "pdf"
//                               ? "bg-red-100 text-red-800"
//                               : fileExtension === "doc" || fileExtension === "docx"
//                               ? "bg-blue-100 text-blue-800"
//                               : "bg-gray-100 text-gray-800"
//                           }`}
//                         >
//                           {fileExtension.toUpperCase()}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {resume.fileSize
//                           ? `${(resume.fileSize / 1024).toFixed(2)} KB`
//                           : "Unknown"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {resume.uploadDate || "Unknown"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex justify-end space-x-2">
//                           <button
//                             onClick={() => handleViewResume(resume.id, resume.fileName)}
//                             className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded transition-colors"
//                           >
//                             View
//                           </button>
//                           <button
//                             onClick={() => handleDownload(resume.id, resume.fileName)}
//                             className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded transition-colors"
//                           >
//                             Download
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && resumes.length === 0 && !noResults && (
//           <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-md p-8">
//             <svg
//               className="w-16 h-16 text-gray-400 mb-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="1.5"
//                 d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//               ></path>
//             </svg>
//             <h3 className="text-xl font-medium text-gray-700 mb-2">
//               No resumes in your library
//             </h3>
//             <p className="text-gray-500 text-center max-w-md mb-6">
//               Upload your resume to begin building your professional library
//             </p>
//             <button className="bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700 transition-colors">
//               Upload Resume
//             </button>
//           </div>
//         )}

//         {/* Pagination */}
//         {sortedResumes.length > resumesPerPage && (
//           <div className="mt-6 flex justify-center">
//             <nav className="flex items-center space-x-1">
//               <ReactPaginate
//                 previousLabel={
//                   <span className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
//                     Previous
//                   </span>
//                 }
//                 nextLabel={
//                   <span className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
//                     Next
//                   </span>
//                 }
//                 breakLabel={"..."}
//                 pageCount={pageCount}
//                 marginPagesDisplayed={2}
//                 pageRangeDisplayed={5}
//                 onPageChange={handlePageClick}
//                 containerClassName={"flex items-center space-x-1"}
//                 pageClassName={"px-3 py-2 border border-gray-300 bg-white rounded-md text-sm hover:bg-gray-50"}
//                 activeClassName={"border-indigo-500 bg-indigo-50 text-indigo-600"}
//               />
//             </nav>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResumeFilter;

import { useState, useEffect } from "react";
import axios from "axios";
import { renderAsync } from "docx-preview";
import ReactPaginate from "react-paginate";

const ResumeFilter = () => {
  const [resumes, setResumes] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [skillTags, setSkillTags] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [sortBy, setSortBy] = useState("fileName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const resumesPerPage = 20;

  useEffect(() => {
    fetchResumes();
    fetchSkillTags();
  }, []);

  const fetchSkillTags = async () => {
    // Simulate fetching popular skills
    setTimeout(() => {
      setSkillTags([
        "React",
        "JavaScript",
        "TypeScript",
        "Node.js",
        "Python",
        "Java",
        "C#",
        "SQL",
        "MongoDB",
        "AWS",
        "Azure",
        "Docker",
        "Kubernetes",
        "TensorFlow",
        "PyTorch",
        "NLP",
        "OpenCV",
        "GraphQL",
        "Microservices",
        "Spring Boot",
        ".NET",
        "Flutter",
        "Selenium",
      ]);
    }, 500);
  };

  const fetchResumes = async (keyword) => {
    try {
      setLoading(true);
      setNoResults(false);
      setResumes([]); // Clear previous results
      setCurrentPage(0); // Reset pagination
  
      const url = keyword
        ? `https://localhost:7138/api/Resume/all?keyword=${encodeURIComponent(keyword)}`
        : "https://localhost:7138/api/Resume/all";
  
      const response = await fetch(url);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let chunkBuffer = "";
  
      // Set loading to false immediately since we'll be showing resumes as they come in
      setLoading(false);
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        chunkBuffer += decoder.decode(value, { stream: true });
  
        let match;
        const regex = /{[^}]+}/g; // Matches JSON objects like {"id":12,"fileName":"resume.pdf"}
        const foundMatches = [];
        
        while ((match = regex.exec(chunkBuffer)) !== null) {
          try {
            const resumeObj = JSON.parse(match[0]);
            foundMatches.push(resumeObj);
          } catch (e) {
            continue; // Ignore invalid JSON and wait for more data
          }
        }
        
        if (foundMatches.length > 0) {
          setResumes(prevResumes => {
            const newResumes = [...prevResumes];
            
            // Add only unique resumes that aren't already in the array
            foundMatches.forEach(resumeObj => {
              if (!prevResumes.some(r => r.id === resumeObj.id)) {
                newResumes.push(resumeObj);
              }
            });
            
            return newResumes;
          });
        }
      }
  
      // Check if no results after all processing is done
      setResumes(prevResumes => {
        setNoResults(prevResumes.length === 0);
        return prevResumes;
      });
    } catch (err) {
      setError("Failed to load resumes.");
      console.error(err);
      setLoading(false);
    }
  };
  
  const handleSearch = () => {
    fetchResumes(searchKeyword);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getMimeType = (extension) => {
    switch (extension.toLowerCase()) {
      case "pdf":
        return "application/pdf";
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      case "doc":
        return "application/msword";
      default:
        return "application/octet-stream";
    }
  };

  const handleViewResume = async (id, fileName) => {
    try {
      setLoading(true);
      showNotification("Preparing resume for viewing...");

      const response = await axios.get(`https://localhost:7138/api/Resume/${id}`, {
        responseType: "blob",
      });

      const fileExtension = fileName.split(".").pop().toLowerCase();
      const mimeType = getMimeType(fileExtension);
      const fileBlob = new Blob([response.data], { type: mimeType });
      const fileURL = URL.createObjectURL(fileBlob);

      if (fileExtension === "pdf") {
        window.open(fileURL, "_blank", "noopener,noreferrer");
        showNotification("PDF opened in new tab", "success");
      } else if (fileExtension === "doc" || fileExtension === "docx") {
        const arrayBuffer = await fileBlob.arrayBuffer();
        const viewerWindow = window.open("", "_blank");
        if (!viewerWindow) {
          showNotification("Popup blocked. Please allow popups for this site.", "error");
          return;
        }
        viewerWindow.document.write(`
          <html>
            <head>
              <title>${fileName}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
              </style>
            </head>
            <body>
              <div id="docx-container">Loading document...</div>
            </body>
          </html>
        `);
        viewerWindow.document.close();
        const container = viewerWindow.document.getElementById("docx-container");
        await renderAsync(arrayBuffer, container);
        showNotification("DOCX rendered for viewing", "success");
      } else {
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification("File downloading", "success");
      }

      setTimeout(() => {
        URL.revokeObjectURL(fileURL);
      }, 100);
    } catch (err) {
      setError("Failed to load the selected resume.");
      showNotification("Failed to load resume", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillSelect = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const applySkillFilter = () => {
    if (selectedSkills.length > 0) {
      const skillString = selectedSkills.join(",");
      setSearchKeyword(skillString);
      fetchResumes(skillString);
    }
  };

  const clearFilters = () => {
    setSearchKeyword("");
    setSelectedSkills([]);
    fetchResumes();
  };

  // Sorting and pagination logic
  const sortedResumes = [...resumes].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  const pageCount = Math.ceil(sortedResumes.length / resumesPerPage);
  const displayedResumes = sortedResumes.slice(
    currentPage * resumesPerPage,
    (currentPage + 1) * resumesPerPage
  );

  // Handle page change
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const getFileIcon = (extension) => {
    switch (extension.toLowerCase()) {
      case "pdf":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            ></path>
          </svg>
        );
      case "doc":
      case "docx":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Side Filter Panel */}
      <div className="w-72 bg-white shadow-md p-6 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Resume Library</h1>
          <p className="text-sm text-gray-500 mt-1">
            {resumes.length} {resumes.length === 1 ? "Resume" : "Resumes"} Available
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Search
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Keywords or skills..."
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Skills
          </h2>
          <div className="max-h-40 overflow-y-auto mb-3">
            <div className="flex flex-wrap gap-2">
              {skillTags.map((skill) => (
                <span
                  key={skill}
                  onClick={() => handleSkillSelect(skill)}
                  className={`px-2 py-1 rounded-full text-xs cursor-pointer transition-colors ${
                    selectedSkills.includes(skill)
                      ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } border`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <button
              className="w-full px-3 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={applySkillFilter}
              disabled={selectedSkills.length === 0}
            >
              Apply Filters
            </button>
            <button
              className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
              onClick={clearFilters}
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="mt-auto">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Sort Options
          </h2>
          <div className="flex justify-between items-center">
            <select
              className="block w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="fileName">File Name</option>
              <option value="uploadDate">Upload Date</option>
              <option value="fileSize">File Size</option>
            </select>
            <button
              className="ml-2 p-2 rounded hover:bg-gray-100"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? (
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                : notification.type === "error"
                ? "bg-red-100 text-red-800 border-l-4 border-red-500"
                : "bg-blue-100 text-blue-800 border-l-4 border-blue-500"
            }`}
          >
            <div className="flex items-center">
              {notification.type === "success" ? (
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              ) : notification.type === "error" ? (
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              )}
              {notification.message}
            </div>
          </div>
        )}

        {/* Loading Indicator - Only show at the beginning of a fetch */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* No Results State */}
        {noResults && !loading && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
            <div className="flex">
              <svg
                className="h-5 w-5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  No resumes found for the selected criteria. Please try different keywords or clear filters.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resume Table */}
        {!loading && displayedResumes.length > 0 && (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            File
          </th>
          <th
            scope="col"
            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Type
          </th>
          <th
            scope="col"
            className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {displayedResumes.map((resume) => {
          const fileExtension = resume.fileName.split(".").pop().toLowerCase();
          return (
            <tr key={resume.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                      fileExtension === "pdf"
                        ? "bg-red-50 text-red-500"
                        : fileExtension === "doc" || fileExtension === "docx"
                        ? "bg-blue-50 text-blue-500"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    {getFileIcon(fileExtension)}
                  </div>
                  <div className="ml-2">
                    <div className="text-xs font-medium text-gray-900">
                      {resume.fileName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {resume.description || "No description"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <span
                  className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full ${
                    fileExtension === "pdf"
                      ? "bg-red-100 text-red-800"
                      : fileExtension === "doc" || fileExtension === "docx"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {fileExtension.toUpperCase()}
                </span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium">
                <div className="flex justify-end space-x-1">
                  <button
                    onClick={() => handleViewResume(resume.id, resume.fileName)}
                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition-colors"
                  >
                    View
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)}

        {/* Empty State */}
        {!loading && resumes.length === 0 && !noResults && (
          <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-md p-8">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No resumes in your library
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Upload your resume to begin building your professional library
            </p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700 transition-colors">
              Upload Resume
            </button>
          </div>
        )}

        {/* Pagination */}
        {sortedResumes.length > resumesPerPage && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center space-x-1" style={{cursor:"pointer"}}>
              <ReactPaginate
                previousLabel={
                  <span className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    Previous
                  </span>
                }
                nextLabel={
                  <span className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    Next
                  </span>
                }
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"flex items-center space-x-1"}
                pageClassName={"px-3 py-2 border border-gray-300 bg-white rounded-md text-sm hover:bg-gray-50"}
                activeClassName={"border-indigo-500 bg-indigo-50 text-indigo-600"}
              />
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeFilter;