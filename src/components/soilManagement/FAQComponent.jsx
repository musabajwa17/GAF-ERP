'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQComponent() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Smart Farming?",
      answer: "Smart farming is the application of modern technology like IoT sensors, AI, and data analytics to optimize agricultural practices, improve crop yields, and reduce resource waste."
    },
    {
      question: "How does Smart Farming help increase productivity?",
      answer: "Smart farming increases productivity through precision agriculture, real-time monitoring of soil conditions, automated irrigation systems, and data-driven decision making that optimizes every aspect of crop production."
    },
    {
      question: "What technologies are used in Smart Farming?",
      answer: "Key technologies include IoT sensors, drones, GPS guidance systems, AI-powered analytics, automated machinery, weather forecasting tools, and mobile applications for farm management."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Smart Farming Undiscovered!
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: '#ffffff' }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="text-lg font-semibold text-gray-800">
                  {faq.question}
                </span>
                <div className="ml-4 flex-shrink-0">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white">
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-600 transition-transform duration-300" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600 transition-transform duration-300" />
                    )}
                  </div>
                </div>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}