import { IsInt } from 'class-validator';
import { RegisterBalansUpdateDto } from './register-balans.update.dto';
import { PickType } from '@nestjs/swagger';

export class RegisterBalansUpdateShortDto extends PickType(RegisterBalansUpdateDto, [
  'activeType',
  'bonus',
  'usedBonus',
]) {
  @IsInt()
  id: number;
}
