import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-jest'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyEventV2, Context } from 'aws-lambda'

// Mock Bedrock and DynamoDB clients
const bedrockMock = mockClient(BedrockRuntimeClient)
const ddbMock = mockClient(DynamoDBDocumentClient)

function makeContext(fnName: string): Context {
  return {
    callbackWaitsForEmptyEventLoop: false,
    functionName: fnName,
    functionVersion: '1',
    invokedFunctionArn: `arn:aws:lambda:us-east-1:123456789:function:${fnName}`,
    memoryLimitInMB: '256',
    awsRequestId: 'test-request-id',
    logGroupName: '/aws/lambda/test',
    logStreamName: 'test-stream',
    getRemainingTimeInMillis: () => 25000,
    done: jest.fn(),
    fail: jest.fn(),
    succeed: jest.fn(),
  }
}

function makeEvent(body: unknown, pathParams?: Record<string, string>): APIGatewayProxyEventV2 {
  return {
    version: '2.0',
    routeKey: 'POST /test',
    rawPath: '/test',
    rawQueryString: '',
    headers: { 'content-type': 'application/json' },
    requestContext: {
      accountId: '123456789',
      apiId: 'test-api',
      domainName: 'test.execute-api.us-east-1.amazonaws.com',
      domainPrefix: 'test',
      http: { method: 'POST', path: '/test', protocol: 'HTTP/1.1', sourceIp: '1.2.3.4', userAgent: 'jest' },
      requestId: 'test-request-id',
      routeKey: 'POST /test',
      stage: '$default',
      time: '26/Feb/2026:00:00:00 +0000',
      timeEpoch: Date.now(),
    },
    body: JSON.stringify(body),
    isBase64Encoded: false,
    pathParameters: pathParams,
  } as unknown as APIGatewayProxyEventV2
}

function mockBedrockResponse(jsonOutput: unknown) {
  const encoder = new TextEncoder()
  bedrockMock.on(InvokeModelCommand).resolves({
    body: encoder.encode(
      JSON.stringify({ content: [{ text: JSON.stringify(jsonOutput) }] })
    ),
  })
}

describe('generateRoadmap Lambda', () => {
  beforeEach(() => {
    bedrockMock.reset()
    ddbMock.reset()
  })

  it('should generate a roadmap and return 201', async () => {
    // Mock Bedrock to return a valid roadmap
    mockBedrockResponse({
      concepts: [
        {
          conceptId: 'async-await',
          name: 'Async/Await',
          description: 'Asynchronous JavaScript patterns',
          order: 1,
          prerequisites: [],
          estimatedTime: 60,
          status: 'not_started',
          proficiencyRequired: 'beginner',
        },
      ],
      estimatedDuration: 60,
    })

    // Mock DynamoDB PutCommand
    ddbMock.on(PutCommand).resolves({})

    // Import after mocks set up
    const { lambdaHandler } = await import('../src/functions/generateRoadmap')

    const event = makeEvent({
      userId: 'user123',
      goal: {
        title: 'Learn JavaScript',
        description: 'Master modern JavaScript',
        targetConcepts: ['async-await', 'promises'],
      },
      currentProficiency: {},
    })

    const result = await lambdaHandler(event, makeContext('generateRoadmap'))

    expect(result.statusCode).toBe(201)
    const body = JSON.parse(result.body as string)
    expect(body.success).toBe(true)
    expect(body.data.roadmap.concepts).toHaveLength(1)
    expect(body.data.roadmap.concepts[0].conceptId).toBe('async-await')
    expect(bedrockMock).toHaveReceivedCommandTimes(InvokeModelCommand, 1)
    expect(ddbMock).toHaveReceivedCommandTimes(PutCommand, 1)
  })

  it('should return 400 when userId is missing', async () => {
    const { lambdaHandler } = await import('../src/functions/generateRoadmap')

    const event = makeEvent({ goal: { title: 'Test', targetConcepts: ['js'] } })
    const result = await lambdaHandler(event, makeContext('generateRoadmap'))

    expect(result.statusCode).toBe(400)
    const body = JSON.parse(result.body as string)
    expect(body.success).toBe(false)
    expect(body.error.code).toBe('INVALID_INPUT')
  })

  it('should return 400 when goal is missing', async () => {
    const { lambdaHandler } = await import('../src/functions/generateRoadmap')

    const event = makeEvent({ userId: 'user123' })
    const result = await lambdaHandler(event, makeContext('generateRoadmap'))

    expect(result.statusCode).toBe(400)
  })

  it('should handle Bedrock service unavailable with retry and then fail gracefully', async () => {
    bedrockMock.on(InvokeModelCommand).rejects(new Error('ServiceUnavailableException'))

    const { lambdaHandler } = await import('../src/functions/generateRoadmap')

    const event = makeEvent({
      userId: 'user123',
      goal: { title: 'Test', targetConcepts: ['js'], description: '' },
      currentProficiency: {},
    })

    const result = await lambdaHandler(event, makeContext('generateRoadmap'))
    expect(result.statusCode).toBeGreaterThanOrEqual(500)
    const body = JSON.parse(result.body as string)
    expect(body.success).toBe(false)
  })
})
