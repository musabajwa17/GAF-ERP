"use client";

import { useState } from "react";
import { MessageCircle, Mail, Phone, Send, Sparkles, ArrowRight } from "lucide-react";

export default function ContactUs() {
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredContact, setHoveredContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 px-6 py-20 flex flex-col items-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      {/* Header Section */}
      <div className="relative z-10 text-center mb-16 max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg mb-6">
          <Sparkles className="w-5 h-5 text-teal-600 animate-pulse" />
          <span className="text-sm font-semibold text-teal-700 tracking-wide uppercase">Let's Connect</span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 leading-tight mb-6">
          Ready To Manage Your Farm Smartly With CropERP?
        </h2>
        
        <p className="text-lg md:text-xl text-gray-700 font-medium max-w-3xl mx-auto leading-relaxed">
          Sign up for a free demo today.
          <br />
          <span className="text-teal-600 font-semibold">Let's work together</span> to make your farm more efficient, productive, and profitable!
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-7xl w-full">
        
        {/* Left Section - Info */}
        <div className="flex flex-col justify-between space-y-8">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="flex items-center gap-5   mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900">Have a</h3>
                <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Question?</h3>
              </div>
            </div>
            
            <p className="text-gray-700 text-base leading-relaxed mb-6">
              Our team is ready to assist you with any queries you may have about CropERP. 
              We provide tailored solutions to help you manage your farm efficiently.
            </p>

            {/* Image with overlay effect */}
            <div className="relative group rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 z-10"></div>
              <img 
                src="/crop7.jpg" 
                alt="Contact Us" 
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute bottom-4 left-4 z-20">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <span className="text-sm font-bold text-teal-700">Available 24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Mail, label: "Email Us", value: "contact@escan-systems.com", href: "mailto:contact@escan-systems.com" },
              { icon: Phone, label: "Call Us", value: "+61 452 284 468", href: "tel:+61452284468" },
              { icon: MessageCircle, label: "Live Chat", value: "Start Chat", href: "#" }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  onMouseEnter={() => setHoveredContact(index)}
                  onMouseLeave={() => setHoveredContact(null)}
                  className="group relative bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{item.label}</p>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-teal-600 transition-colors truncate">{item.value}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-3xl blur opacity-20"></div>
          
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-gray-900">Get In Touch</h3>
              <Send className="w-8 h-8 text-teal-500 animate-pulse" />
            </div>

            <div className="space-y-6">
              {[
                { label: "Name", field: "name", type: "text", rows: null },
                { label: "Email", field: "email", type: "email", rows: null },
                { label: "Phone Number", field: "phone", type: "tel", rows: null },
                { label: "Message", field: "message", type: "textarea", rows: 4 }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <label className="block text-gray-800 font-semibold mb-2 text-sm">
                    {item.label} <span className="text-red-500">*</span>
                  </label>
                  {item.type === "textarea" ? (
                    <textarea
                      required
                      rows={item.rows}
                      value={formData[item.field]}
                      onChange={(e) => handleChange(item.field, e.target.value)}
                      onFocus={() => setFocusedField(index)}
                      onBlur={() => setFocusedField(null)}
                      className="w-full resize-none px-5 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white transition-all duration-300 shadow-sm"
                    />
                  ) : (
                    <input
                      type={item.type}
                      required
                      value={formData[item.field]}
                      onChange={(e) => handleChange(item.field, e.target.value)}
                      onFocus={() => setFocusedField(index)}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-5 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white transition-all duration-300 shadow-sm"
                    />
                  )}
                  {focusedField === index && (
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 animate-pulse w-full rounded-full"></div>
                  )}
                </div>
              ))}

              <p className="text-sm text-gray-600 leading-relaxed">
                By submitting this form, you agree to CropERP's{" "}
                <span className="text-teal-600 underline cursor-pointer hover:text-teal-700 font-semibold">Privacy Policy</span> and{" "}
                <span className="text-teal-600 underline cursor-pointer hover:text-teal-700 font-semibold">Terms of Service</span>.
              </p>

              <button
                onClick={handleSubmit}
                className="group relative w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Submit Message
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}