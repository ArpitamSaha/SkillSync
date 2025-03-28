import React, { useState, useEffect } from "react";
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
  
  // Pagination state
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
        "React", "JavaScript", "TypeScript", "Node.js", "Python",
        "Java", "C#", "SQL", "MongoDB", "AWS", "Azure",
        "Docker", "Kubernetes", "TensorFlow", "PyTorch",
        "NLP", "OpenCV", "GraphQL", "Microservices",
        "Spring Boot", ".NET", "Flutter", "Selenium"
      ]);
    }, 500);
  };

  const fetchResumes = async (keyword = "") => {
    try {
      setLoading(true);
      setNoResults(false);
      const url = keyword
        ? `https://localhost:7138/api/Resume/all?keyword=${encodeURIComponent(keyword)}`
        : "https://localhost:7138/api/Resume/all";
      const response = await axios.get(url);
      setResumes(response.data);
      setError(null);
      if (response.data.length === 0) {
        setNoResults(true);
      }
      // Reset pagination when new resumes are loaded
      setCurrentPage(0);
    } catch (err) {
      setError("Failed to load resumes. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchResumes(searchKeyword);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getMimeType = (extension) => {
    switch (extension.toLowerCase()) {
      case 'pdf':
        return 'application/pdf';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'doc':
        return 'application/msword';
      default:
        return 'application/octet-stream';
    }
  };

  const handleViewResume = async (id, fileName) => {
    try {
      setLoading(true);
      showNotification("Preparing resume for viewing...");

      const response = await axios.get(`https://localhost:7138/api/Resume/${id}`, {
        responseType: "blob",
      });

      const fileExtension = fileName.split('.').pop().toLowerCase();
      const mimeType = getMimeType(fileExtension);
      const fileBlob = new Blob([response.data], { type: mimeType });
      const fileURL = URL.createObjectURL(fileBlob);

      if (fileExtension === 'pdf') {
        // Open PDF in a new tab
        window.open(fileURL, "_blank", "noopener,noreferrer");
        showNotification("PDF opened in new tab", "success");
      } else if (fileExtension === 'doc' || fileExtension === 'docx') {
        // Use docx-preview to render the DOCX in a new window
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
        // Render the DOCX into the container
        await renderAsync(arrayBuffer, container);
        showNotification("DOCX rendered for viewing", "success");
      } else {
        // Fallback: download file
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification("File downloading", "success");
      }

      // Clean up the object URL after use
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
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const applySkillFilter = () => {
    if (selectedSkills.length > 0) {
      const skillString = selectedSkills.join(',');
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

  // Paginate the sorted resumes
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

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-6">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-blue-800 flex items-center">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Resume Library
          </h2>
          <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-md shadow">
            {resumes.length} {resumes.length === 1 ? 'Resume' : 'Resumes'} Available
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex space-x-3 w-full">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by skills or keywords..."
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <button
              className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skillTags.map((skill) => (
                <span
                  key={skill}
                  onClick={() => handleSkillSelect(skill)}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                    selectedSkills.includes(skill)
                      ? "bg-blue-100 text-blue-800 border-blue-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } border`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex space-x-3">
              <button
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm"
                onClick={applySkillFilter}
                disabled={selectedSkills.length === 0}
              >
                Apply Filters
              </button>
              <button
                className="px-4 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 text-sm"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="p-1 rounded-md hover:bg-gray-100"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? (
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <div className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg z-50 ${
          notification.type === "success"
            ? "bg-green-50 text-green-800 border-l-4 border-green-400"
            : notification.type === "error"
            ? "bg-red-50 text-red-800 border-l-4 border-red-400"
            : "bg-blue-50 text-blue-800 border-l-4 border-blue-400"
        }`}>
          {notification.message}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center p-6 w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      )}

      {error && (
        <div className="w-full max-w-4xl bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {noResults && !loading && (
        <div className="w-full max-w-4xl bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
          <div className="flex">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
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

      <div className="w-full max-w-4xl space-y-4">
        {displayedResumes.map((resume) => {
          const fileExtension = resume.fileName.split('.').pop().toLowerCase();
          const isWordDoc = fileExtension === 'doc' || fileExtension === 'docx';
          return (
            <div key={resume.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    fileExtension === 'pdf' ? 'bg-red-100 text-red-600' :
                    isWordDoc ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {fileExtension === 'pdf' ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                      </svg>
                    ) : isWordDoc ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{resume.fileName}</div>
                    <div className="text-xs text-gray-500">{fileExtension.toUpperCase()}</div>
                  </div>
                </div>
                <button
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    isWordDoc 
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                  onClick={() => handleViewResume(resume.id, resume.fileName)}
                >
                  VIEW
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Component */}
      {sortedResumes.length > resumesPerPage && (
        <div className="mt-6 flex justify-center">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"flex items-center space-x-2"}
            pageClassName={"px-3 py-2 rounded-md"}
            activeClassName={"bg-blue-600 text-white"}
            previousClassName={"px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"}
            nextClassName={"px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"}
            breakClassName={"px-3 py-2"}
          />
        </div>
      )}

      {!loading && resumes.length === 0 && !noResults && (
        <div className="w-full max-w-4xl flex flex-col items-center justify-center py-12">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No resumes yet</h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            Start by uploading your resume or creating a new one to build your resume library.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700">
            Upload Resume
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeFilter;