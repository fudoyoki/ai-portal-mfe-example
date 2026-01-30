import { Controller, Get, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  getCurrentUser() {
    // In real app: extract user from session/JWT cookie
    return this.authService.getCurrentUser()
  }

  @Post('login')
  login(@Res() res: Response) {
    // In real app: redirect to OAuth provider
    // For demo: return mock user
    const user = this.authService.login()
    return res.json(user)
  }

  @Post('logout')
  logout(@Res() res: Response) {
    // In real app: clear session, invalidate token
    this.authService.logout()
    return res.json({ success: true })
  }
}
