import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PublicUserData, UserData } from 'src/schemas/user.schema';
import { compare, hash } from 'bcryptjs';
import { UserGateway } from 'src/gateways/user.gateway';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private userGateway: UserGateway
  ) {}
  async createUser(body: UserData): Promise<PublicUserData> {
    const { name, email, password } = body;
    const alreadyExists = await this.prisma.user.findUnique({ where: { email } });

    if (alreadyExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hash(password, 8);

    const user = await this.prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        },
        select: {
            name: true, 
            email: true
        }
    })

    this.userGateway.sendUserCreated(user);

    return user
  }

  async login(body: UserData): Promise<{ token: string }> {
    const { email, password } = body;
    const user = await this.prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException('Invalid password');
    }

    const payload = { email: user.email, sub: user.name }; 
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async getUsers(): Promise<PublicUserData[]> {
    const users = await this.prisma.user.findMany({
        select: {
            name: true,
            email: true
        }
    });

    return users
  }
}
