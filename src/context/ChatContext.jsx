// context/ChatContext.jsx
"use client";

import ChatModal from "@/app/shareComponent/ChatModal/ChatModal";
import { createContext, useContext, useState } from "react";


const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  return (
    <ChatContext.Provider value={{ isOpen, openChat, closeChat }}>
      {children}
      <ChatModal isOpen={isOpen} onClose={closeChat} />
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
