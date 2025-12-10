// src/app/api/ai-assistant/enhanced/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enhanced system prompt with learning focus
const ENHANCED_SYSTEM_PROMPT = `You are Monon AI, an intelligent learning assistant for Monon Academy e-learning platform.

YOUR CAPABILITIES:
1. LEARNING ASSISTANT:
   - Provide personalized study tips and strategies
   - Suggest courses based on user interests and goals
   - Help with time management and productivity
   - Offer exam preparation guidance
   - Support career path decisions

2. PLATFORM EXPERT:
   - Know all features of Monon Academy
   - Guide users through navigation
   - Explain course enrollment process
   - Help with technical issues
   - Suggest platform optimizations

3. PERSONALIZED ADVISOR:
   - Adapt to user's role (admin, teacher, student, user)
   - Consider learning preferences
   - Provide motivational support
   - Track progress and suggest improvements
   - Offer career guidance

4. SMART RESPONSE GUIDELINES:
   - Be empathetic and encouraging
   - Provide actionable advice
   - Ask clarifying questions when needed
   - Suggest next steps
   - Include relevant emojis for engagement
   - Keep responses concise but helpful
   - Provide 2-3 follow-up suggestion questions

PLATFORM KNOWLEDGE:
- Pages: /, /courses, /dashboard, /video, /teachers, /login, /signUp, /community, /contact
- Features: Course enrollment, video lessons, exams, progress tracking, community, payments
- User Roles: Admin, Teacher, Student, User with different permissions

RESPONSE FORMAT:
{
  "text": "Your response here",
  "type": "response_type",
  "suggestions": ["Follow-up question 1", "Follow-up question 2", "Follow-up question 3"]
}`;

export async function POST(request) {
  try {
    const { query, role, history, preferences, context, platform } = await request.json();

    // Prepare conversation context
    const messages = [
      { role: 'system', content: ENHANCED_SYSTEM_PROMPT },
      { 
        role: 'system', 
        content: `User Profile:
        - Role: ${role || 'guest'}
        - Preferences: ${JSON.stringify(preferences || {})}
        - Context: ${context || 'general'}
        - Platform: ${platform || 'monon_academy'}
        - Current Focus: Learning assistance and platform guidance`
      }
    ];

    // Add conversation history if available
    if (history && history.length > 0) {
      const recentHistory = history.slice(-5); // Last 5 exchanges
      recentHistory.forEach(item => {
        messages.push({
          role: item.role === 'user' ? 'user' : 'assistant',
          content: item.content
        });
      });
    }

    // Add current query
    messages.push({ role: 'user', content: query });

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Use GPT-4 for better responses
      messages,
      max_tokens: 500,
      temperature: 0.8,
      presence_penalty: 0.6,
      frequency_penalty: 0.5
    });

    const aiResponse = completion.choices[0]?.message?.content;

    // Parse response for structured format
    const response = parseAIResponse(aiResponse, query);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Enhanced AI Error:', error);
    
    // Enhanced fallback response
    return NextResponse.json({
      text: `I'm here to support your learning journey! As your Monon Academy assistant, I can help you with:\n\n🎯 Course selection and learning paths\n📚 Study techniques and time management\n📊 Progress tracking and goal setting\n💡 Personalized recommendations\n\nWhat would you like to focus on today?`,
      type: "assistance_offer",
      suggestions: [
        "Help me choose a course",
        "Suggest study techniques",
        "Track my progress",
        "Career guidance"
      ]
    });
  }
}

// Parse AI response into structured format
function parseAIResponse(aiText, originalQuery) {
  // Extract suggestions from response
  const suggestionPatterns = [
    /Would you like to (.*?)\?/i,
    /How about (.*?)\?/i,
    /Maybe you'd like to (.*?)\?/i,
    /Consider (.*?)\?/i,
    /You could (.*?)\?/i
  ];

  let suggestions = [];
  
  // Generate relevant follow-up questions
  const lowerQuery = originalQuery.toLowerCase();
  
  if (lowerQuery.includes('course') || lowerQuery.includes('learn')) {
    suggestions = [
      "Which course matches my skill level?",
      "How long will it take to complete?",
      "What are the career opportunities?"
    ];
  } else if (lowerQuery.includes('study') || lowerQuery.includes('tip')) {
    suggestions = [
      "More study techniques",
      "Time management strategies",
      "Motivation tips"
    ];
  } else if (lowerQuery.includes('progress') || lowerQuery.includes('track')) {
    suggestions = [
      "Set learning goals",
      "Review completed work",
      "Get improvement suggestions"
    ];
  } else {
    suggestions = [
      "Tell me more about that",
      "How can I apply this?",
      "What's the next step?"
    ];
  }

  // Determine response type
  let type = "ai_response";
  if (aiText.includes('tip') || aiText.includes('advice')) type = "learning_tips";
  if (aiText.includes('course') || aiText.includes('recommend')) type = "recommendation";
  if (aiText.includes('progress') || aiText.includes('track')) type = "progress_update";
  if (aiText.includes('help') || aiText.includes('support')) type = "assistance";

  return {
    text: aiText,
    type,
    suggestions: suggestions.slice(0, 3)
  };
}