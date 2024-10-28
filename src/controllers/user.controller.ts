import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { UserData, userLoginSchema, userSchema } from 'src/schemas/user.schema';
import { UserService } from 'src/services/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/users')
  async createUser(@Body(new ZodValidationPipe(userSchema)) body: UserData) {
    return this.userService.createUser(body);
  }

  @Post('/users/login')
  async login(@Body(new ZodValidationPipe(userLoginSchema)) body: UserData) {
    return this.userService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users')
  async getUsers() {
    return this.userService.getUsers();
  }
}
