// src/app/shareComponent/AIAssistant/AIAssistantButton.jsx
"use client";

import { FaRobot, FaTimes } from "react-icons/fa";
import { useAIAssistant } from "@/context/AIAssistantContext";

export default function AIAssistantButton() {
  const { isOpen, openAssistant, closeAssistant } = useAIAssistant();

  return (
    <button
      onClick={isOpen ? closeAssistant : openAssistant}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
      aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
    >
      {isOpen ? (
        <FaTimes size={24} />
      ) : (
        <>
          <FaRobot size={24} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </>
      )}
    </button>
  );
}