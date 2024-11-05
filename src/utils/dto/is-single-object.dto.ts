import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsSingleObjectConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const { object } = args;
    return (
      typeof object === 'object' && object !== null && !Array.isArray(object)
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'Value must be a single object';
  }
}

export function IsSingleObject(validationOptions?: ValidationOptions) {
  return function (constructor: Function) {
    registerDecorator({
      name: 'isSingleObject',
      target: constructor,
      propertyName: undefined,
      constraints: [],
      options: validationOptions,
      validator: IsSingleObjectConstraint,
    });
  };
}
