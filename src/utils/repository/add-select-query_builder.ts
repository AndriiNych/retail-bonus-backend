import { NotImplementedException } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

const CONDITIONAL_STATEMENTS = {
  ne: '!=',
  gt: '>',
  lt: '<',
  gte: '>=',
  lte: '<=',
};

export function configureSelectQueryBuilder<T>(
  sqb: SelectQueryBuilder<T>,
  queryString: any,
  additionalObj?: any,
): SelectQueryBuilder<T> {
  const { sort: sortObj, page, limit, ...whereObj } = queryString;

  addConditionToQueryBuilder(sqb, whereObj);

  addSortToQueryBuilder(sqb, sortObj);

  if (additionalObj?.addSort) sqb.addOrderBy(additionalObj.addSort);

  if (page && limit) {
    sqb.skip((page - 1) * limit);
    sqb.take(limit);
  }

  return sqb;
}

export function addConditionToQueryBuilder<T>(
  sqb: SelectQueryBuilder<T>,
  condition: any,
): SelectQueryBuilder<T> {
  Object.entries(condition).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    if (isNotDate(value)) {
      Object.entries(value).forEach(([keyIn, valueIn]) => {
        if (valueIn === null || valueIn === undefined) {
          return;
        }

        if (isNotDate(valueIn)) {
          throw new NotImplementedException(`Not Implemented. ${keyIn} is error.`);
        }
        sqb.andWhere(
          `${getColumnNameInEntity(sqb, key)} ${CONDITIONAL_STATEMENTS[keyIn]} :${keyIn}`,
          {
            [keyIn]: valueIn,
          },
        );
      });
    } else {
      sqb.andWhere(`${getColumnNameInEntity(sqb, key)} = :${key}`, { [key]: value });
    }
  });
  return sqb;
}

export function addSortToQueryBuilder<T>(
  sqb: SelectQueryBuilder<T>,
  sort: any,
): SelectQueryBuilder<T> {
  if (sort) {
    Object.entries(sort).forEach(([key, value]) => {
      sqb.addOrderBy(
        `${getColumnNameInEntity(sqb, key)}`,
        `${transformSortValue(value.toString())}`,
      );
    });
  }
  return sqb;
}

function getColumnNameInEntity<T>(
  sqb: SelectQueryBuilder<T>,
  propertyName: string,
): string | undefined {
  const metadata = sqb.connection.getMetadata(sqb.alias);

  const column = metadata.columns.find(col => col.propertyName === propertyName);

  return column?.databaseName;
}

function transformSortValue(value: string): 'ASC' | 'DESC' {
  if (value.toLowerCase() === 'desc') {
    return 'DESC';
  }

  return 'ASC';
}

function isNotDate(value: any): boolean {
  return typeof value === 'object' && Object.prototype.toString.call(value) !== '[object Date]';
}
