"""Expected Load — LangChain agent (framework scenario).

A retrieval-augmented agent. Each user question fans out into several model
calls (planning + tool use + final answer), so the per-call averages and the
turn count describe one *question*, and monthly_calls counts model calls, not
questions.
"""

from typing import Any


# expected-load:
#   monthly_calls: 4_000_000
#   avg_input_tokens: 3_500
#   avg_output_tokens: 500
#   avg_conversation_turns: 8
#   requests_per_active_minute: 90
#   confidence: medium
#   source: estimated
def answer(question: str, tools: list[Any]) -> str:
    """Run the agent loop for a single user question."""
    return question
