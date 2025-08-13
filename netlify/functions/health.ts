import { Handler, Context, APIGatewayProxyEvent } from 'aws-lambda';

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Health check successful',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    },
  };
};
