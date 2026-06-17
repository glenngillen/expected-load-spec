# Expected Load — HCL / Terraform examples.
# The marker is embedded in `#` line comments immediately above the resource.

# Block form: one field per line, ending at the resource block.
# expected-load:
#   monthly_requests: 5_000_000
#   request_duration_ms: 40
#   confidence: high
#   source: observed
#   last_updated: 2026-01-15
resource "example_function" "api" {
  name = "api"
}

# Inline form: all fields on one line.
# expected-load monthly_data_processed_gb=2_000 storage_gb=500
resource "example_object_store" "assets" {
  name = "assets"
}

# A declaration may sit inside a larger comment. The field list ends at the
# first blank line after the fields, so the prose below is not parsed as load.
#
# expected-load:
#   monthly_requests: 250_000
#
# This bucket fronts the marketing site; traffic is seasonal and spikes during
# launches — see the capacity notes in docs/launch-runbook.md.
resource "example_cdn" "site" {
  name = "site"
}
