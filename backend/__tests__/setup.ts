// Global test environment setup
// Set environment variables before any module imports

process.env.AWS_REGION = 'us-east-1'
process.env.DYNAMODB_TABLE_PREFIX = 'studdybuddy-test'
process.env.BEDROCK_MODEL_ID = 'anthropic.claude-3-sonnet-20240229-v1:0'
process.env.JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com'
process.env.JUDGE0_API_KEY = 'test-key'
process.env.JUDGE0_API_HOST = 'judge0-ce.p.rapidapi.com'
process.env.S3_BUCKET_NAME = 'studdybuddy-test-logs'
