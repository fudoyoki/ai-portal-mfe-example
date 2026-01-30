import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

// STRICT PORT for BFF
const PORT = 4000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  // Enable CORS for frontend apps
  app.enableCors({
    origin: [
      'http://localhost:3000', // Shell
      'http://localhost:3001', // MFE Dashboard
      'http://localhost:3002', // MFE Chat
      'http://localhost:3003', // MFE Tools
      'http://localhost:3004', // MFE Admin
    ],
    credentials: true,
  })

  // Global prefix for all routes
  app.setGlobalPrefix('api')

  await app.listen(PORT)
  console.log(`🚀 BFF running on http://localhost:${PORT}`)
}

bootstrap()
