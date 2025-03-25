// import React, { useState } from "react";
// import axios from "axios";

// const UploadResume = () => {
//   const [files, setFiles] = useState([]);
//   const [message, setMessage] = useState("");

//   const handleFileChange = (e) => setFiles(e.target.files);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (files.length === 0) return setMessage("Please select at least one file.");

//     const formData = new FormData();
//     for (let file of files) {
//       formData.append("files", file);
//     }

//     try {
//       await axios.post("https://localhost:7199/api/Resume/upload", formData);
//       setMessage("Uploaded successfully!");
//     } catch {
//       setMessage("Upload failed.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen  p-6">
//       <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
//         <h2 className="text-3xl font-semibold text-gray-800 text-center mb-4">Upload Resume</h2>

//         <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
//           <input
//             type="file"
//             multiple
//             onChange={handleFileChange}
//             className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <button
//             type="submit"
//             className="bg-blue-700 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-800 transition-all"
//           >
//             Submit
//           </button>
//         </form>

//         {message && (
//           <p className={`mt-4 text-center font-medium ${message.includes("failed") ? "text-red-500" : "text-green-600"}`}>
//             {message}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UploadResume;

/* UploadResume Component */
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
      const response = await axios.post("https://localhost:7199/api/Resume/upload", formData, {
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