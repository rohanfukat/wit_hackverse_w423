import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';
import { 
  BookOpen, 
  TrendingUp, 
  Shield, 
  Globe, 
  Award, 
  Sun, 
  Moon,
  Check,
  ArrowRight,
  BarChart2,
  Target,
  Activity
} from 'lucide-react';

const HomePage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      if (formData.email && formData.password) {
        navigate('/dashboard');
      }
    } else {
      if (formData.username && formData.email && 
          formData.password && 
          formData.password === formData.confirmPassword) {
        navigate('/dashboard');
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const features = [
    {
      icon: <BarChart2 className="w-8 h-8" />,
      title: "CO-PO Mapping",
      description: "Seamless alignment of Course Outcomes with Program Outcomes.",
      color: "bg-purple-500/20 text-purple-600"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Outcome Assessment",
      description: "Comprehensive tools for measuring educational achievements.",
      color: "bg-green-500/20 text-green-600"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Advanced insights into student and program performance.",
      color: "bg-blue-500/20 text-blue-600"
    }
  ];

  return (
    <div 
      className={`
        relative min-h-screen overflow-hidden
        ${isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-gray-100 via-white to-gray-200'}
      `}
    >
      {/* Navigation and Main Content remain the same as previous implementation */}
      <nav className={`
        relative z-10 flex justify-between items-center p-6 
        ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'}
      `}>
        <div className="flex items-center space-x-3">
          <BookOpen 
            className={`
              w-8 h-8
              ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}
            `} 
          />
          <h1 className={`
            text-2xl font-bold tracking-tight
            ${isDarkMode ? 'text-white' : 'text-black'}
          `}>
            Academic Outcome Insights
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className={`
              p-2 rounded-full transition-colors duration-300
              ${isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'}
            `}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          {/* Left Section: Features */}
          <div className="space-y-8">
            <h2 className={`
              text-5xl font-extrabold leading-tight
              ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}
            `}>
              Empower Outcome-Based <br />Education
            </h2>
            <p className={`
              text-xl 
              ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
            `}>
              Streamline Course Outcome and Program Outcome mapping with advanced analytics and assessment tools.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`
                    p-5 rounded-xl shadow-lg transition-all duration-300 group
                    ${feature.color}
                    ${isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-white hover:bg-gray-50'}
                  `}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className={`
                      p-2 rounded-full
                      ${feature.color}
                      group-hover:scale-110 transition-transform
                    `}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm opacity-70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section: Authentication Form (remains the same) */}
          <div>
            <div className={`
              p-8 rounded-2xl shadow-2xl relative overflow-hidden
              ${isDarkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white'}
            `}>
              {/* Subtle Gradient Overlay */}
              <div 
                className={`
                  absolute top-0 left-0 w-full h-full opacity-20 
                  ${isDarkMode 
                    ? 'bg-gradient-to-br from-blue-900 to-purple-900' 
                    : 'bg-gradient-to-br from-blue-100 to-purple-100'}
                `}
              ></div>

              <h2 className={`
                text-2xl font-bold mb-6 text-center relative z-10
                ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}
              `}>
                {isLogin ? 'Faculty Login' : 'Create Faculty Account'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                {!isLogin && (
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      placeholder="Faculty Name"
                      value={formData.username}
                      onChange={handleChange}
                      required={!isLogin}
                      className={`
                        w-full p-3 rounded-md pl-10
                        ${isDarkMode 
                          ? 'bg-gray-700 text-gray-100 border-gray-600' 
                          : 'border text-gray-900'}
                      `}
                    />
                    <Check 
                      className={`
                        absolute left-3 top-1/2 transform -translate-y-1/2
                        ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                      `} 
                      size={20} 
                    />
                  </div>
                )}
                
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="Institutional Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`
                      w-full p-3 rounded-md pl-10
                      ${isDarkMode 
                        ? 'bg-gray-700 text-gray-100 border-gray-600' 
                        : 'border text-gray-900'}
                    `}
                  />
                  <TrendingUp 
                    className={`
                      absolute left-3 top-1/2 transform -translate-y-1/2
                      ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                    `} 
                    size={20} 
                  />
                </div>
                
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className={`
                      w-full p-3 rounded-md pl-10
                      ${isDarkMode 
                        ? 'bg-gray-700 text-gray-100 border-gray-600' 
                        : 'border text-gray-900'}
                    `}
                  />
                  <Shield 
                    className={`
                      absolute left-3 top-1/2 transform -translate-y-1/2
                      ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                    `} 
                    size={20} 
                  />
                </div>
                
                {!isLogin && (
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required={!isLogin}
                      minLength="6"
                      className={`
                        w-full p-3 rounded-md pl-10
                        ${isDarkMode 
                          ? 'bg-gray-700 text-gray-100 border-gray-600' 
                          : 'border text-gray-900'}
                      `}
                    />
                    <Shield 
                      className={`
                        absolute left-3 top-1/2 transform -translate-y-1/2
                        ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                      `} 
                      size={20} 
                    />
                  </div>
                )}
                
                <button
                  type="submit"
                  className={`
                    w-full p-3 rounded-md hover:opacity-90 transition duration-300
                    ${isDarkMode 
                      ? 'bg-gradient-to-r from-blue-700 to-purple-700 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'}
                  `}
                >
                  {isLogin ? 'Login' : 'Create Account'}
                </button>
              </form>
              
              <div className="text-center mt-4 relative z-10">
                <button
                  onClick={toggleForm}
                  className={`
                    hover:underline text-sm
                    ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}
                  `}
                >
                  {isLogin 
                    ? 'Need an account? Sign Up' 
                    : 'Already have an account? Login'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;