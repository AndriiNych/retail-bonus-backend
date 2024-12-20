import { NotImplementedException } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { SelectQueryBuilderBaseDto } from './dto/select-query-builder.base.dto';
import { MSG } from '../get.message';

export const CONDITIONAL_STATEMENTS_EQUAL = 'equal';
export const CONDITIONAL_STATEMENTS = {
  [CONDITIONAL_STATEMENTS_EQUAL]: '=',
  ne: '!=',
  gt: '>',
  lt: '<',
  gte: '>=',
  lte: '<=',
  like: 'like',
  in: 'in',
};

export function configureSelectQueryBuilder<T>(
  sqb: SelectQueryBuilder<T>,
  queryString: SelectQueryBuilderBaseDto,
): SelectQueryBuilder<T> {
  const { conditions, orderBy, addOrderBy, pagination } = queryString;

  if (conditions) addConditionToQueryBuilder(sqb, conditions);

  if (orderBy) addSortToQueryBuilder(sqb, orderBy);

  if (addOrderBy) sqb.addOrderBy(addOrderBy);

  if (pagination) {
    const { page, limit } = pagination;

    if (page && limit) {
      sqb.skip((page - 1) * limit);
      sqb.take(limit);
    }
  }

  return sqb;
}

function addConditionToQueryBuilder<T>(
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
          throw new NotImplementedException(MSG.ERR.MESSAGES.notImplementedException({ keyIn }));
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

function addSortToQueryBuilder<T>(sqb: SelectQueryBuilder<T>, sort: any): SelectQueryBuilder<T> {
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
