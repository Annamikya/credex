# Testing Strategy

## Unit Tests

- `tests/audit-engine.test.ts` validates rule-based cost optimization logic
- `tests/audit-schema.test.ts` verifies Zod schema validation for audit payloads
- `tests/generate-summary.test.ts` tests AI summary generation with fallbacks
- `tests/api-audit.test.ts` validates API route POST handler with mocked dependencies

## Component Tests

- `@testing-library/react` for form interactions and empty state rendering
- `vitest` for lightweight component snapshot and behavior tests

## Running Tests

```bash
npm run test
npm run test:watch  # Run tests in watch mode
npm run coverage    # Run tests with coverage report
```

## CI/CD

GitHub Actions workflow runs on push/PR to main/develop branches:
- Node.js 20.x
- Install dependencies
- Lint code
- Run tests
- Build project

## Test Coverage

Tests cover:
- Audit engine calculations and recommendations
- Input validation and error handling
- AI summary generation with API fallbacks
- API route responses and error cases
- Schema validation for all required fields
