"use client";

import { useState, useRef, useEffect } from "react";
import { FaTimes, FaPaperPlane, FaSmile } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ChatModal({ isOpen, onClose }) {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { if (isOpen) scrollToBottom(); }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setMessages(prev => [...prev, { id: prev.length + 1, text: userMessage, sender: "user" }]);
    setInputValue("");

    setIsTyping(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage }),
      });
      const data = await res.json();

      setMessages(prev => [...prev, { id: prev.length + 2, text: data.text, sender: "bot" }]);
      setIsTyping(false);

      if (data.route) router.push(data.route);

    } catch (err) {
      setMessages(prev => [...prev, { id: prev.length + 2, text: "Sorry, something went wrong.", sender: "bot" }]);
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 bottom-0 bg-white w-full sm:w-96 h-[80vh] sm:h-full max-w-md rounded-tl-xl shadow-2xl flex flex-col z-50">
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
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 rounded-full">
            <FaTimes size={16} />
          </button>
        </div>

        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FaSmile size={24} className="text-gray-400 mb-2" />
              <p className="text-sm font-medium mb-1">No messages yet...</p>
              <p className="text-xs">Start a conversation!</p>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl whitespace-pre-wrap break-words ${msg.sender === "user" ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-100 text-gray-900 italic">
                Typing...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex items-end space-x-2 bg-white">
          <button type="button" className="p-2 text-gray-500 hover:text-gray-700 rounded-full">
            <FaSmile size={16} />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none whitespace-pre-wrap break-words"
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend(e)}
          />
          <button type="submit" disabled={!inputValue.trim()} className="p-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:bg-gray-300">
            <FaPaperPlane size={16} />
          </button>
        </form>
      </div>
    </>
  );
}
