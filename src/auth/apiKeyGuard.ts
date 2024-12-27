import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { MSG } from '@src/utils/get.message';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKeyHeader = request.headers['authorization'];

    if (!apiKeyHeader) {
      throw new UnauthorizedException(MSG.ERR.MESSAGES.unauthorizedException.apiKeyIsMissing);
    }

    const [type, apiKey] = apiKeyHeader.split(' ');

    if (type !== 'Bearer' || apiKey !== this.configService.get<string>('API_KEY')) {
      throw new UnauthorizedException(MSG.ERR.MESSAGES.unauthorizedException.invalidApiKey);
    }

    return true;
  }
}
