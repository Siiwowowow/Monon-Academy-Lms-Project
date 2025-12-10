import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ text: "Please ask a question." }, { status: 400 });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a smart assistant who knows everything about this website. Answer clearly and guide users to components/pages if needed."
          },
          { role: "user", content: question },
        ],
        max_tokens: 400,
      }),
    });

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content || "Sorry, I couldn't understand your question.";

    // Optional: redirect to page if user asks about a page
    let route = null;
    const q = question.toLowerCase();
    if (q.includes("courses")) route = "/courses";
    if (q.includes("home")) route = "/";

    return NextResponse.json({ text: answer, route });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ text: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
