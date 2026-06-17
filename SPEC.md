# Expected Load Specification

**Version:** 1.0
**Status:** Stable
**License:** [CC BY 4.0](./LICENSE)

A vendor-neutral convention for declaring the **expected runtime load** of a unit
of code or infrastructure — request volume, traffic rate, token usage, stored
data, and similar quantities — directly in source, as a structured comment.

---

## Abstract

Many costs and capacity requirements cannot be derived from source code alone.
A function that calls a paid API, a queue consumer, or an infrastructure
resource has a price that depends on *how often it runs* and *how much it
processes* — facts that live in a developer's head, a spreadsheet, a ticket, or
a separate configuration file, and drift from the code over time.

The Expected Load Specification defines a small, language-agnostic grammar for
writing those expectations as a comment **next to the code they describe**, so
they are versioned, reviewed, and discoverable alongside everything else. Any
tool — a cost estimator, a capacity planner, a CI check, an editor — can read a
declaration without understanding the host language's semantics, because the
declaration lives in a comment with a single, uniform shape across languages.

This document is the normative reference for producers (humans and tools that
*write* declarations) and consumers (tools that *read* them).

## Status of this document

This is version 1.0 of the specification. It is a living document; backwards-
incompatible changes increment the major version. See
[CHANGELOG.md](./CHANGELOG.md).

## 1. Conformance and terminology

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHOULD**, **SHOULD NOT**,
**MAY**, and **OPTIONAL** in this document are to be interpreted as described in
[RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) and
[RFC 8174](https://www.rfc-editor.org/rfc/rfc8174) when, and only when, they
appear in all capitals.

- A **declaration** is a single expected-load block.
- A **field** is one `key: value` entry within a declaration.
- A **producer** is anything that writes a declaration (a developer, an IDE
  action, an agent, a code generator).
- A **consumer** is anything that reads a declaration (a cost or capacity tool,
  a linter, a dashboard).
- The **subject** is the code element a declaration describes (a function, a
  resource block, a class, a handler, …).

## 2. Placement and association

A declaration appears inside a comment. The comment is associated with a
subject by **proximity**: a declaration applies to the code element it
immediately precedes (or, where idiomatic, the element it documents).

- A producer **SHOULD** place a declaration in the comment that immediately
  precedes its subject, with no blank line between the comment and the subject.
- A consumer **MUST** define and document how it resolves a declaration to a
  subject (for example, "the next statement," "the following resource block,"
  or "the documented declaration"). This specification does not mandate a
  single association rule, because the notion of "the next code element" is
  language-specific.
- A source file **MAY** contain any number of declarations.

The grammar of a declaration is identical regardless of placement; only the
surrounding comment framing differs by language (§4).

## 3. The two forms

A declaration has a **marker** followed by one or more fields, written in one
of two interchangeable forms.

### 3.1 Block form (recommended)

The marker sits on its own line; each field is on its own subsequent line,
conventionally indented:

```
expected-load:
  monthly_requests: 5_000_000
  request_duration_ms: 40
```

The field list ends at the first blank line (once at least one field has been
read) or the first line that is not a field. This lets a declaration sit inside
a larger comment without consuming unrelated prose.

### 3.2 Inline form

The marker and all fields are on a single line, space-separated:

```
expected-load monthly_requests=5_000_000 request_duration_ms=40
```

The inline form is convenient for single-line comments and for subjects whose
load is described by one or two fields.

A producer **MAY** use either form. A consumer **MUST** accept both.

## 4. The marker

The marker introduces a declaration. It is **case-insensitive** and matches the
word `expected`, a single separator (`-`, `_`, or a space), then the word
`load`, with an optional leading `@` and an optional trailing colon.

All of the following are valid, equivalent markers:

```
expected-load        expected_load        expected load
@expected-load       Expected-Load        EXPECTED LOAD:
```

A producer **SHOULD** write `expected-load` (or `@expected-load` in doc-comment
grammars that key on `@tags`, such as JSDoc/KDoc).

A comment that does not contain a marker is not a declaration. Its absence
**MUST NOT** be treated as an error (§7).

## 5. Host comment syntaxes

A declaration is embedded in the host language's native comment. A consumer
strips the comment framing, then parses the inner text with the uniform grammar
in §3, §6. The following framings are normative for v1; a consumer **MAY**
support additional comment styles using the same approach.

| Language family | Comment framing | Example marker line |
| --- | --- | --- |
| HCL / Terraform | `#` line comments | `# expected-load:` |
| YAML and other `#`-comment formats | `#` line comments | `# expected-load:` |
| TypeScript / JavaScript | JSDoc block `/** … */` with `*` continuation, **or** `//` | ` * @expected-load` |
| Python | `#` line comments, **or** a docstring block | `# expected-load:` |
| Go | `//` line comments (including the no-space `//directive` form) | `// expected-load:` |
| Java / Kotlin | Javadoc / KDoc block `/** … */` | ` * @expected-load` |
| Rust | `///` (outer) or `//!` (inner) doc comments, fallback `//` | `/// expected-load:` |

**Framing rules**

- For line-comment languages, the leading comment token (`#`, `//`, `///`,
  `//!`) is removed from each line before parsing.
- For block-comment (JSDoc/KDoc) languages, the `/**`, `/*`, and `*/`
  delimiters and a single leading `*` continuation marker per line are removed.
- For Python docstrings, lines that are not `#` comments are passed through
  unchanged, so a `Expected load:` block inside a `"""…"""` docstring is parsed
  the same way as a `#`-comment block.

Because framing is stripped first, the field grammar (§6) is identical in every
language.

## 6. Fields

After framing is stripped, a declaration is a marker plus a set of fields. A
field is a `key`, a separator, and a `value`.

### 6.1 Separators

The separator between a key and its value is either a colon (`:`) or an equals
sign (`=`). Both are equivalent. Block form conventionally uses `:`; inline
form conventionally uses `=`.

### 6.2 Keys and normalization

Keys are **case-insensitive** and **separator-insensitive**. A consumer **MUST**
normalize every key to canonical `snake_case` before interpreting it, by:

1. lowercasing;
2. replacing `-`, `.`, and spaces with `_`;
3. inserting `_` at a lower→upper case boundary (so `camelCase` splits);
4. collapsing repeated `_` and trimming leading/trailing `_`.

As a result these are all the same field:

```
monthly_requests   monthly-requests   monthlyRequests   "Monthly Requests"
```

A producer **SHOULD** write canonical `snake_case`.

### 6.3 Values

Load field values are **non-negative integers**. For readability, a value
**MAY** contain `_` or `,` as digit-group separators; a consumer **MUST** ignore
them. A leading `+` is permitted.

```
5_000_000   5,000,000   5000000     ; all equal to 5000000
```

Decimal/fractional values are **not** part of v1. A field whose value is not an
integer is malformed (§7). Where a fractional quantity is needed, define a
field in a smaller unit (for example `request_duration_ms` rather than seconds).

## 7. Processing model (consumers)

A conforming consumer processes a comment as follows:

1. **Find the marker.** Scan the (framing-stripped) comment for a marker (§4).
   If none is present, the comment is not a declaration; return nothing. This
   is **not** an error.
2. **Collect fields** from the marker's inline remainder (inline form) and the
   following field lines (block form), per §3.
3. **Normalize each key** to canonical `snake_case` (§6.2).
4. **Interpret meta fields** (§8) and **parse load values** as integers (§6.3).
5. **Preserve unknown fields.** A consumer **MUST NOT** discard a field it does
   not recognize solely because it is unknown; it **MUST** make the value
   available (an unknown field is simply one this consumer has no model for).
   A consumer **MAY** emit a diagnostic for an unknown field (§9).
6. **Handle malformed fields** without aborting the whole declaration: a field
   with a non-integer value where an integer is required **MUST** be reported
   as an error (§9) and **MUST** be omitted from the parsed result; other valid
   fields in the same declaration are still returned.

A declaration with a marker but zero valid fields is still a declaration (it
carries only its defaults / meta fields).

## 8. Meta fields

Four reserved fields describe the declaration itself rather than a load
quantity. They are normalized like any other key (§6.2).

| Field | Type | Default | Meaning |
| --- | --- | --- | --- |
| `version` | integer | `1` | The specification major version this declaration targets. |
| `confidence` | enum | *(unset)* | How sure the author is of the numbers: `low`, `medium`, or `high`. |
| `source` | enum | *(unset)* | Where the numbers came from: `manual`, `observed`, or `estimated`. |
| `last_updated` | date | *(unset)* | When the numbers were last reviewed. **SHOULD** be an ISO 8601 date (`YYYY-MM-DD`). |

- An out-of-range `confidence` or `source` value **MUST** be reported as a
  diagnostic and the field left unset; it **MUST NOT** abort the declaration.
- `version` is advisory metadata for consumers; this version of the
  specification does not change behavior based on it.

## 9. Diagnostics (recommended)

Producers and editors benefit from feedback. A consumer that surfaces
diagnostics **SHOULD** use these categories:

- **Unknown field** — a load field the consumer has no model for. When the key
  is within a small edit distance of a field the consumer *does* recognize, the
  diagnostic **SHOULD** suggest the nearest match
  (`unknown field "monthy_requests" — did you mean "monthly_requests"?`).
- **Malformed value** — a value that is not a valid integer where one is
  required. This is an **error**; the field is omitted.
- **Invalid meta value** — a `confidence`/`source` outside its enumeration.
  This is a **warning**; the meta field is left unset.

The absence of a declaration is never a diagnostic.

## 10. Field vocabulary (v1)

Field names are an **open vocabulary**. This specification defines a core set
with stable meanings so that independent producers and consumers agree on the
common cases; consumers **MAY** define additional fields, and **MUST** tolerate
fields they do not model (§7.5).

A consumer **MUST NOT** require every core field — a declaration carries only
the fields relevant to its subject.

### 10.1 Timing (shared)

| Field | Unit | Meaning |
| --- | --- | --- |
| `requests_per_active_minute` | requests / minute | The request rate while the workload is active. Captures burstiness that a monthly total alone cannot. |

### 10.2 Service / infrastructure profile

| Field | Unit | Meaning |
| --- | --- | --- |
| `monthly_requests` | requests / month | Invocations (HTTP requests, queue messages, function calls) per month. |
| `request_duration_ms` | milliseconds | Average wall-clock duration of one request. |
| `storage_gb` | gigabytes | Average data at rest. |
| `monthly_data_processed_gb` | gigabytes / month | Data transferred or processed per month. |

### 10.3 Token / model profile

| Field | Unit | Meaning |
| --- | --- | --- |
| `monthly_calls` | calls / month | Model/API invocations per month. |
| `avg_input_tokens` | tokens | Average input (prompt) tokens per call. |
| `avg_output_tokens` | tokens | Average output (completion) tokens per call. |
| `avg_conversation_turns` | turns | Average number of turns per conversation, for multi-turn workloads. |

> The vocabulary above is the v1 core. Adding a field to the core vocabulary is
> a minor, backwards-compatible change. Consumer-specific fields **SHOULD** be
> namespaced or clearly documented by that consumer to avoid clashing with
> future core fields.

## 11. Examples

A complete declaration in block form (Terraform):

```hcl
# expected-load:
#   monthly_requests: 5_000_000
#   request_duration_ms: 40
#   confidence: high
#   source: observed
#   last_updated: 2026-01-15
resource "example_function" "api" {
  # ...
}
```

The same load in inline form (Go):

```go
//expected-load: monthly_requests=5_000_000 request_duration_ms=40
func Handler(w http.ResponseWriter, r *http.Request) { /* ... */ }
```

A token workload (TypeScript / JSDoc):

```ts
/**
 * @expected-load
 *   monthly_calls: 100_000
 *   avg_input_tokens: 1_200
 *   avg_output_tokens: 400
 */
export async function summarise(text: string) { /* ... */ }
```

See [`examples/`](./examples) for one file per language and several framework
scenarios.

## 12. Grammar (informative)

The following ABNF describes the framing-stripped declaration. It is
informative; §3–§6 are normative where they differ.

```abnf
declaration   = marker [ inline-fields ] *( NL field-line )
marker        = [ "@" ] %i"expected" sep1 %i"load" [ ":" ]
sep1          = "-" / "_" / SP
inline-fields = 1*( 1*SP field )
field-line    = *SP field
field         = key *SP ( ":" / "=" ) *SP value
key           = ALPHA *( ALPHA / DIGIT / "_" / "-" / "." / SP )
value         = [ "+" / "-" ] 1*( DIGIT / "_" / "," )   ; load + version
              / token                                    ; meta enums / dates
token         = 1*( %x21-7E )
```

Block-form field collection stops at the first blank line after one or more
fields, or the first line that does not match `field-line`.

## 13. Versioning and governance

- This specification uses a `MAJOR.MINOR` version. Adding fields or comment
  framings is a **minor** change. Removing or redefining a field, or changing
  the grammar incompatibly, is a **major** change.
- The specification is open and vendor-neutral. It names no product and depends
  on no implementation. Anyone may implement a producer or consumer.
- Proposals and corrections are made against this document.

---

*This specification is published under [CC BY 4.0](./LICENSE). You are free to
share and adapt it, including for commercial use, with attribution.*
