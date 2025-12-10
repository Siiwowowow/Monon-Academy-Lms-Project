// src/app/shareComponent/AIAssistant/AIAssistant.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { 
  FaTimes, 
  FaPaperPlane, 
  FaRobot, 
  FaSpinner,
  FaChevronUp,
  FaChevronDown,
  FaHome,
  FaBook,
  FaTachometerAlt,
  FaVideo,
  FaChalkboardTeacher,
  FaSignInAlt,
  FaUsers,
  FaPhoneAlt
} from "react-icons/fa";
import { useAIAssistant } from "@/context/AIAssistantContext";

export default function AIAssistant() {
  const { 
    isOpen, 
    closeAssistant, 
    messages, 
    isTyping, 
    processQuery
  } = useAIAssistant();
  
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when assistant opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMinimized]);

  // Handle send message
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    
    processQuery(inputValue);
    setInputValue("");
    
    // Refocus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  // Quick navigation buttons
  const quickNavButtons = [
    { label: "Home", icon: <FaHome />, query: "go to home" },
    { label: "Courses", icon: <FaBook />, query: "go to courses" },
    { label: "Dashboard", icon: <FaTachometerAlt />, query: "go to dashboard" },
    { label: "Videos", icon: <FaVideo />, query: "go to videos" },
    { label: "Teachers", icon: <FaChalkboardTeacher />, query: "go to teachers" },
    { label: "Login", icon: <FaSignInAlt />, query: "go to login" },
    { label: "Community", icon: <FaUsers />, query: "go to community" },
    { label: "Contact", icon: <FaPhoneAlt />, query: "go to contact" },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300" 
        onClick={closeAssistant}
        aria-hidden="true"
      />
      
      {/* Main Assistant Container */}
      <div className={`fixed right-0 bottom-0 bg-white w-full sm:w-96 
        ${isMinimized ? 'h-14' : 'h-[70vh] sm:h-[75vh]'} 
        max-w-full rounded-tl-xl sm:rounded-l-xl shadow-2xl flex flex-col z-50 
        transform transition-all duration-300 ease-in-out`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <FaRobot className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm sm:text-base">Monon AI</h2>
              <p className="text-xs text-blue-100">Type and press Enter</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
            </button>
            
            <button 
              onClick={closeAssistant} 
              className="p-1 text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close assistant"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Quick Navigation Buttons */}
            <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
              {quickNavButtons.map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => processQuery(btn.query)}
                  className="flex items-center space-x-1 px-2 py-1.5 text-xs rounded-lg bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <span className="text-gray-600">{btn.icon}</span>
                  <span className="font-medium text-gray-700">{btn.label}</span>
                </button>
              ))}
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <FaRobot className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-sm font-medium mb-1">Monon AI Assistant</p>
                  <p className="text-xs text-center">Type your message below and press Enter</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : message.type === "navigation"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-200" : "text-gray-500"}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <FaSpinner className="animate-spin text-gray-400" size={14} />
                      <span className="text-sm text-gray-600">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - FIXED */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <form onSubmit={handleSend} className="w-full">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message here..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    disabled={isTyping}
                    autoComplete="off"
                  />
                  
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    aria-label="Send message"
                  >
                    {isTyping ? (
                      <FaSpinner className="animate-spin" size={16} />
                    ) : (
                      <FaPaperPlane size={16} />
                    )}
                  </button>
                </div>
                
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Press Enter to send • Try: "what is monon academy?" or "go to courses"
                </div>
              </form>
            </div>
          </>
        )}

        {isMinimized && (
          <div className="flex items-center justify-between px-4 h-full bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center space-x-2">
              <FaRobot className="text-white" />
              <span className="text-sm font-medium text-white">Monon AI Assistant</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <button
              onClick={() => setIsMinimized(false)}
              className="text-white hover:text-blue-200"
            >
              <FaChevronUp size={14} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}