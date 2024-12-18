import { IsObject, IsOptional } from 'class-validator';

export class SelectQueryBuilderBaseDto {
  @IsOptional()
  @IsObject()
  conditions?: any;

  @IsOptional()
  @IsObject()
  orderBy?: any;

  @IsOptional()
  @IsObject()
  addOrderBy?: any;

  @IsOptional()
  @IsObject()
  pagination?: any;
}
