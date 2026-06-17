// Expected Load — Go examples.
package service

import "net/http"

// APIHandler serves the public API.
//
// expected-load:
//   monthly_requests: 5_000_000
//   request_duration_ms: 40
//   confidence: high
//   source: observed
func APIHandler(w http.ResponseWriter, r *http.Request) {
	_, _ = w.Write([]byte("ok"))
}

// Inline form using the no-space "//directive" convention.
//
//expected-load: monthly_requests=250_000 request_duration_ms=120
func ReportHandler(w http.ResponseWriter, r *http.Request) {
	_, _ = w.Write([]byte("report"))
}

// A token workload.
//
// expected-load:
//   monthly_calls: 80_000
//   avg_input_tokens: 2_000
//   avg_output_tokens: 600
func Summarise(text string) string {
	return text
}
