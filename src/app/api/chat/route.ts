import Anthropic from "@anthropic-ai/sdk";
import { systemPrompt } from "@/lib/system-prompt";

// Demo responses for when API key is not configured
const demoResponses: Record<string, string> = {
  default: `Hey! I'm the demo version of Rafa's portfolio assistant. To get the full AI-powered experience, you'll need to add an Anthropic API key.

Here's what I can tell you about Rafa:
- 15+ years of design experience
- Worked at Google, Pentagram, Droga5, and more
- Specializes in identity, art direction, and systems design

Check out some highlighted work:

[PROJECT:google-pixel]

[PROJECT:aesop]

To enable the real AI chat, create a \`.env.local\` file with your API key!`,

  work: `Rafa has worked on some amazing projects! Here are a few highlights:

[PROJECT:google-pixel]
A visual system for Google Pixel's social media presence.

[PROJECT:aesop]
Visual installations for Aesop's global retail platform.

[PROJECT:toyota]
Digital platform experience for Toyota.

These showcase his range from tech to luxury brands. Want to learn more about any specific project?`,

  contact: `Great to hear you're interested in working with Rafa!

Best ways to reach out:
- Email: hello@rafacastello.com
- LinkedIn: /in/rafacastello
- Instagram: @rafacastello

Or check out the full portfolio at rafacastello.com`,

  services: `Rafa offers several design services:

1. **Identity Design** - Brand systems and visual identity
2. **Product Design** - Digital products and experiences
3. **Story Development** - Narrative and content strategy
4. **Object Design** - Physical product design
5. **Systems Design** - Design systems and guidelines

He's worked with clients like Google, Aesop, Toyota, Pepsi, and many more Fortune 500 brands.`,
};

function getDemoResponse(userMessage: string): string {
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes("work") || lowerMsg.includes("project") || lowerMsg.includes("portfolio")) {
    return demoResponses.work;
  }
  if (lowerMsg.includes("contact") || lowerMsg.includes("hire") || lowerMsg.includes("work with")) {
    return demoResponses.contact;
  }
  if (lowerMsg.includes("service") || lowerMsg.includes("offer") || lowerMsg.includes("do")) {
    return demoResponses.services;
  }

  return demoResponses.default;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    // Demo mode when API key is not configured
    if (!process.env.ANTHROPIC_API_KEY) {
      const demoResponse = getDemoResponse(lastMessage);
      const encoder = new TextEncoder();

      // Simulate streaming with demo response
      const readable = new ReadableStream({
        async start(controller) {
          // Stream character by character with small delays for effect
          for (const char of demoResponse) {
            controller.enqueue(encoder.encode(char));
            await new Promise((resolve) => setTimeout(resolve, 10));
          }
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // Real Claude API mode
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      error instanceof Error ? error.message : "Internal server error",
      { status: 500 }
    );
  }
}
