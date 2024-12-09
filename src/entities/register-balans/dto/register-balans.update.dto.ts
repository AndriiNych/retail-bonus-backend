import { PartialType } from '@nestjs/swagger';
import { RegisterBalansDto } from './register-balans.dto';

export class RegisterBalansUpdateDto extends PartialType(RegisterBalansDto) {}
