// src/context/AIAssistantContext.jsx
"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

const AIAssistantContext = createContext();

export function AIAssistantProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: "👋 Hello! I'm Monon AI Assistant. You can ask me questions or say 'go to [page]' to navigate.",
        sender: "bot",
        timestamp: new Date(),
        type: "welcome"
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  // Get response based on query
  const getResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Navigation commands
    if (lowerQuery.includes('go to') || lowerQuery.includes('take me to') || lowerQuery.includes('open') || lowerQuery.includes('show me')) {
      if (lowerQuery.includes('home') || lowerQuery.includes('main')) {
        setTimeout(() => router.push('/'), 1000);
        return "🏠 Taking you to homepage...";
      } else if (lowerQuery.includes('course')) {
        setTimeout(() => router.push('/courses'), 1000);
        return "📚 Navigating to courses page...";
      } else if (lowerQuery.includes('dashboard')) {
        setTimeout(() => router.push('/dashboard'), 1000);
        return "📊 Opening your dashboard...";
      } else if (lowerQuery.includes('video')) {
        setTimeout(() => router.push('/video'), 1000);
        return "🎥 Loading video player...";
      } else if (lowerQuery.includes('teacher')) {
        setTimeout(() => router.push('/teachers'), 1000);
        return "👨‍🏫 Showing our instructors...";
      } else if (lowerQuery.includes('login')) {
        setTimeout(() => router.push('/login'), 1000);
        return "🔐 Opening login page...";
      } else if (lowerQuery.includes('sign up') || lowerQuery.includes('register')) {
        setTimeout(() => router.push('/signUp'), 1000);
        return "📝 Taking you to registration...";
      } else if (lowerQuery.includes('community')) {
        setTimeout(() => router.push('/community'), 1000);
        return "💬 Opening community...";
      } else if (lowerQuery.includes('contact')) {
        setTimeout(() => router.push('/contact'), 1000);
        return "📞 Opening contact page...";
      }
    }
    
    // Direct page names
    if (lowerQuery === 'courses' || lowerQuery === 'course') {
      setTimeout(() => router.push('/courses'), 1000);
      return "📚 Going to courses...";
    } else if (lowerQuery === 'dashboard') {
      setTimeout(() => router.push('/dashboard'), 1000);
      return "📊 Opening dashboard...";
    } else if (lowerQuery === 'home') {
      setTimeout(() => router.push('/'), 1000);
      return "🏠 Going home...";
    } else if (lowerQuery === 'videos' || lowerQuery === 'video') {
      setTimeout(() => router.push('/video'), 1000);
      return "🎥 Loading videos...";
    } else if (lowerQuery === 'teachers' || lowerQuery === 'teacher') {
      setTimeout(() => router.push('/teachers'), 1000);
      return "👨‍🏫 Showing teachers...";
    }
    
    // Common questions
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return "Hello! 👋 How can I help you today?";
    } else if (lowerQuery.includes('what is monon') || lowerQuery.includes('about monon')) {
      return "Monon Academy is an e-learning platform where you can take courses, watch video lessons, and track your learning progress.";
    } else if (lowerQuery.includes('course') && lowerQuery.includes('what')) {
      return "We offer courses in programming, business, design, and more. Each course has video lessons and exams.";
    } else if (lowerQuery.includes('how to login') || lowerQuery.includes('how do i login')) {
      return "You can login at the login page (/login) using your email or Google account.";
    } else if (lowerQuery.includes('how to enroll') || lowerQuery.includes('how do i enroll')) {
      return "Go to the courses page, select a course, and click 'Enroll Now'. Some courses may require payment.";
    } else if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('fee')) {
      return "Course prices vary. Some are free, others have fees. Check individual course pages for details.";
    } else if (lowerQuery.includes('help')) {
      return "I can help you navigate, answer questions about courses, or explain platform features. What do you need?";
    } else if (lowerQuery.includes('thank')) {
      return "You're welcome! 😊 Let me know if you need anything else.";
    } else if (lowerQuery.includes('bye') || lowerQuery.includes('goodbye')) {
      return "Goodbye! 👋 Come back anytime you need help.";
    }
    
    // Default responses
    const defaultResponses = [
      "I understand. How can I assist you with Monon Academy?",
      "Thanks for your message! What would you like to know?",
      "I'm here to help! You can ask about courses, navigation, or platform features.",
      "Could you tell me more about what you're looking for?",
      "Let me help you with that. What specifically would you like to know?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  // Process user query
  const processQuery = useCallback(async (query) => {
    if (!query.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: query,
      sender: "user",
      timestamp: new Date(),
      type: "text"
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate thinking
    setTimeout(() => {
      const response = getResponse(query);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: "bot",
        timestamp: new Date(),
        type: response.includes("Taking you") || response.includes("Navigating") || response.includes("Opening") ? "navigation" : "chat"
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  }, []);

  const openAssistant = () => setIsOpen(true);
  const closeAssistant = () => setIsOpen(false);

  const value = {
    isOpen,
    openAssistant,
    closeAssistant,
    messages,
    isTyping,
    processQuery
  };

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  );
}

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error("useAIAssistant must be used within AIAssistantProvider");
  }
  return context;
};