import { Expose } from 'class-transformer';
import { RegisterBalansResponseDto } from './register-balans.response.dto';
import { OmitType } from '@nestjs/swagger';

export class RegisterBalansResponseDigitalDto extends OmitType(RegisterBalansResponseDto, [
  'bonus',
  'usedBonus',
]) {
  @Expose()
  bonus: number;

  @Expose()
  usedBonus: number;
}
