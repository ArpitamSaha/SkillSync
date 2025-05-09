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
  const [isSearching, setIsSearching] = useState(false);
  const [resumesPerPage, setResumesPerPage] = useState(20);
  const pageOptions = [10, 20, 50, 100];

  useEffect(() => {
    fetchResumes();
    fetchSkillTags();

    
    // Load saved page size preference
    const savedPageSize = localStorage.getItem("resumesPerPage");
    if (savedPageSize) setResumesPerPage(parseInt(savedPageSize));
  }, []);

  const fetchSkillTags = async () => {
    setTimeout(() => {
      setSkillTags([
        "React", "JavaScript", "TypeScript", "Node.js", "Python", "Java",
        "C#", "SQL", "MongoDB", "AWS", "Azure", "Docker", "Kubernetes",
        "TensorFlow", "PyTorch", "NLP", "OpenCV", "GraphQL", "Microservices",
        "Spring Boot", ".NET", "Flutter", "Selenium"
      ]);
    }, 500);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setResumesPerPage(newSize);
    setCurrentPage(0); // Reset to first page when changing page size
    localStorage.setItem("resumesPerPage", newSize.toString());
  };



  const fetchResumes = async (keyword) => {
    try {
      setIsSearching(true);
      setLoading(true);
      setNoResults(false);
      setResumes([]);
      setCurrentPage(0);

      const url = keyword
        ? `https://localhost:7138/api/Resume/all?keyword=${encodeURIComponent(keyword)}`
        : "https://localhost:7138/api/Resume/all";

      const response = await fetch(url);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let chunkBuffer = "";

      setLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunkBuffer += decoder.decode(value, { stream: true });
        let match;
        const regex = /{[^}]+}/g;
        const foundMatches = [];
        
        while ((match = regex.exec(chunkBuffer)) !== null) {
          try {
            foundMatches.push(JSON.parse(match[0]));
          } catch (e) {}
        }
        
        if (foundMatches.length > 0) {
          setResumes(prevResumes => {
            const newResumes = [...prevResumes];
            foundMatches.forEach(resumeObj => {
              if (!prevResumes.some(r => r.id === resumeObj.id)) {
                // If no matchedSkills property, create an empty array
                if (!resumeObj.matchedSkills) {
                  resumeObj.matchedSkills = [];
                  // For demonstration, populate with random skills if needed
                  if (searchKeyword) {
                    const keywordSkills = searchKeyword.split(',').map(k => k.trim());
                    resumeObj.matchedSkills = keywordSkills.filter(skill => 
                      skillTags.includes(skill) || skill.length > 0
                    );
                  }
                }
                newResumes.push(resumeObj);
              }
            });
            return newResumes;
          });
        }
      }

      setResumes(prevResumes => {
        setNoResults(prevResumes.length === 0);
        setIsSearching(false);
        return prevResumes;
      });
    } catch (err) {
      setError("Failed to load resumes.");
      setIsSearching(false);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchResumes(searchKeyword);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };


  const getMimeType = (extension) => {
    switch (extension.toLowerCase()) {
      case "pdf": return "application/pdf";
      case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      case "doc": return "application/msword";
      default: return "application/octet-stream";
    }
  };

  const handleViewResume = async (id, fileName, openInWord = false) => {
    try {
      setLoading(true);
      showNotification("Preparing resume for viewing...");

      const response = await axios.get(`https://localhost:7138/api/Resume/${id}`, {
        responseType: "blob",
      });

      const fileExtension = fileName.split(".").pop().toLowerCase();
      const mimeType = getMimeType(fileExtension);
      const fileBlob = new Blob([response.data], { type: mimeType });

      if (openInWord && (fileExtension === "doc" || fileExtension === "docx")) {
        const url = URL.createObjectURL(fileBlob);
        window.open(`ms-word:ofe|u|${url}`);
      } else {
        const fileURL = URL.createObjectURL(fileBlob);
        
        if (fileExtension === "pdf") {
          window.open(fileURL, "_blank");
        } else if (fileExtension === "doc" || fileExtension === "docx") {
          const arrayBuffer = await fileBlob.arrayBuffer();
          const viewerWindow = window.open("", "_blank");
          if (!viewerWindow) {
            showNotification("Popup blocked. Please allow popups for this site.", "error");
            return;
          }
          viewerWindow.document.write(`
            <html><head><title>${fileName}</title>
            <style>body { margin: 20px; }</style></head>
            <body><div id="docx-container"></div></body></html>
          `);
          viewerWindow.document.close();
          await renderAsync(arrayBuffer, viewerWindow.document.getElementById("docx-container"));
        } else {
          const link = document.createElement("a");
          link.href = fileURL;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }

      setTimeout(() => URL.revokeObjectURL(fileURL), 100);
    } catch (err) {
      showNotification("Failed to load resume", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillSelect = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const applySkillFilter = () => {
    if (selectedSkills.length > 0) {
      const skillString = selectedSkills.join(", ");
      setSearchKeyword(skillString);
      fetchResumes(skillString);
    }
  };

  const clearFilters = () => {
    setSearchKeyword("");
    setSelectedSkills([]);
    fetchResumes();
  };

  const sortedResumes = [...resumes].sort((a, b) => 
    sortOrder === "asc" 
      ? a[sortBy] > b[sortBy] ? 1 : -1 
      : a[sortBy] < b[sortBy] ? 1 : -1
  );

  const pageCount = Math.ceil(sortedResumes.length / resumesPerPage);
  const displayedResumes = sortedResumes.slice(
    currentPage * resumesPerPage,
    (currentPage + 1) * resumesPerPage
  );

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getFileIcon = (extension) => {
    switch (extension.toLowerCase()) {
      case "pdf":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
        );
      case "doc":
      case "docx":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white shadow-md p-4 flex flex-col border-r border-gray-200 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800">Resume Library</h1>
            <p className="text-xs text-gray-500 mt-1">
              {resumes.length} {resumes.length === 1 ? "Resume" : "Resumes"} Available
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Search
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Keywords or skills..."
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Skills
            </h2>
            <div className="max-h-40 overflow-y-auto mb-3">
              <div className="flex flex-wrap gap-1">
                {skillTags.map((skill) => (
                  <span
                    key={skill}
                    onClick={() => handleSkillSelect(skill)}
                    className={`px-2 py-0.5 rounded-full text-xs cursor-pointer transition-colors ${
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
                className="w-full px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={applySkillFilter}
                disabled={selectedSkills.length === 0}
              >
                Apply Filters
              </button>
              <button
                className="w-full px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300 transition-colors"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Display Settings
            </h2>
            <div className="mb-2">
              <label htmlFor="pageSize" className="block text-xs text-gray-600 mb-1">
                Resumes per page:
              </label>
              <select
                id="pageSize"
                value={resumesPerPage}
                onChange={handlePageSizeChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {pageOptions.map(option => (
                  <option key={option} value={option}>
                    {option} resumes
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {notification && (
            <div className={`fixed top-16 right-4 z-50 px-4 py-3 rounded shadow-lg ${
              notification.type === "success" ? "bg-green-100 text-green-800 border-l-4 border-green-500" :
              notification.type === "error" ? "bg-red-100 text-red-800 border-l-4 border-red-500" :
              "bg-blue-100 text-blue-800 border-l-4 border-blue-500"
            }`}>
              <div className="flex items-center">
                {notification.type === "success" ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                ) : notification.type === "error" ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                )}
                {notification.message}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-auto p-4">
            {loading && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            {displayedResumes.length > 0 && (
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  Showing {currentPage * resumesPerPage + 1}-{Math.min((currentPage + 1) * resumesPerPage, sortedResumes.length)} of {sortedResumes.length} resumes
                </div>
                
                {sortedResumes.length > resumesPerPage && (
                  <ReactPaginate
                    previousLabel={
                      <button className="flex items-center px-2 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 mr-1 text-xs">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Prev
                      </button>
                    }
                    nextLabel={
                      <button className="flex items-center px-2 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 ml-1 text-xs">
                        Next
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    }
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"flex items-center"}
                    pageClassName={"mx-0.5"}
                    pageLinkClassName={"flex items-center justify-center w-7 h-7 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-xs"}
                    activeClassName={""}
                    activeLinkClassName={"bg-indigo-50 border-indigo-500 text-indigo-600"}
                    previousClassName={""}
                    nextClassName={""}
                    disabledClassName={"opacity-50 cursor-not-allowed"}
                    breakClassName={"mx-0.5 flex items-center justify-center w-7 h-7 text-gray-500 text-xs"}
                  />
                )}
              </div>
            )}

          {displayedResumes.length > 0 && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-6/12">
                        File
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">
                        Type
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">
                        Experience
                      </th>
                    </tr>
                  </thead>
                </table>
                {/* Scrollable table body container */}
                <div className="overflow-y-auto" style={{ maxHeight: '500px' }}> {/* Adjust height as needed */}
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayedResumes.map((resume) => {
                        const fileExtension = resume.fileName.split(".").pop().toLowerCase();
                        return (
                          <tr
                            key={resume.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleViewResume(resume.id, resume.fileName)}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              handleViewResume(resume.id, resume.fileName, true);
                            }}
                          >
                            <td className="px-4 py-3 whitespace-nowrap w-6/12">
                              <div className="flex items-center">
                                <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                                  fileExtension === "pdf" ? "bg-red-50 text-red-500" :
                                  (fileExtension === "doc" || fileExtension === "docx") ? "bg-blue-50 text-blue-500" : "bg-gray-50 text-gray-500"
                                }`}>
                                  {getFileIcon(fileExtension)}
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                    {resume.fileName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap w-3/12">
                              <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                                fileExtension === "pdf" ? "bg-red-100 text-red-800" :
                                (fileExtension === "doc" || fileExtension === "docx") ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                              }`}>
                                {fileExtension.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium w-3/12">
                              {resume.yearsOfExperience} years
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {!loading && resumes.length === 0 && !noResults && (
            <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-md p-8">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Searching all Resumes</h3>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeFilter;

