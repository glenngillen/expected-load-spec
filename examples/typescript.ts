// Expected Load — TypeScript / JavaScript examples.

/**
 * Summarise a document with a language model.
 *
 * @expected-load
 *   monthly_calls: 100_000
 *   avg_input_tokens: 1_200
 *   avg_output_tokens: 400
 *   confidence: medium
 *   source: estimated
 */
export async function summarise(text: string): Promise<string> {
  // ...call the model...
  return text.slice(0, 280);
}

/**
 * A multi-turn assistant. Burstiness matters here, so the request rate while
 * active is declared alongside the monthly total.
 *
 * @expected-load
 *   monthly_calls: 2_000_000
 *   avg_input_tokens: 800
 *   avg_output_tokens: 300
 *   avg_conversation_turns: 6
 *   requests_per_active_minute: 120
 */
export async function chat(message: string): Promise<string> {
  return message;
}

// Inline `//` form — the documented fallback when a JSDoc block isn't wanted.
// @expected-load: monthly_requests=5_000_000 request_duration_ms=25
export function handler(req: Request): Response {
  return new Response("ok");
}
