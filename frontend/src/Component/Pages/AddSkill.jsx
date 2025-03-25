import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, PlusCircle, Database } from 'lucide-react';

const AddSkill = () => {
    const [skill, setSkill] = useState([]);
    const [formData, setFormData] = useState({ key: "", value: "" });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });

    useEffect(() => {
        setLoading(true);
        fetch('/SkillMapper.json')
            .then((response) => response.json())
            .then((data) => {
                setSkill(data);
                if (data.length > 0) {
                    setFormData(prevState => ({ ...prevState, key: data[0].value }));
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error loading skills:", error);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("https://localhost:7199/api/SkillMapping/add-skill", formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setNotification({ show: true, message: "Skill added successfully!", type: "success" });
            // Reset form data
            setFormData({ ...formData, value: "" });
        } catch (error) {
            setNotification({ 
                show: true, 
                message: "Skill addition failed! " + (error.response?.data || "Unknown error"), 
                type: "error" 
            });
        } finally {
            setLoading(false);
            // Auto-hide notification after 5 seconds
            setTimeout(() => {
                setNotification({ show: false, message: "", type: "" });
            }, 5000);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0,
            opacity: 1,
            transition: { duration: 0.4 }
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
            <motion.div 
                className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 relative overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Decorative element */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                
                <motion.div className="flex items-center mb-6" variants={itemVariants}>
                    <Database className="text-blue-600 mr-3" size={24} />
                    <h1 className="text-2xl font-semibold text-gray-800">Add New Skill</h1>
                </motion.div>
                
                <p className="text-gray-600 mb-6">Add a new skill to the system by selecting a category and entering the skill name.</p>
                
                {notification.show && (
                    <motion.div 
                        className={`p-4 mb-6 rounded-md flex items-center ${notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        {notification.type === 'success' ? 
                            <CheckCircle className="mr-2" size={20} /> : 
                            <AlertTriangle className="mr-2" size={20} />
                        }
                        {notification.message}
                    </motion.div>
                )}
                
                <form className="space-y-6" onSubmit={handleAddSkill}>
                    <motion.div variants={itemVariants}>
                        <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <div className="relative">
                            <select
                                id="key"
                                name="key"
                                className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md transition-all duration-200 bg-white"
                                onChange={handleChange}
                                required
                                value={formData.key}
                            >
                                {skill.length === 0 && <option value="">Loading categories...</option>}
                                {skill.map((item, index) => (
                                    <option key={index} value={item.value}>{item.value}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                        <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                            Skill Name
                        </label>
                        <input
                            type="text"
                            id="value"
                            name="value"
                            value={formData.value}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter the skill name"
                            onChange={handleChange}
                            required
                        />
                    </motion.div>
                    
                    <motion.div className="flex justify-end pt-4" variants={itemVariants}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="mr-2" size={20} />
                                    Add Skill
                                </>
                            )}
                        </button>
                    </motion.div>
                </form>
            </motion.div>
            
            {/* Visual indicator for skill categories */}
            <motion.div 
                className="mt-8 w-full max-w-2xl bg-white rounded-lg shadow-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <h2 className="text-xl font-medium text-gray-800 mb-4">Available Categories</h2>
                <div className="flex flex-wrap gap-2">
                    {skill.map((item, index) => (
                        <motion.span 
                            key={index}
                            className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {item.value}
                        </motion.span>
                    ))}
                    {skill.length === 0 && (
                        <span className="text-gray-500">Loading categories...</span>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AddSkill;