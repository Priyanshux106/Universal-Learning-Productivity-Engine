# StuddyBuddy AI — Backend

AWS-native serverless backend built with Lambda (TypeScript), API Gateway, DynamoDB, AWS Bedrock (Claude 3 Sonnet), Judge0, and S3.

## Architecture

```
Next.js (Amplify)
  ↓
API Gateway (HTTP API)
  ↓
Lambda Functions (8 endpoints)
  ↓
┌────────────┬─────────────┬────────────┐
│ AWS Bedrock│  DynamoDB   │ Judge0 API │
│ (Claude 3) │ (8 tables)  │ (Code Exec)│
└────────────┴─────────────┴────────────┘
  ↓
CloudWatch (logs + metrics)
```

## API Endpoints

| Method | Path | Lambda | Description |
|--------|------|--------|-------------|
| `POST` | `/api/roadmap/generate` | `generateRoadmap` | Generate personalized learning roadmap |
| `POST` | `/api/concept/simplify` | `simplifyConcept` | Explain concepts (proficiency-adaptive) |
| `POST` | `/api/quiz/generate` | `generateQuiz` | Generate adaptive quiz questions |
| `POST` | `/api/code/analyze` | `analyzeCode` | Execute code + AI explanation |
| `POST` | `/api/solution/evaluate` | `evaluateSolution` | Evaluate exercise solutions |
| `POST` | `/api/xp/update` | `updateXP` | Update XP, level, streak, badges |
| `GET` | `/api/reviews/{userId}` | `getScheduledReviews` | Get spaced-repetition reviews |
| `GET` | `/api/progress/{userId}` | `getUserProgress` | Get comprehensive user progress |

## Project Structure

```
backend/
├── src/
│   ├── types/index.ts          ← All shared TypeScript interfaces
│   ├── lib/
│   │   ├── bedrock.ts          ← Bedrock wrapper (retry logic)
│   │   ├── dynamodb.ts         ← DynamoDB helpers + SM-2 algorithm
│   │   ├── judge0.ts           ← Judge0 submit+poll wrapper
│   │   ├── logger.ts           ← Structured CloudWatch logger
│   │   └── errorHandler.ts     ← Error middleware + CORS headers
│   ├── prompts/                ← Bedrock prompt templates (5 files)
│   └── functions/              ← Lambda handlers (8 files)
├── __tests__/                  ← Jest unit tests
├── template.yaml               ← AWS SAM (Lambda + API GW + DynamoDB)
├── samconfig.toml              ← SAM deploy defaults
├── package.json
├── tsconfig.json
└── .env.example
```

## Local Development

### Prerequisites
- Node.js 20+
- AWS CLI configured with credentials
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- (Optional) [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html)

### Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in JUDGE0_API_KEY and other values
```

### Run Tests

```bash
npm test
# With coverage
npm run test:coverage
```

### Build TypeScript

```bash
npm run build
# Output: dist/
```

### Local API with SAM Local

```bash
# Start DynamoDB Local (optional, for local DB)
docker run -p 8000:8000 amazon/dynamodb-local

# Build and start API locally
sam build
sam local start-api --env-vars env.json
```

Create `env.json` for local testing:
```json
{
  "Parameters": {
    "DYNAMODB_ENDPOINT": "http://localhost:8000",
    "JUDGE0_API_KEY": "your_key_here"
  }
}
```

Test locally:
```bash
# Generate a roadmap
curl -X POST http://localhost:3000/api/roadmap/generate \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","goal":{"title":"Learn TypeScript","description":"Master TS","targetConcepts":["generics","types"]},"currentProficiency":{}}'

# Update XP
curl -X POST http://localhost:3000/api/xp/update \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","action":"exercise_complete","points":50}'

# Get progress
curl http://localhost:3000/api/progress/user123
```

## Deploy to AWS

```bash
# First deploy (interactive)
sam build && sam deploy --guided

# Subsequent deploys
sam build && sam deploy
```

> **Note**: Bedrock requires IAM role permissions. The SAM template automatically creates least-privilege IAM roles.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DYNAMODB_TABLE_PREFIX` | DynamoDB table name prefix | `studdybuddy` |
| `BEDROCK_MODEL_ID` | Bedrock model ID | `anthropic.claude-3-sonnet-20240229-v1:0` |
| `JUDGE0_API_URL` | Judge0 base URL | `https://judge0-ce.p.rapidapi.com` |
| `JUDGE0_API_KEY` | RapidAPI key for Judge0 | — |
| `S3_BUCKET_NAME` | S3 bucket for log backups | `studdybuddy-logs` |
| `FRONTEND_URL` | Amplify URL for CORS | `*` |

## Frontend Integration

All responses follow a consistent envelope:
```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": { "code": "ERROR_CODE", "message": "...", "userMessage": "...", "retryable": false } }
```

Set `NEXT_PUBLIC_API_URL` in your frontend to the API Gateway endpoint output from `sam deploy`.

## DynamoDB Tables

| Table | Purpose |
|-------|---------|
| `studdybuddy-users` | User profiles, XP, level, streak |
| `studdybuddy-roadmaps` | Learning paths per user |
| `studdybuddy-quizzes` | Quiz sessions and questions |
| `studdybuddy-proficiency` | Per-concept proficiency data |
| `studdybuddy-reviews` | Spaced repetition schedule (SM-2) |
| `studdybuddy-codelogs` | Code submission logs (TTL: 90d) |
| `studdybuddy-xphistory` | XP audit trail |
| `studdybuddy-concepts` | Knowledge graph (adjacency lists) |
