import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
  Matches,
  MaxLength,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'isLessThanOrEqualTo100', async: false })
export class IsLessThanOrEqualTo100 implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const numberValue = parseFloat(value);
    return numberValue <= 100;
  }

  defaultMessage(args: ValidationArguments) {
    return `startBonus must be less than or equal to 100`;
  }
}

export class StoreSettingsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(36)
  uuid: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  //TODO change messages using constants

  @IsOptional()
  @IsString()
  @Validate(IsLessThanOrEqualTo100)
  @Matches(/^\d{1,3}(\.\d{1,2})?$/, {
    message:
      'startBonus must be a decimal number with up to 3 digits before the decimal and 2 digits after',
  })
  startBonus: string;

  @IsOptional()
  @IsString()
  @Validate(IsLessThanOrEqualTo100)
  @Matches(/^\d{1,3}(\.\d{1,2})?$/, {
    message:
      'currentBonus must be a decimal number with up to 3 digits before the decimal and 2 digits after',
  })
  currentBonus?: string;

  @IsOptional()
  @IsString()
  @Validate(IsLessThanOrEqualTo100)
  @Matches(/^\d{1,3}(\.\d{1,2})?$/, {
    message:
      'bonusPayment must be a decimal number with up to 3 digits before the decimal and 2 digits after',
  })
  bonusPayment?: string;
}
