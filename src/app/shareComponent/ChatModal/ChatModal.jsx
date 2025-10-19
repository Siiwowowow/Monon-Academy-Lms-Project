// components/ChatModal.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { FaTimes, FaPaperPlane, FaSmile } from "react-icons/fa";

export default function ChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "bot", timestamp: "10:30 AM" },
    { id: 2, text: "Hi there! Just checking in.", sender: "user", timestamp: "10:32 AM" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: inputValue, sender: "user", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setInputValue("");
      // Simulate bot response after a delay
      setTimeout(() => {
        setMessages(prev => [...prev, { id: prev.length + 1, text: "Thanks for your message! I'll get back to you soon.", sender: "bot", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed right-0 bottom-0 bg-white w-full sm:w-96 h-[80vh] sm:h-full max-w-md rounded-tl-xl shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">AI</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Grok Assistant</h2>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close chat"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Chat messages area */}
        <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <FaSmile size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium mb-1">No messages yet...</p>
              <p className="text-xs">Start a conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-end space-x-2">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Emoji picker"
            >
              <FaSmile size={16} />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend(e)}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              aria-label="Send message"
            >
              <FaPaperPlane size={16} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}