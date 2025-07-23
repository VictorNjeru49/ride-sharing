import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization, x-Requested-With',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Inventory Api')
    .setDescription('To check inventory')
    .setVersion('1.0')
    .addTag('Inventory', 'Inventory Endpoints')
    .addTag('Users', 'User Management Endpoints')
    .addTag('Warehouse', 'Warehouse Management Endpoints')
    .addTag('Products', 'Product Management Endpoints')
    .addTag('Orders', 'Order Management Endpoints')
    .addTag('Order Items', 'Order Item Management Endpoints')
    .addTag('Categories', 'Category Management Endpoints')
    .addTag('Transactions', 'Transaction Management Endpoints')
    .addTag('Payments', 'Payment Processing Endpoints')
    .addTag('Suppliers', 'Supplier Management Endpoints')
    .addTag('Shipping', 'Shipping Management Endpoints')
    .addTag('Returnee', 'Returns Management Endpoints')
    .addTag('Seed', 'Seeding data Endpoints')
    .addTag('Register', 'User Registration Endpoints')
    .addTag('Auth', 'Auth Endpoints')
    .addServer(`http://localhost:8000`, 'Local Development Server')
    .addServer(
      `https://inventory-management-kx6n.onrender.com`,
      'Production Server',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'jwt',
      },
      'AccessToken',
    )
    .build();

  const documentfactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentfactory, {
    jsonDocumentUrl: '/api-json',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      tryItOutEnabled: true,
    },
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin-bottom: 20px }
    `,
    customfavIcon: '../favicon/inventory.png',
    customSiteTitle: 'Inventory Documentation Api',
  });
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT');
  await app.listen(PORT, () => {
    console.log(`The Serve is Listening at Port: http://localhost:${PORT}/api`);
  });
}
bootstrap();
