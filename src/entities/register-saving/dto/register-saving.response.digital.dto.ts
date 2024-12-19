import { OmitType } from '@nestjs/swagger';
import { RegisterSavingResponseDto } from './register-saving.response.dto';
import { Expose } from 'class-transformer';

export class RegisterSavingResponseDigitalDto extends OmitType(RegisterSavingResponseDto, [
  'amount',
]) {
  @Expose()
  amount: number;
}
