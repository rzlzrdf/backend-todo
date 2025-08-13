import { Handler, Context, APIGatewayProxyEvent } from 'aws-lambda';

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT_SET',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT_SET',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT_SET',
  };

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Environment variables check',
      environment: envVars,
      timestamp: new Date().toISOString(),
    }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    },
  };
};
