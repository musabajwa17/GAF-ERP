"use client";
import { useState, useEffect } from "react";
// import axios from 'axios';
import {
  User,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Globe,
  Phone,
} from "lucide-react";
// import Nav from '../components/nav';
// import registrationimage from '../../../public/logo.jpg';
// import { Registration } from '../api/auth';
// import { useNavigate } from 'react-router-dom';

export default function Register() {
  // const redirect = useNavigate()
 const [form, setForm] = useState({
  username: "",
  email: "",
  password: "",
  confirm_password: "",
  country: "",
  code: "",
  phone: "",
});
console.log(form);



  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    email: false,
    password: false,
    confirm_password: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [country, setCountry] = useState("Pakistan");
  const [countryCode, setCountryCode] = useState("+92");

  const countries = [
    { name: "Pakistan", code: "+92" },
    { name: "United States", code: "+1" },
    { name: "United Kingdom", code: "+44" },
    { name: "India", code: "+91" },
    { name: "Canada", code: "+1" },
    { name: "Australia", code: "+61" },
  ];

  const handleCountryChange = (e) => {
    const selected = countries.find((c) => c.name === e.target.value);
    setCountry(selected.name);
    setCountryCode(selected.code);
  };

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation functions
  const validateUsername = (value) => {
    if (!value.trim()) {
      return "Username is required";
    }
    if (value.length < 3) {
      return "Username must be at least 3 characters long";
    }
    if (value.length > 30) {
      return "Username must be less than 30 characters";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    return "";
  };

  const validateEmail = (value) => {
    if (!value.trim()) {
      return "Email is required";
    }
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(value)) {
      return "Password must contain at least one number";
    }
    if (!/(?=.*[@$!%*?&])/.test(value)) {
      return "Password must contain at least one special character (@$!%*?&)";
    }
    return "";
  };

  const validateConfirmPassword = (value, password) => {
    if (!value) {
      return "Please confirm your password";
    }
    if (value !== password) {
      return "Passwords do not match";
    }
    return "";
  };

  // Handle field blur events
  const handleFieldBlur = (fieldName) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  // Real-time validation
  useEffect(() => {
    const usernameError = validateUsername(form.username);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    const confirmPasswordError = validateConfirmPassword(
      form.confirm_password,
      form.password
    );

    setErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
      confirm_password: confirmPasswordError,
    });

    const allFieldsValid =
      !usernameError && !emailError && !passwordError && !confirmPasswordError;
    const allFieldsFilled =
      form.username.trim() &&
      form.email.trim() &&
      form.password &&
      form.confirm_password;

    setIsFormValid(allFieldsValid && allFieldsFilled && termsAccepted);
  }, [form, termsAccepted]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault();

    // Mark all fields as touched when form is submitted
    setTouchedFields({
      username: true,
      email: true,
      password: true,
      confirm_password: true,
    });

    // Final validation
    const usernameError = validateUsername(form.username);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    const confirmPasswordError = validateConfirmPassword(
      form.confirm_password,
      form.password
    );

    if (
      usernameError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      !termsAccepted
    ) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
        confirm_password: confirmPasswordError,
      });
      if (!termsAccepted) {
        alert("Please accept the Terms of Service and Privacy Policy");
      }
      return;
    }

    setIsLoading(true);
    try {
      const res = await Registration(form);
      if (res.status === 201 || res.status === 200) {
        window.location.href = "/login";
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* <Nav /> */}
      <section className=" w-full h-screen flex items-center justify-center bg-gradient-to-b from-green-50 from-10% to-green-200">
        <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center overflow-hidden bg-white/90 backdrop-blur-md">
          {/* Left Side - Image */}
         <div className="hidden lg:flex w-1/2 h-full relative border-r border-emerald-200 overflow-hidden">
  {/* Animated gradient background */}
  <div className="absolute inset-0" style={{
    backgroundImage: `url("https://img.freepik.com/free-photo/farmer-rice-field-with-laptop_1150-6048.jpg?t=st=1762428760~exp=1762432360~hmac=5dc90bd790aa918a726f62206d25c9daab3cf5aab95428ec49f5ffb53977898a&w=1480")`,
    backgroundSize: "cover",
    backgroundPosition: "right",
    height: "100vh",
    width: "100%",
  }}>
    {/* Animated mesh gradient overlay */}
        <span  className="absolute left-0 top-0 h-full w-g inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 opacity-35"></span>
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
    </div>
    
    {/* Geometric pattern overlay */}
    <div className="absolute inset-0 opacity-10" style={{
      backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
      backgroundSize: '32px 32px'
    }}></div>
  </div>

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-center">
    {/* Animated sprout/growth icon container */}
    <div className="relative mb-8">
      {/* Outer glow rings */}
      <div className="absolute inset-0 -m-8">
        <div className="w-full h-full rounded-full bg-white/10 animate-ping"></div>
      </div>
      <div className="absolute inset-0 -m-6">
        <div className="w-full h-full rounded-full bg-white/20 animate-pulse"></div>
      </div>
      
      {/* Main sprout container */}
      <div className="relative w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform duration-500">
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Sprout/Seedling icon */}
        <div className="relative">
          {/* Soil/pot base */}
          <div className="w-20 h-8 bg-gradient-to-b from-amber-700 to-amber-900 rounded-b-2xl shadow-xl relative overflow-hidden">
            {/* Soil texture lines */}
            <div className="absolute inset-0 opacity-30">
              <div className="h-px bg-amber-950 mt-2"></div>
              <div className="h-px bg-amber-950 mt-2"></div>
              <div className="h-px bg-amber-950 mt-2"></div>
            </div>
          </div>
          
          {/* Stem */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-2 h-12 bg-gradient-to-t from-green-600 to-green-500 rounded-full shadow-lg"></div>
          
          {/* Left leaf */}
          <div className="absolute bottom-12 left-4 w-6 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full transform -rotate-45 shadow-lg animate-bounce-slow">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full"></div>
          </div>
          
          {/* Right leaf */}
          <div className="absolute bottom-12 right-4 w-6 h-8 bg-gradient-to-bl from-green-400 to-green-600 rounded-full transform rotate-45 shadow-lg animate-bounce-slow animation-delay-500">
            <div className="absolute inset-0 bg-gradient-to-bl from-white/40 to-transparent rounded-full"></div>
          </div>
          
          {/* Top leaves (new growth) */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-6 bg-gradient-to-t from-green-300 to-green-400 rounded-full shadow-lg animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent rounded-full"></div>
          </div>
          
          {/* Animated sparkles (growth particles) */}
          <div className="absolute -top-4 -right-3 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
          <div className="absolute -top-2 -left-3 w-2 h-2 bg-green-300 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping animation-delay-2000"></div>
        </div>
      </div>
    </div>

    {/* Welcome text */}
    <div className="space-y-6">
      <h2 className="text-5xl font-bold text-white drop-shadow-2xl tracking-tight">
        Join Our Community
      </h2>
      
      {/* Animated underline */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-12 h-1 bg-white/60 rounded-full animate-pulse"></div>
        <div className="w-20 h-1.5 bg-white rounded-full"></div>
        <div className="w-12 h-1 bg-white/60 rounded-full animate-pulse animation-delay-1000"></div>
      </div>
      
      <p className="text-2xl text-white/95 font-light drop-shadow-lg">
        Start Your Agricultural Journey Today
      </p>
      
      <p className="text-lg text-white/80 max-w-md leading-relaxed drop-shadow-md">
        Create your account and unlock powerful tools to grow your farming success
      </p>
      
      {/* Feature badges */}
      <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
        <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium shadow-lg hover:bg-white/30 transition-all duration-300">
          🌱 Easy Setup
        </div>
        <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium shadow-lg hover:bg-white/30 transition-all duration-300">
          📊 Free Tools
        </div>
        <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium shadow-lg hover:bg-white/30 transition-all duration-300">
          🤝 Community
        </div>
      </div>
    </div>
  </div>

  {/* Bottom decorative wave */}
  <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20">
    <svg viewBox="0 0 1200 120" className="w-full h-full">
      <path d="M0,50 Q300,10 600,50 T1200,50 L1200,120 L0,120 Z" fill="white"/>
    </svg>
  </div>
</div>


          {/* Right Side - Registration Form */}
          <div className="w-full h-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 overflow-y-scroll scrollbar-hide">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h1 className="text-4xl text-[var(--color)] font-extrabold mb-2">
                  Create Account
                </h1>
                <p className="text-gray-600">
                  Join us and start your journey today
                </p>
              </div>

              <form onSubmit={registerUser} className="space-y-4">
                {/* Username Field */}
                <div>
                  <div
                    className={`flex items-center gap-3 border-2 bg-white px-4 py-3 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${
                      touchedFields.username && errors.username
                        ? "border-red-500 focus-within:border-red-500"
                        : form.username && !errors.username
                        ? "border-green-500 focus-within:border-green-500"
                        : "border-gray-200 focus-within:border-[var(--color)]"
                    }`}
                  >
                    <User
                      className={`text-[15px] ${
                        touchedFields.username && errors.username
                          ? "text-red-500"
                          : form.username && !errors.username
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      className="w-full p- outline-none bg-transparent text-gray-700 placeholder-gray-400 text-[15px]"
                      name="username"
                      placeholder="Username"
                      value={form.username}
                      onChange={handleChange}
                      onBlur={() => handleFieldBlur("username")}
                    />
                    {form.username && (
                      <div className="flex-shrink-0">
                        {errors.username ? (
                          <AlertTriangle className="text-red-500 text-lg" />
                        ) : (
                          <CheckCircle2 className="text-green-500 text-lg" />
                        )}
                      </div>
                    )}
                  </div>
                  {touchedFields.username && errors.username && (
                    <p className="text-red-500 text-sm mt-2 ml-1 flex items-center gap-1">
                      <AlertTriangle className="text-xs" />
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <div
                    className={`flex items-center gap-3 border-2 bg-white px-4 py-3 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${
                      touchedFields.email && errors.email
                        ? "border-red-500 focus-within:border-red-500"
                        : form.email && !errors.email
                        ? "border-green-500 focus-within:border-green-500"
                        : "border-gray-200 focus-within:border-[var(--color)]"
                    }`}
                  >
                    <Mail
                      className={`text-[19px] ${
                        touchedFields.email && errors.email
                          ? "text-red-500"
                          : form.email && !errors.email
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      className="w-full p- outline-none bg-transparent text-gray-700 placeholder-gray-400 text-[15px]"
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={() => handleFieldBlur("email")}
                    />
                    {form.email && (
                      <div className="flex-shrink-0">
                        {errors.email ? (
                          <AlertTriangle className="text-red-500 text-lg" />
                        ) : (
                          <CheckCircle2 className="text-green-500 text-lg" />
                        )}
                      </div>
                    )}
                  </div>
                  {touchedFields.email && errors.email && (
                    <p className="text-red-500 text-sm mt-2 ml-1 flex items-center gap-1">
                      <AlertTriangle className="text-xs" />
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-5">
                  {/* Country Dropdown */}
                  <div>
                    <div
                      className={`flex items-center gap-3 border-2 bg-white px-4 py-3 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${
                        touchedFields.country && errors.country
                          ? "border-red-500 focus-within:border-red-500"
                          : form.country && !errors.country
                          ? "border-green-500 focus-within:border-green-500"
                          : "border-gray-200 focus-within:border-[var(--color)]"
                      }`}
                    >
                      <Globe
                        className={`text-[19px] ${
                          touchedFields.country && errors.country
                            ? "text-red-500"
                            : form.country && !errors.country
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />

                      <select
                        name="country"
                        value={form.country}
                        onChange={(e) => {
                          handleChange(e);
                          // Set country code automatically
                          const selected = countries.find(
                            (c) => c.name === e.target.value
                          );
                          setForm((prev) => ({
                            ...prev,
                            code: selected ? selected.code : "",
                          }));
                        }}
                        onBlur={() => handleFieldBlur("country")}
                        className="w-full bg-transparent outline-none text-gray-400 text-[15px]"
                      >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>

                      {form.country && (
                        <div className="flex-shrink-0">
                          {errors.country ? (
                            <AlertTriangle className="text-red-500 text-lg" />
                          ) : (
                            <CheckCircle2 className="text-green-500 text-lg" />
                          )}
                        </div>
                      )}
                    </div>
                    {touchedFields.country && errors.country && (
                      <p className="text-red-500 text-sm mt-2 ml-1 flex items-center gap-1">
                        <AlertTriangle className="text-xs" />
                        {errors.country}
                      </p>
                    )}
                  </div>

                  {/* Contact Number */}
                  <div>
                    <div
                      className={`flex items-center gap-3 border-2 bg-white px-4 py-3 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${
                        touchedFields.phone && errors.phone
                          ? "border-red-500 focus-within:border-red-500"
                          : form.phone && !errors.phone
                          ? "border-green-500 focus-within:border-green-500"
                          : "border-gray-200 focus-within:border-[var(--color)]"
                      }`}
                    >
                      <Phone
                        className={`text-[19px] ${
                          touchedFields.phone && errors.phone
                            ? "text-red-500"
                            : form.phone && !errors.phone
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="text-gray-600 text-[15px]">
                        {form.code}
                      </span>
                      <input
                        className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400 text-[15px]"
                        name="phone"
                        type="tel"
                        placeholder="Enter contact number"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={() => handleFieldBlur("phone")}
                      />
                      {form.phone && (
                        <div className="flex-shrink-0">
                          {errors.phone ? (
                            <AlertTriangle className="text-red-500 text-lg" />
                          ) : (
                            <CheckCircle2 className="text-green-500 text-lg" />
                          )}
                        </div>
                      )}
                    </div>
                    {touchedFields.phone && errors.phone && (
                      <p className="text-red-500 text-sm mt-2 ml-1 flex items-center gap-1">
                        <AlertTriangle className="text-xs" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div
                    className={`flex items-center gap-3 border-2 bg-white px-4 py-3 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${
                      touchedFields.password && errors.password
                        ? "border-red-500 focus-within:border-red-500"
                        : form.password && !errors.password
                        ? "border-green-500 focus-within:border-green-500"
                        : "border-gray-200 focus-within:border-[var(--color)]"
                    }`}
                  >
                    <Lock
                      className={`text-[19px] ${
                        touchedFields.password && errors.password
                          ? "text-red-500"
                          : form.password && !errors.password
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400 text-[15px]"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      onBlur={() => handleFieldBlur("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="text-xl" />
                      ) : (
                        <Eye className="text-xl" />
                      )}
                    </button>
                    {form.password && (
                      <div className="flex-shrink-0">
                        {errors.password ? (
                          <AlertTriangle className="text-red-500 text-lg" />
                        ) : (
                          <CheckCircle2 className="text-green-500 text-lg" />
                        )}
                      </div>
                    )}
                  </div>
                  {touchedFields.password && errors.password && (
                    <p className="text-red-500 text-sm mt-2 ml-1 flex items-center gap-1">
                      <AlertTriangle className="text-xs" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <div
                    className={`flex items-center gap-3 border-2 bg-white px-4 py-3 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${
                      touchedFields.confirm_password && errors.confirm_password
                        ? "border-red-500 focus-within:border-red-500"
                        : form.confirm_password && !errors.confirm_password
                        ? "border-green-500 focus-within:border-green-500"
                        : "border-gray-200 focus-within:border-[var(--color)]"
                    }`}
                  >
                    <Lock
                      className={`text-[19px] ${
                        touchedFields.confirm_password &&
                        errors.confirm_password
                          ? "text-red-500"
                          : form.confirm_password && !errors.confirm_password
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400 text-[15px]"
                      name="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={form.confirm_password}
                      onChange={handleChange}
                      onBlur={() => handleFieldBlur("confirm_password")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="text-xl" />
                      ) : (
                        <Eye className="text-xl" />
                      )}
                    </button>
                    {form.confirm_password && (
                      <div className="flex-shrink-0">
                        {errors.confirm_password ? (
                          <AlertTriangle className="text-red-500 text-lg" />
                        ) : (
                          <CheckCircle2 className="text-green-500 text-lg" />
                        )}
                      </div>
                    )}
                  </div>
                  {touchedFields.confirm_password &&
                    errors.confirm_password && (
                      <p className="text-red-500 text-sm mt-2 ml-1 flex items-center gap-1">
                        <AlertTriangle className="text-xs" />
                        {errors.confirm_password}
                      </p>
                    )}
                </div>

                {/* Terms and Conditions */}
                <div
                  className={`flex items-start gap-3 py-2 px-4 rounded-xl transition-colors ${
                    termsAccepted
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 h-5 w-5 text-[var(--color)] border-gray-300 rounded focus:ring-[var(--color)] focus:ring-2"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 leading-relaxed"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-[var(--color)] hover:underline font-medium"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-[var(--color)] hover:underline font-medium"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className="w-full py-4 px-6 bg-[var(--color)] hover:bg-[var(--color)]/90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex justify-center items-center gap-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <User className="text-xl" />
                      Create Account
                    </>
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center pt-2">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-[var(--color)] hover:underline font-semibold transition-colors"
                    >
                      Login in here
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }
  
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0) rotate(-45deg); }
    50% { transform: translateY(-5px) rotate(-45deg); }
  }
  
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
  }
  
  .animation-delay-500 {
    animation-delay: 0.5s;
  }
  
  .animation-delay-1000 {
    animation-delay: 1s;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`}</style>

    </>
  );
}
