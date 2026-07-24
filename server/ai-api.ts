/**
 * SubSight AI Financial Assistant — API server
 *
 * Runs alongside Vite dev server (port 3001 in dev, spawned by serve.ts in prod).
 * Proxied at /api/ai from the main Vite/Bun server.
 *
 * Uses OpenAI GPT-4o with function calling to answer user questions about
 * their subscription data.
 */

import OpenAI from "openai";

const PORT = 3001;
const HOST = "0.0.0.0";

// ── OpenAI function definitions ──────────────────────────────────────

const FUNCTIONS = [
  {
    name: "getMonthlyTotal",
    description: "Get the total monthly spending across all active subscriptions, including count and formatted amount.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "getYearlyTotal",
    description: "Get the total yearly spending equivalent across all active subscriptions.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "getActiveSubscriptions",
    description: "Get the list of all active subscriptions with their details: merchant, monthly amount, yearly equivalent, category, renewal frequency, next payment date.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "getSpendingByCategory",
    description: "Get spending breakdown by category with percentages and counts for each category.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "getBiggestIncrease",
    description: "Find subscriptions that had significant price increases (≥10%). Returns the increased subscriptions and a summary.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "getUpcomingCharges",
    description: "Get upcoming charges due within the next few days with amounts and dates, plus the total.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "getDuplicateServices",
    description: "Detect overlapping subscription services (e.g., multiple music streaming, multiple AI tools) and calculate the potential waste.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "getSavingsSuggestions",
    description: "Calculate potential savings by cancelling duplicates, switching to annual billing, and reviewing unused subscriptions.",
    parameters: { type: "object", properties: {} },
  },
];

const SYSTEM_PROMPT = `You are SubSight's AI financial assistant. You help users understand their subscription spending.
Only use the provided subscription data to answer questions. Be concise and helpful.
Format all currency amounts in euros (€). Use the functions available to you to look up the data.
After calling functions, synthesize the results into a clear, natural answer.
When discussing savings, be encouraging and actionable.
If a user asks something you don't have data for, politely explain what you can help with instead.`;

// ── CORS headers ─────────────────────────────────────────────────────

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// ── Main handler ─────────────────────────────────────────────────────

async function handleChat(req: Request): Promise<Response> {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        reply: "AI assistant is being configured — check back soon.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      },
    );
  }

  let body: { message?: string; history?: Array<{ role: string; content: string }> };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const message = body.message?.trim();
  if (!message) {
    return new Response(JSON.stringify({ error: "Message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  // Dynamically import ai-functions to avoid bundling issues
  const { callFunction } = await import("../src/lib/ai-functions.ts");

  const openai = new OpenAI({ apiKey });

  // Build conversation messages
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...(body.history ?? []).map(
      (m): OpenAI.Chat.Completions.ChatCompletionMessageParam => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }),
    ),
    { role: "user", content: message },
  ];

  try {
    let iteration = 0;
    const MAX_ITERATIONS = 5; // Prevent infinite loops

    while (iteration < MAX_ITERATIONS) {
      iteration++;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        functions: FUNCTIONS as any,
        function_call: "auto",
        temperature: 0.3,
      });

      const choice = response.choices[0];
      if (!choice) {
        return new Response(
          JSON.stringify({ reply: "I couldn't process that — please try again." }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
        );
      }

      // If the AI wants to call a function
      if (choice.finish_reason === "function_call" || choice.message.function_call) {
        const fnCall = choice.message.function_call;
        if (!fnCall) break;

        const fnName = fnCall.name;
        const fnResult = callFunction(fnName);

        // Append the function call and result to messages
        messages.push({
          role: "assistant",
          content: null,
          function_call: { name: fnName, arguments: fnCall.arguments },
        } as any);
        messages.push({
          role: "function",
          content: JSON.stringify(fnResult),
          name: fnName,
        } as any);

        continue;
      }

      // Final text response
      const reply = choice.message.content ?? "I processed your request, but I don't have a text response.";
      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    // Fallback if max iterations reached
    return new Response(
      JSON.stringify({ reply: "I went through a lot of data — could you ask a more specific question?" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  } catch (err: any) {
    console.error("AI API error:", err);
    return new Response(
      JSON.stringify({
        reply: "Sorry, I encountered an error while processing your request. Please try again.",
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }
}

// ── Start server ─────────────────────────────────────────────────────

// Free port first (production scenario — dev doesn't clash)
const freeCmd = `lsof -t -iTCP:${PORT} -sTCP:LISTEN 2>/dev/null | xargs -r kill 2>/dev/null; true`;
await Bun.$`sh -c ${freeCmd}`.quiet().nothrow();

Bun.serve({
  port: PORT,
  hostname: HOST,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/api/ai/chat") {
      return handleChat(req);
    }
    if (url.pathname === "/api/ai/health") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`AI API server listening on http://${HOST}:${PORT}`);
