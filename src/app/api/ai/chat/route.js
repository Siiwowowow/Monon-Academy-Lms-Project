// src/app/api/ai/chat/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message } = await request.json();
    
    console.log("API Received:", message);
    
    // Simple immediate responses for testing
    const responses = {
      "hello": "👋 Hello! How can I help you with Monon Academy?",
      "hi": "Hi there! What would you like to know?",
      "what is monon academy": "Monon Academy is an e-learning platform offering courses, video lessons, and exams.",
      "courses": "📚 We have courses in programming, business, design, and more. Visit the courses page!",
      "how to login": "🔐 You can login at /login using email or Google account.",
      "go to dashboard": "📊 Taking you to dashboard...",
      "go to courses": "📚 Navigating to courses page...",
      "go to home": "🏠 Going to homepage...",
      "help": "I can help you navigate, answer questions, or explain platform features.",
      "thank you": "You're welcome! 😊",
      "bye": "Goodbye! Come back anytime. 👋"
    };
    
    const lowerMsg = message.toLowerCase();
    let response = "I understand. How can I assist you?";
    
    // Find matching response
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMsg.includes(key)) {
        response = value;
        break;
      }
    }
    
    return NextResponse.json({ 
      response,
      success: true,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("API Error:", error);
    
    return NextResponse.json({ 
      response: "I'm here to help! What would you like to know?",
      error: error.message,
      success: false
    });
  }
}