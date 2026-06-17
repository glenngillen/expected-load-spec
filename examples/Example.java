// Expected Load — Java / Kotlin examples (Javadoc / KDoc framing).

public class Example {

    /**
     * Summarise a document with a language model.
     *
     * @expected-load
     *   monthlyCalls = 100_000
     *   avgInputTokens = 1_200
     *   avgOutputTokens = 400
     *   confidence = medium
     */
    public String summarise(String text) {
        return text;
    }

    /**
     * Public API handler. Keys may be written in any casing — here camelCase —
     * and are normalized to snake_case by the consumer.
     *
     * @expected-load
     *   monthlyRequests = 5_000_000
     *   requestDurationMs = 35
     */
    public void handle() {
        // ...
    }
}
