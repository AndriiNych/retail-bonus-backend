import { Type } from 'class-transformer';
import { IsDate, IsISO8601, IsOptional } from 'class-validator';

export class FilterBaseDto {
  @IsISO8601()
  @IsOptional()
  equal?: string;

  @IsISO8601()
  @IsOptional()
  ne?: string;

  @IsISO8601()
  @IsOptional()
  gt?: string;

  @IsISO8601()
  @IsOptional()
  lt?: string;

  @IsISO8601()
  @IsOptional()
  gte?: string;

  @IsISO8601()
  @IsOptional()
  lte?: string;

  @IsISO8601()
  @IsOptional()
  in?: string[];

  @IsISO8601()
  @IsOptional()
  like?: string;
}

export class FilterBaseDateDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  equal?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  ne?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  gt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  gte?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lte?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  in?: Date[];

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  like?: Date;
}
