import { Injectable } from '@nestjs/common'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

@Injectable()
export class ChatService {
  private sessions: Map<string, ChatSession> = new Map()

  getSessions(): ChatSession[] {
    return Array.from(this.sessions.values())
  }

  getSession(id: string): ChatSession | undefined {
    return this.sessions.get(id)
  }

  sendMessage(message: string, sessionId?: string) {
    const id = sessionId || this.generateId()
    
    let session = this.sessions.get(id)
    if (!session) {
      session = {
        id,
        title: message.slice(0, 50),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      this.sessions.set(id, session)
    }

    // Add user message
    session.messages.push({
      id: this.generateId(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    })

    // Mock AI response (in real app: call AI backend)
    const aiResponse: ChatMessage = {
      id: this.generateId(),
      role: 'assistant',
      content: `This is a mock response to: "${message}". In production, this would come from the AI backend service.`,
      timestamp: Date.now(),
    }
    session.messages.push(aiResponse)
    session.updatedAt = Date.now()

    return {
      sessionId: id,
      response: aiResponse,
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15)
  }
}
