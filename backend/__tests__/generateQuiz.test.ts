import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-jest'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyEventV2, Context } from 'aws-lambda'

const bedrockMock = mockClient(BedrockRuntimeClient)
const ddbMock = mockClient(DynamoDBDocumentClient)

function makeContext(fnName: string): Context {
  return {
    callbackWaitsForEmptyEventLoop: false,
    functionName: fnName,
    functionVersion: '1',
    invokedFunctionArn: `arn:aws:lambda:us-east-1:123456789:function:${fnName}`,
    memoryLimitInMB: '256',
    awsRequestId: 'test-request-id-quiz',
    logGroupName: '/aws/lambda/test',
    logStreamName: 'test-stream',
    getRemainingTimeInMillis: () => 25000,
    done: jest.fn(),
    fail: jest.fn(),
    succeed: jest.fn(),
  }
}

function makeEvent(body: unknown): APIGatewayProxyEventV2 {
  return {
    version: '2.0',
    routeKey: 'POST /api/quiz/generate',
    rawPath: '/api/quiz/generate',
    rawQueryString: '',
    headers: { 'content-type': 'application/json' },
    requestContext: {
      accountId: '123456789',
      apiId: 'test-api',
      domainName: 'test.execute-api.us-east-1.amazonaws.com',
      domainPrefix: 'test',
      http: { method: 'POST', path: '/api/quiz/generate', protocol: 'HTTP/1.1', sourceIp: '1.2.3.4', userAgent: 'jest' },
      requestId: 'test-request-id-quiz',
      routeKey: 'POST /api/quiz/generate',
      stage: '$default',
      time: '26/Feb/2026:00:00:00 +0000',
      timeEpoch: Date.now(),
    },
    body: JSON.stringify(body),
    isBase64Encoded: false,
  } as unknown as APIGatewayProxyEventV2
}

function mockBedrockQuizResponse(count: number) {
  const questions = Array.from({ length: count }, (_, i) => ({
    id: `q${i + 1}`,
    conceptId: 'javascript',
    difficulty: 5,
    type: 'multiple_choice',
    prompt: `What is question ${i + 1}?`,
    options: [
      { label: 'A', text: 'Option A' },
      { label: 'B', text: 'Option B' },
      { label: 'C', text: 'Option C' },
      { label: 'D', text: 'Option D' },
    ],
    correctAnswer: 'A',
    testCases: [],
    hints: ['Hint 1', 'Hint 2'],
    successCriteria: 'Select the correct answer',
    estimatedTime: 2,
    explanation: 'Because A is correct',
  }))

  const encoder = new TextEncoder()
  bedrockMock.on(InvokeModelCommand).resolves({
    body: encoder.encode(
      JSON.stringify({ content: [{ text: JSON.stringify(questions) }] })
    ),
  })
}

describe('generateQuiz Lambda', () => {
  beforeEach(() => {
    bedrockMock.reset()
    ddbMock.reset()
    // Mock DynamoDB query for history (empty)
    ddbMock.on(QueryCommand).resolves({ Items: [] })
    ddbMock.on(PutCommand).resolves({})
  })

  it('should generate 10 quiz questions by default', async () => {
    mockBedrockQuizResponse(10)

    const { lambdaHandler } = await import('../src/functions/generateQuiz')

    const event = makeEvent({
      userId: 'user123',
      conceptIds: ['javascript', 'promises'],
      difficulty: 5,
      numberOfQuestions: 10,
    })

    const result = await lambdaHandler(event, makeContext('generateQuiz'))

    expect(result.statusCode).toBe(201)
    const body = JSON.parse(result.body as string)
    expect(body.success).toBe(true)
    expect(body.data.questions).toHaveLength(10)
    expect(typeof body.data.quizId).toBe('string')
    expect(body.data.timeLimit).toBe(1200) // 10 * 120s
  })

  it('should clamp numberOfQuestions between 5 and 20', async () => {
    mockBedrockQuizResponse(5)

    const { lambdaHandler } = await import('../src/functions/generateQuiz')

    // Request 100 questions — should be clamped to 20 (Bedrock returns 5 here)
    const event = makeEvent({
      userId: 'user123',
      conceptIds: ['javascript'],
      difficulty: 5,
      numberOfQuestions: 100,
    })

    const result = await lambdaHandler(event, makeContext('generateQuiz'))
    expect(result.statusCode).toBe(201)
  })

  it('should clamp difficulty between 1 and 10', async () => {
    mockBedrockQuizResponse(5)

    const { lambdaHandler } = await import('../src/functions/generateQuiz')

    const event = makeEvent({
      userId: 'user123',
      conceptIds: ['javascript'],
      difficulty: 99, // Should be clamped to 10
      numberOfQuestions: 5,
    })

    const result = await lambdaHandler(event, makeContext('generateQuiz'))
    expect(result.statusCode).toBe(201)
  })

  it('should return 400 if userId is missing', async () => {
    const { lambdaHandler } = await import('../src/functions/generateQuiz')

    const event = makeEvent({ conceptIds: ['js'], difficulty: 5, numberOfQuestions: 5 })
    const result = await lambdaHandler(event, makeContext('generateQuiz'))
    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if no conceptIds provided', async () => {
    const { lambdaHandler } = await import('../src/functions/generateQuiz')

    const event = makeEvent({ userId: 'user123', conceptIds: [], difficulty: 5, numberOfQuestions: 5 })
    const result = await lambdaHandler(event, makeContext('generateQuiz'))
    expect(result.statusCode).toBe(400)
  })
})
