// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ 
//     FirstName: "", 
//     LastName: "", 
//     EmailId: "", 
//     Password: "" 
//   });

//   const handleChange = (e) => {
//     console.log(e.target.name, e.target.value);
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("https://localhost:7199/api/Users/register", formData, {
//         headers: { "Content-Type": "application/json" }
//       });
//       alert("Registration successful! Please login.");
//       navigate("/login");
//     } catch (error) {
//       console.error("Error:", error.response?.data);
//       alert(error.response?.data?.Message || "Registration failed");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-10 bg-[#f4f7f9] min-h-screen">
//       <h2 className="text-3xl font-bold text-[#005792] m-3">Register</h2>
//       <form className="bg-white p-6 rounded-lg shadow-md w-80" onSubmit={handleRegister}>
//         <input type="text" name="FirstName" placeholder="First Name" onChange={handleChange} required className="p-3 border rounded-md w-full m-1" />
//         <input type="text" name="LastName" placeholder="Last Name" onChange={handleChange} required className="p-3 border rounded-md w-full m-1" />
//         <input type="email" name="EmailId" placeholder="Email" onChange={handleChange} required className="p-3 border rounded-md w-full m-1" />
//         <input type="password" name="Password" placeholder="Password" onChange={handleChange} required className="p-3 border rounded-md w-full m-1" />
//         <button type="submit" className="bg-[#005792] text-white px-6 py-2 rounded-md w-full mt-4 hover:bg-[#008cba] transition-all">
//           Register
//         </button>
//         <p className="text-gray-600 m-1">
//           Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    FirstName: "", 
    LastName: "", 
    EmailId: "", 
    Password: "",
    ConfirmPassword: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error when user types
    
    // Calculate password strength when password changes
    if (e.target.name === "Password") {
      const strength = calculatePasswordStrength(e.target.value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password) => {
    // Simple password strength calculation
    let score = 0;
    if (password.length > 6) score += 1;
    if (password.length > 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const validateForm = () => {
    if (formData.Password !== formData.ConfirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.Password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const dataToSend = {
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        EmailId: formData.EmailId,
        Password: formData.Password
      };
      
      await axios.post("https://localhost:7199/api/Users/register", dataToSend, {
        headers: { "Content-Type": "application/json" }
      });
      
      // Redirect to login with success message
      navigate("/login", { 
        state: { 
          notification: {
            type: "success",
            message: "Registration successful! Please log in with your new account."
          } 
        }
      });
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.Message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4 shadow-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:shadow-2xl transform hover:-translate-y-1">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <h3 className="text-xl font-semibold text-white">Sign Up</h3>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 animate-pulse">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Body */}
          <form onSubmit={handleRegister} className="p-6 space-y-4">
            {/* Name Inputs - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name Input */}
              <div className="space-y-2">
                <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    id="FirstName"
                    name="FirstName" 
                    value={formData.FirstName}
                    placeholder="John" 
                    onChange={handleChange} 
                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 transition-all duration-200 shadow-sm"
                    required 
                  />
                </div>
              </div>

              {/* Last Name Input */}
              <div className="space-y-2">
                <label htmlFor="LastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    id="LastName"
                    name="LastName" 
                    value={formData.LastName}
                    placeholder="Doe" 
                    onChange={handleChange} 
                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 transition-all duration-200 shadow-sm"
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="EmailId" className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
                <input 
                  type="email" 
                  id="EmailId"
                  name="EmailId" 
                  value={formData.EmailId}
                  placeholder="you@example.com" 
                  onChange={handleChange} 
                  className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 transition-all duration-200 shadow-sm"
                  required 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="Password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="Password"
                  name="Password" 
                  value={formData.Password}
                  placeholder="••••••••" 
                  onChange={handleChange} 
                  className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 transition-all duration-200 shadow-sm"
                  required 
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {formData.Password && (
                <div className="mt-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Password strength:</span>
                    <span className="text-xs font-medium">
                      {passwordStrength === 0 && "Very weak"}
                      {passwordStrength === 1 && "Weak"}
                      {passwordStrength === 2 && "Fair"}
                      {passwordStrength === 3 && "Good"}
                      {passwordStrength === 4 && "Strong"}
                      {passwordStrength === 5 && "Very strong"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        passwordStrength <= 1 ? "bg-red-500" : 
                        passwordStrength <= 2 ? "bg-orange-500" : 
                        passwordStrength <= 3 ? "bg-yellow-500" : 
                        passwordStrength <= 4 ? "bg-green-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label htmlFor="ConfirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="ConfirmPassword"
                  name="ConfirmPassword" 
                  value={formData.ConfirmPassword}
                  placeholder="••••••••" 
                  onChange={handleChange} 
                  className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 transition-all duration-200 shadow-sm"
                  required 
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors focus:outline-none focus:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;