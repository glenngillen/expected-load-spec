# Expected Load

**An open, vendor-neutral convention for declaring expected runtime load in source code.**

Usage-based costs and capacity needs can't be read from code structure alone —
they depend on *how often* something runs and *how much* it processes. Today
those numbers live in spreadsheets, tickets, and out-of-band config that drift
from the code. **Expected Load** puts them in a comment next to the code, in one
uniform shape across every language, so any tool can read them.

```ts
/**
 * @expected-load
 *   monthly_calls: 100_000
 *   avg_input_tokens: 1_200
 *   avg_output_tokens: 400
 */
export async function summarise(text: string) { /* ... */ }
```

```hcl
# expected-load:
#   monthly_requests: 5_000_000
#   request_duration_ms: 40
resource "example_function" "api" {
  # ...
}
```

A declaration is just a comment, so it costs nothing at runtime and needs no
new files, schema, or build step. A cost estimator, a capacity planner, a CI
check, or an editor can read it without parsing the host language.

## Why inline?

- **Versioned & reviewed.** The numbers travel with the code, in the same pull
  request, with the same history.
- **Discoverable.** They sit where the relevant code is — not in a parallel
  file someone forgets to update.
- **Tool-agnostic.** A single grammar across languages means one parser serves
  every codebase. No vendor lock-in, no proprietary format.
- **Low-friction.** One comment. No dependency, no annotation library, no
  runtime cost.

## The shape, in brief

- A **marker** — `expected-load` (or `@expected-load`), case-insensitive —
  introduces a declaration.
- **Block form** puts each field on its own line; **inline form** puts them on
  one line. Both are equivalent.
- **Keys** are normalized to `snake_case`, so `monthly-requests`,
  `monthlyRequests`, and `monthly_requests` are the same field.
- **Values** are integers; `_` and `,` are allowed as digit separators
  (`5_000_000`).
- Optional **meta** fields record `confidence`, `source`, and `last_updated`.

The full normative reference is in **[SPEC.md](./SPEC.md)**.

## Supported languages (v1)

HCL/Terraform · TypeScript/JavaScript · Python · Go · Java/Kotlin · Rust · YAML
and other `#`-comment formats. See [`examples/`](./examples) for one file per
language plus framework scenarios.

## Field vocabulary

The core vocabulary is small and open. Common fields:

| Field | Meaning |
| --- | --- |
| `monthly_requests` | Invocations per month |
| `request_duration_ms` | Average request duration (ms) |
| `storage_gb` | Average data at rest (GB) |
| `monthly_data_processed_gb` | Data processed per month (GB) |
| `monthly_calls` | Model/API calls per month |
| `avg_input_tokens` / `avg_output_tokens` | Average tokens per call |
| `requests_per_active_minute` | Request rate while active (burstiness) |

Consumers may define additional fields and must tolerate fields they don't
recognize. See [SPEC.md §10](./SPEC.md#10-field-vocabulary-v1).

## Implementing

- **Producers** (write declarations): follow [§3–§6](./SPEC.md). Prefer block
  form and canonical `snake_case`.
- **Consumers** (read declarations): follow the [processing model](./SPEC.md#7-processing-model-consumers).
  Strip the host comment framing, find the marker, normalize keys, parse
  integer values, preserve unknown fields, and report malformed ones.

## Website

A static site for the specification lives in [`site/`](./site) — open
`site/index.html` directly, or deploy the folder to any static host.

## License

The specification and this repository are licensed under
[Creative Commons Attribution 4.0 International (CC BY 4.0)](./LICENSE). You are
free to share and adapt the material, including commercially, with attribution.
Example code is provided as public-domain reference material.
