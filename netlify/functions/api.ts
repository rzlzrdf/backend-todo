import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { Handler, Context, APIGatewayProxyEvent } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

let server: any;

async function bootstrap() {
  try {
    console.log('Starting NestJS application...');
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });
    
    console.log('NestJS application created successfully');
    
    // Enable CORS for Netlify
    app.enableCors({
      origin: true,
      credentials: true,
    });

    console.log('CORS enabled');

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    console.log('Validation pipe configured');

    // Set global prefix for API routes
    app.setGlobalPrefix('api');
    
    console.log('Global prefix set to /api');
    
    await app.init();
    
    console.log('Application initialized');

    const expressApp = app.getHttpAdapter().getInstance();
    console.log('Express app instance obtained');
    
    const serverlessHandler = serverlessExpress({ app: expressApp });
    console.log('Serverless handler created');
    
    return serverlessHandler;
  } catch (error) {
    console.error('Bootstrap error:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  try {
    server = server ?? (await bootstrap());
    return server(event, context);
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Internal server error',
        error: error.message 
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      },
    };
  }
};
