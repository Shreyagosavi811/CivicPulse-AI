# Security Policy

## Supported Versions

Only the latest version of CivicPulse AI is supported for security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please report it via the GitHub Issues tab with the tag `security`. We aim to respond to all reports within 48 hours.

### Security Guardrails
- **Rate Limiting**: Implemented at the API gateway level to prevent DDoS.
- **Safety Settings**: Powered by Google Gemini's Responsible AI filters.
- **Data Grounding**: Strict RAG validation ensures no PII or misinformation is generated from untrusted sources.
