# DEVICE_ADAPTERS.md

## Unified JSON Payload Schema

All device adapters must emit payloads in the following format:

```json
{
  "device_id": "string",
  "timestamp": "ISO8601 UTC string",
  "signals": {
    "heart_rate": "number",
    "hrv": "number",
    "eda": "number",
    "movement": "string",
    "gesture": "string"
  },
  "status_hint": "string",
  "confidence": "number",
  "metadata": {"source": "string", "firmware": "string"}
}
```

## Privacy Rules
- **No raw images, audio, or PII** may be uploaded or stored.
- Only derived signals (e.g., gestures, HR, EDA) are permitted.
- All adapters must tag payloads with `metadata.source` and `firmware`.
- Use mock data for development and testing.

## Adapter Guidelines
- Each adapter should be placed in its respective subfolder under `/integrations`.
- Adapters must export a function that emits mock payloads at a regular interval.
- All payloads must conform to the schema above.
