import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MSG } from '@src/utils/get.message';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
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
