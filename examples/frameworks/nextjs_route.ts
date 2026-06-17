// Expected Load — Next.js Route Handler (framework scenario).
// app/api/chat/route.ts

/**
 * Streaming chat endpoint. The handler itself is the priced unit: every POST
 * is one model call, so request volume and token averages live together.
 *
 * @expected-load
 *   monthly_calls: 1_500_000
 *   avg_input_tokens: 900
 *   avg_output_tokens: 350
 *   requests_per_active_minute: 200
 *   confidence: high
 *   source: observed
 *   last_updated: 2026-03-10
 */
export async function POST(request: Request): Promise<Response> {
  const { message } = await request.json();
  return new Response(`echo: ${message}`);
}
