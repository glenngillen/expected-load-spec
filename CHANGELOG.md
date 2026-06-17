# Changelog

All notable changes to the Expected Load Specification are recorded here. The
specification uses `MAJOR.MINOR` versioning: adding fields or comment framings
is a minor change; removing or redefining a field, or changing the grammar
incompatibly, is a major change.

## 1.0 — Initial release

The first stable version of the specification.

- **Marker** — `expected-load` / `@expected-load`, case- and
  separator-insensitive (`-`, `_`, or space), optional leading `@` and trailing
  colon.
- **Two forms** — block form (one field per line) and inline form (fields on
  one line), fully interchangeable.
- **Host comment syntaxes** — HCL/Terraform, TypeScript/JavaScript (JSDoc or
  `//`), Python (`#` or docstring), Go (`//`), Java/Kotlin (Javadoc/KDoc), Rust
  (`///`/`//!`), and generic `#`-comment formats such as YAML.
- **Keys** — normalized to canonical `snake_case` from kebab-case, camelCase,
  dotted, and spaced spellings.
- **Values** — non-negative integers with optional `_`/`,` digit separators.
- **Meta fields** — `version`, `confidence` (`low`/`medium`/`high`), `source`
  (`manual`/`observed`/`estimated`), `last_updated` (ISO 8601 date).
- **Core field vocabulary** — a shared timing field
  (`requests_per_active_minute`); a service/infrastructure profile
  (`monthly_requests`, `request_duration_ms`, `storage_gb`,
  `monthly_data_processed_gb`); and a token/model profile (`monthly_calls`,
  `avg_input_tokens`, `avg_output_tokens`, `avg_conversation_turns`). The
  vocabulary is open and extensible.
- **Processing model & diagnostics** — defined for consumers, including
  preservation of unknown fields and graceful handling of malformed values.
