import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-jest'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import axios from 'axios'
import { APIGatewayProxyEventV2, Context } from 'aws-lambda'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const bedrockMock = mockClient(BedrockRuntimeClient)
const ddbMock = mockClient(DynamoDBDocumentClient)
const s3Mock = mockClient(S3Client)

function makeContext(): Context {
  return {
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'analyzeCode',
    functionVersion: '1',
    invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789:function:analyzeCode',
    memoryLimitInMB: '256',
    awsRequestId: 'test-analyze-request-id',
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
    routeKey: 'POST /api/code/analyze',
    rawPath: '/api/code/analyze',
    rawQueryString: '',
    headers: { 'content-type': 'application/json' },
    requestContext: {
      accountId: '123456789',
      apiId: 'test-api',
      domainName: 'test.execute-api.us-east-1.amazonaws.com',
      domainPrefix: 'test',
      http: { method: 'POST', path: '/api/code/analyze', protocol: 'HTTP/1.1', sourceIp: '1.2.3.4', userAgent: 'jest' },
      requestId: 'test-analyze-request-id',
      routeKey: 'POST /api/code/analyze',
      stage: '$default',
      time: '26/Feb/2026:00:00:00 +0000',
      timeEpoch: Date.now(),
    },
    body: JSON.stringify(body),
    isBase64Encoded: false,
  } as unknown as APIGatewayProxyEventV2
}

const MOCK_EXPLANATION = {
  summary: 'A simple Python function',
  stepByStep: [{ lineRange: [1, 3], explanation: 'Defines a print function', conceptsUsed: ['functions'] }],
  concepts: ['functions'],
  patterns: [],
  complexity: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)', cyclomaticComplexity: 1 },
  suggestions: ['Consider adding docstrings'],
}

describe('analyzeCode Lambda', () => {
  beforeEach(() => {
    bedrockMock.reset()
    ddbMock.reset()
    s3Mock.reset()
    jest.clearAllMocks()

    // Mock DynamoDB PutCommand
    ddbMock.on(PutCommand).resolves({})
    // Mock S3 PutObjectCommand (non-fatal)
    s3Mock.on(PutObjectCommand).resolves({})
  })

  it('should execute code via Judge0 and return AI explanation', async () => {
    // Mock Judge0 submit
    mockedAxios.post.mockResolvedValueOnce({ data: { token: 'test-token-123' } })
    // Mock Judge0 poll (immediate success)
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        stdout: 'Hello, World!\n',
        stderr: null,
        compile_output: null,
        message: null,
        time: '0.05',
        memory: 1024,
        exit_code: 0,
        status: { id: 3, description: 'Accepted' },
      },
    })

    // Mock Bedrock
    const encoder = new TextEncoder()
    bedrockMock.on(InvokeModelCommand).resolves({
      body: encoder.encode(
        JSON.stringify({
          content: [{ text: JSON.stringify({ explanation: MOCK_EXPLANATION, patterns: [], suggestions: [] }) }],
        })
      ),
    })

    const { lambdaHandler } = await import('../src/functions/analyzeCode')

    const event = makeEvent({
      userId: 'user123',
      code: 'print("Hello, World!")',
      language: 'python',
    })

    const result = await lambdaHandler(event, makeContext())

    expect(result.statusCode).toBe(200)
    const body = JSON.parse(result.body as string)
    expect(body.success).toBe(true)
    expect(body.data.execution.stdout).toBe('Hello, World!\n')
    expect(body.data.execution.exitCode).toBe(0)
    expect(body.data.explanation.summary).toBe(MOCK_EXPLANATION.summary)
    expect(mockedAxios.post).toHaveBeenCalledTimes(1) // Judge0 submit
    expect(mockedAxios.get).toHaveBeenCalledTimes(1)  // Judge0 poll
  })

  it('should return 400 for unsupported language', async () => {
    const { lambdaHandler } = await import('../src/functions/analyzeCode')

    const event = makeEvent({
      userId: 'user123',
      code: 'some code',
      language: 'brainfuck', // Unsupported
    })

    const result = await lambdaHandler(event, makeContext())
    expect(result.statusCode).toBe(400)
    const body = JSON.parse(result.body as string)
    expect(body.error.code).toBe('UNSUPPORTED_LANGUAGE')
  })

  it('should return 400 if code is missing', async () => {
    const { lambdaHandler } = await import('../src/functions/analyzeCode')

    const event = makeEvent({ userId: 'user123', language: 'python' })
    const result = await lambdaHandler(event, makeContext())
    expect(result.statusCode).toBe(400)
  })

  it('should handle Judge0 timeout gracefully', async () => {
    // Mock Judge0 submit succeeds
    mockedAxios.post.mockResolvedValueOnce({ data: { token: 'timeout-token' } })
    // Mock 20 polls all returning "Processing"
    mockedAxios.get.mockResolvedValue({
      data: {
        stdout: null, stderr: null, compile_output: null, message: null,
        time: null, memory: null, exit_code: null,
        status: { id: 2, description: 'Processing' },
      },
    })

    const { lambdaHandler } = await import('../src/functions/analyzeCode')

    const event = makeEvent({
      userId: 'user123',
      code: 'while(true):pass',
      language: 'python',
    })

    const result = await lambdaHandler(event, makeContext())
    expect(result.statusCode).toBe(504) // CODE_EXECUTION_TIMEOUT
    const body = JSON.parse(result.body as string)
    expect(body.error.code).toBe('CODE_EXECUTION_TIMEOUT')
  })
})
