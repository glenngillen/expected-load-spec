"""Expected Load — Python examples."""


# Block form in `#` comments, immediately above the function.
# expected-load:
#   monthly_calls: 100_000
#   avg_input_tokens: 1_200
#   avg_output_tokens: 400
def summarise(text: str) -> str:
    return text[:280]


def classify(text: str) -> str:
    """Classify a support ticket.

    The declaration can also live inside the docstring. Lines that are not
    ``#`` comments are passed through unchanged, so a marker block here is
    parsed the same way.

    Expected load:
        monthly_calls: 3_000_000
        avg_input_tokens: 600
        avg_output_tokens: 5
        confidence: high
        source: observed
        last_updated: 2026-02-01
    """
    return "billing"


# Inline form on a single `#` line.
# expected-load: monthly_requests=900_000 request_duration_ms=15
def healthcheck() -> dict:
    return {"ok": True}
