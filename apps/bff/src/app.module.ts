import { Module } from '@nestjs/common'
import { AuthController } from './auth/auth.controller'
import { AuthService } from './auth/auth.service'
import { ChatController } from './chat/chat.controller'
import { ChatService } from './chat/chat.service'
import { HealthController } from './health/health.controller'

@Module({
  imports: [],
  controllers: [AuthController, ChatController, HealthController],
  providers: [AuthService, ChatService],
})
export class AppModule {}
