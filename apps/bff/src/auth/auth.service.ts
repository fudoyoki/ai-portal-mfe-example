import { Injectable } from '@nestjs/common'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

@Injectable()
export class AuthService {
  private currentUser: User | null = {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'user',
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  login(): User {
    this.currentUser = {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'user',
    }
    return this.currentUser
  }

  logout(): void {
    this.currentUser = null
  }
}
