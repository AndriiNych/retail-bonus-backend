import { OmitType } from '@nestjs/swagger';
import { RegisterBalansResponseDto } from './register-balans.response.dto';
import { Expose } from 'class-transformer';

export class RegisterBalansTransformBaseDto extends OmitType(RegisterBalansResponseDto, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {
  @Expose({ name: 'uuid' })
  documentUuid: string;

  @Expose({ name: 'returnUuid' })
  documentReturnUuid: string;

  accuredBonus: string;

  spentBonus: string;

  saving: string;
}

export class RegisterBalansAccuredBonusTransformDto extends OmitType(
  RegisterBalansTransformBaseDto,
  ['spentBonus', 'saving'] as const,
) {
  @Expose({ name: 'accuredBonus' })
  bonus: string;
}

export class RegisterBalansSpentBonusTransformDto extends OmitType(RegisterBalansTransformBaseDto, [
  'accuredBonus',
  'saving',
] as const) {
  @Expose({ name: 'spentBonus' })
  bonus: string;
}

export class RegisterBalansSavingTransformDto extends OmitType(RegisterBalansTransformBaseDto, [
  'accuredBonus',
  'spentBonus',
] as const) {
  @Expose({ name: 'saving' })
  bonus: string;
}
