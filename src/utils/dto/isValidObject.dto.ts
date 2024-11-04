import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidObjectConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    console.log(1);
    console.log(args.value);
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Value must be a valid object';
  }
}

export function IsValidObject(validationOptions?: ValidationOptions) {
  console.log(validationOptions);
  return function (object: Object) {
    registerDecorator({
      //   name: 'isValidObject',
      target: object.constructor,
      propertyName: 'propertyName',
      constraints: [],
      options: validationOptions,
      validator: IsValidObjectConstraint,
    });
  };
}
