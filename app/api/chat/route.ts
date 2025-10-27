import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";

export const maxDuration = 30;
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // Log API key status (without exposing the actual key)
    const apiKey = process.env.OPENAI_API_KEY;
    console.log("🔑 API Key Status:", {
      exists: !!apiKey,
      length: apiKey ? apiKey.length : 0,
      startsWith: apiKey ? apiKey.substring(0, 8) + "..." : "N/A",
    });

    if (!apiKey) {
      console.error("❌ OPENAI_API_KEY is not set in environment variables");
      return new Response("OpenAI API key not configured", { status: 500 });
    }

    const { messages, action, content, context } = await req.json();
    console.log("📝 Request received:", {
      action,
      hasContent: !!content,
      context,
      messageCount: messages?.length || 0,
    });

    let systemPrompt =
      "You are a helpful AI writing assistant. Help users improve their content with clear, concise, and engaging text.";

    // Customize system prompt based on action
    switch (action) {
      case "improve":
        systemPrompt =
          "You are a professional editor. Improve the writing quality, clarity, and flow of the provided text while maintaining the original meaning and tone.";
        break;
      case "summarize":
        systemPrompt =
          "You are a skilled summarizer. Create a clear, concise summary of the provided content, capturing the key points and main ideas.";
        break;
      case "expand":
        systemPrompt =
          "You are a content expander. Take the provided text and expand on it with additional details, examples, and insights while maintaining coherence.";
        break;
      case "shorten":
        systemPrompt =
          "You are a concise writer. Make the provided text shorter and more direct while preserving all essential information and meaning.";
        break;
      case "fix-grammar":
        systemPrompt =
          "You are a grammar and spelling expert. Fix any grammatical errors, spelling mistakes, and improve sentence structure in the provided text.";
        break;
      case "translate":
        systemPrompt = `You are a professional translator. Translate the provided text to ${context?.language || "English"} while maintaining the original tone and meaning.`;
        break;
      case "tone":
        systemPrompt = `You are a tone adjuster. Modify the tone of the provided text to be more ${context?.tone || "professional"} while keeping the same content and meaning.`;
        break;
      case "continue":
        systemPrompt =
          "You are a creative writer. Continue the provided text naturally, maintaining the same style, tone, and context.";
        break;
    }

    console.log("🤖 Starting AI stream with system prompt:", `${systemPrompt.substring(0, 100)}...`);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages: convertToModelMessages([...messages, ...(content ? [{ role: "user" as const, content }] : [])]),
      temperature: 0.7,
      onFinish: (result) => {
        console.log("🏁 AI Stream Finished:", {
          finishReason: result.finishReason,
          usage: result.usage,
          text: `${result.text?.substring(0, 100)}...`,
        });
      },
    });

    console.log("✅ Stream created successfully, returning response");
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("❌ AI API Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return new Response("Internal Server Error", { status: 500 });
  }
}
