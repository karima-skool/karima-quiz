import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log("[recommend-api] ANTHROPIC_API_KEY present:", !!apiKey);
    console.log("[recommend-api] key prefix:", apiKey ? apiKey.slice(0, 12) : "MISSING");

    if (!apiKey) {
      console.error("[recommend-api] No API key found in environment");
      return NextResponse.json({ reasons: {} });
    }

    const client = new Anthropic({ apiKey });

    const { answers, candidates } = await req.json();

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({ reasons: {} });
    }

    const courseList = candidates
      .map(
        (c: { id: string; title: string; short_description: string; topic_tags: string[] }) =>
          `- ID: ${c.id} | Title: ${c.title} | Description: ${c.short_description} | Tags: ${c.topic_tags.join(", ")}`
      )
      .join("\n");

    const prompt = `You are a knowledgeable and warm Islamic education advisor helping a Muslim learner find the right course.

Here is what you know about this learner:
- Prior learning: ${answers.q1 || "Not specified"}
- Goal: ${answers.q2 || "Not specified"}
- Interests: ${answers.q3?.join(", ") || "Not specified"}
- Life stage: ${answers.q4 || "Not specified"}
- Time available per week: ${answers.q5 || "Not specified"}
- Preferred format: ${answers.q6?.join(", ") || "Not specified"}
- In their own words, what they want to learn: ${answers.q7 || "Not specified"}
- What they find difficult: ${answers.q8 || "Not specified"}

Here are the courses recommended for them:
${courseList}

For each course, write a single sentence (max 20 words) explaining specifically why it suits THIS learner based on their answers. Be warm, specific, and encouraging. Do not be generic.

Respond ONLY with a valid JSON object where each key is the course ID and the value is the reason string. No preamble, no markdown, no explanation. Example format:
{"KA-001": "reason here", "KA-002": "reason here"}`;

    console.log("[recommend-api] calling Anthropic with", candidates.length, "candidates");

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    console.log("[recommend-api] response received, stop_reason:", message.stop_reason);

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    console.log("[recommend-api] raw response:", text);

    const reasons = JSON.parse(text);
    console.log("[recommend-api] parsed reasons:", JSON.stringify(reasons));

    return NextResponse.json({ reasons });
  } catch (err) {
    console.error("[recommend-api] error:", err);
    return NextResponse.json({ reasons: {} });
  }
}
