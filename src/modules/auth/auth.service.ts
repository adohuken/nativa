import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { CefrLevel, LanguageSkill, UserRole } from '@prisma/client';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

@Injectable()
export class AuthService {
  private readonly saltRounds = 12;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('El correo electrónico ya se encuentra registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);

    const user = await this.prisma.$transaction(async (tx) => {
      // Aseguramos que los idiomas existan en la tabla Language
      await tx.language.upsert({
        where: { code: dto.nativeLanguageCode.toLowerCase() },
        update: {},
        create: { code: dto.nativeLanguageCode.toLowerCase(), name: dto.nativeLanguageCode.toUpperCase() },
      });

      await tx.language.upsert({
        where: { code: dto.targetLanguageCode.toLowerCase() },
        update: {},
        create: { code: dto.targetLanguageCode.toLowerCase(), name: dto.targetLanguageCode.toUpperCase() },
      });

      // 1. Crear Usuario
      const newUser = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          role: dto.role || UserRole.STUDENT,
        },
      });

      // 2. Crear Perfil con Filtro Afectivo Zen
      await tx.profile.create({
        data: {
          userId: newUser.id,
          nativeLanguageCode: dto.nativeLanguageCode.toLowerCase(),
          targetLanguageCode: dto.targetLanguageCode.toLowerCase(),
          zenModeEnabled: true,
        },
      });

      // 3. Inicializar matriz de destrezas Krashen (Cuello de Botella)
      const skills: LanguageSkill[] = [
        LanguageSkill.LISTENING,
        LanguageSkill.SPEAKING,
        LanguageSkill.READING,
        LanguageSkill.WRITING,
      ];

      for (const skill of skills) {
        await tx.userSkillMastery.create({
          data: {
            userId: newUser.id,
            languageCode: dto.targetLanguageCode.toLowerCase(),
            skill,
            currentLevel: CefrLevel.A1,
            masteryScore: 0.0,
          },
        });
      }

      return newUser;
    });

    const tokens = await this.generateAndPersistTokens(user.id, user.email, user.role);

    return {
      ...tokens,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const tokens = await this.generateAndPersistTokens(user.id, user.email, user.role);

    return {
      ...tokens,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async refreshTokens(rawRefreshToken: string): Promise<AuthResponse> {
    const tokenHash = this.hashToken(rawRefreshToken);

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      if (storedToken) {
        // Detección de compromiso: revoca todos los tokens activos del usuario
        await this.prisma.refreshToken.updateMany({
          where: { userId: storedToken.userId },
          data: { isRevoked: true },
        });
      }
      throw new UnauthorizedException('Token de refresco inválido o expirado');
    }

    // Revocar el token usado (Refresh Token Rotation)
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const tokens = await this.generateAndPersistTokens(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role,
    );

    return {
      ...tokens,
      user: {
        id: storedToken.user.id,
        email: storedToken.user.email,
        role: storedToken.user.role,
      },
    };
  }

  async logout(rawRefreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawRefreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { isRevoked: true },
    });
  }

  private async generateAndPersistTokens(
    userId: string,
    email: string,
    role: UserRole,
  ): Promise<AuthTokens> {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET') || 'default_secret',
      expiresIn: '15m',
    });

    const rawRefreshToken = crypto.randomBytes(48).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
    };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
