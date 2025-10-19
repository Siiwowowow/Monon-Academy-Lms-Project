// components/ChatButton.jsx
"use client";

import { FaComments } from "react-icons/fa";
import { useChat } from "@/context/ChatContext";

export default function ChatButton() {
  const { openChat } = useChat();

  return (
    <button
      onClick={openChat}
      className="fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 z-50"
      aria-label="Open chat"
    >
      <FaComments size={24} />
    </button>
  );
}
