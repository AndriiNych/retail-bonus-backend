import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsLessThanOrEqualToConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const [maxValue] = args.constraints;
    const numberValue = parseFloat(value);
    return !isNaN(numberValue) && numberValue <= maxValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [maxValue] = args.constraints;
    return `${args.property} must be less than or equal to ${maxValue}`;
  }
}

export function IsLessThanOrEqualTo(
  maxValue: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLessThanOrEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [maxValue],
      options: validationOptions,
      validator: IsLessThanOrEqualToConstraint,
    });
  };
}
