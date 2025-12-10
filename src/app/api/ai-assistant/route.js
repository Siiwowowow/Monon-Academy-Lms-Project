// src/app/api/ai-assistant/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt with website knowledge
const SYSTEM_PROMPT = `You are an AI assistant for Monon Academy e-learning platform.

WEBSITE KNOWLEDGE:
1. Pages:
   - Home: / (Landing page with featured courses)
   - Courses: /courses (Browse all courses by subject/class/group)
   - Teachers: /teachers (Instructor profiles)
   - Login: /login (Authentication)
   - Sign Up: /signUp (Registration)
   - Dashboard: /dashboard (Role-based: admin, teacher, student, user)
   - Video Player: /video (YouTube integration)
   - Community: /community
   - Contact: /contact

2. Features:
   - Course enrollment system
   - Exam creation and taking
   - Video lessons
   - Stripe payment integration
   - Firebase authentication
   - User roles: admin, teacher, student, user

3. Navigation Help:
   - Guide users to specific pages when asked
   - Explain platform features
   - Provide troubleshooting help

4. Response Guidelines:
   - Be helpful and concise
   - Mention exact paths for navigation (/courses, /dashboard, etc.)
   - Consider user role in responses
   - If unsure, suggest contacting support
   - Keep responses conversational`;

export async function POST(request) {
  try {
    const { query, role, context } = await request.json();

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: `Current user role: ${role || 'guest'}. Context: ${context}` },
      { role: 'user', content: query }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 250,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 
      "I'm here to help you navigate Monon Academy. What would you like to know?";

    return NextResponse.json({ response });
    
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Fallback responses
    const fallbacks = [
      "I can help you with course enrollment, navigation, and platform features.",
      "Try asking: 'How do I enroll?' or 'Take me to the courses page'",
      "I'm trained on Monon Academy. Ask me about any feature!",
      "For navigation help, try: 'Go to dashboard' or 'Show me courses'"
    ];
    
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    
    return NextResponse.json({ 
      response: randomFallback,
      error: error.message 
    });
  }
}