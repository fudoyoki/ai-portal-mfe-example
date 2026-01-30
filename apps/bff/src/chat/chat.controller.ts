import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { ChatService } from './chat.service'

interface SendMessageDto {
  message: string
  sessionId?: string
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('sessions')
  getSessions() {
    return this.chatService.getSessions()
  }

  @Get('sessions/:id')
  getSession(@Param('id') id: string) {
    return this.chatService.getSession(id)
  }

  @Post('send')
  sendMessage(@Body() dto: SendMessageDto) {
    // In real app: forward to AI backend, stream response
    return this.chatService.sendMessage(dto.message, dto.sessionId)
  }
}
