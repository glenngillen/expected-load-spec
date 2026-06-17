// Expected Load — Rust examples (`///` outer doc comments).

/// Summarise a document with a language model.
///
/// expected-load:
///   monthly_calls: 100_000
///   avg_input_tokens: 1_200
///   avg_output_tokens: 400
pub fn summarise(text: &str) -> String {
    text.chars().take(280).collect()
}

/// Public API handler.
///
/// expected-load:
///   monthly_requests: 5_000_000
///   request_duration_ms: 40
pub fn handle() {
    // ...
}

// Inline form also works with a plain `//` comment:
// expected-load: monthly_requests=250_000 request_duration_ms=120
pub fn report() {}
