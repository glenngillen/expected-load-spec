# Expected Load — serverless function + queue (framework scenario, Terraform).

# The function is invoked once per queue message. request_duration_ms drives the
# compute portion of the bill; monthly_requests drives the invocation portion.
# expected-load:
#   monthly_requests: 12_000_000
#   request_duration_ms: 180
#   confidence: medium
#   source: estimated
#   last_updated: 2026-01-20
resource "example_function" "worker" {
  name   = "worker"
  memory = 512
}

# The queue in front of it processes the same volume.
# expected-load monthly_requests=12_000_000
resource "example_queue" "jobs" {
  name = "jobs"
}
