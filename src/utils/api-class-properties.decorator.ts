import { ApiProperty } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import 'reflect-metadata';

export function ApiClassProperties(): ClassDecorator {
  return (target: Function) => {
    const reflector = new Reflector();
    const keys = Object.keys(target.prototype);

    keys.forEach(key => {
      const existingDecorators =
        Reflect.getMetadata('swagger/apiModelProperties', target) || {};
      const isDecorated = existingDecorators[key];

      // Додаємо ApiProperty, якщо його немає
      if (!isDecorated) {
        Reflect.defineMetadata(
          'swagger/apiModelProperties',
          {
            ...existingDecorators,
            [key]: { required: true },
          },
          target,
        );
      }

      // Повторно додаємо ApiProperty
      ApiProperty()(target.prototype, key);
    });
  };
}
