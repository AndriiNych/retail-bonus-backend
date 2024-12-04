import { MATH } from '@src/utils/math.decimal';
import {
  RegisterBalansAccuredBonusTransformDto,
  RegisterBalansSpentBonusTransformDto,
} from '../dto/register-balans.transform.dto';

export enum ActiveType {
  Future = 0,
  Active = 1,
  Close = 99,
}

export enum DocumentType {
  Receipt = 1,
  ReceiptForReturn = 2,
  AddBonus = 11,
  RemoveBonus = 12,
  SpentBonus = 22,
}

export const RegisterBalansTypeMap: Record<
  DocumentType,
  {
    activeType: ActiveType;
    dtoClass: new () => any;
    operation: (operand1: string, operand2: string) => string;
  }
> = {
  [DocumentType.Receipt]: {
    activeType: ActiveType.Future,
    dtoClass: RegisterBalansAccuredBonusTransformDto,
    operation: (operand1: string, operand2: string) => MATH.DECIMAL.add(operand1, operand2),
  },
  //
  [DocumentType.ReceiptForReturn]: {
    activeType: ActiveType.Future,
    dtoClass: RegisterBalansAccuredBonusTransformDto,
    operation: (operand1: string, operand2: string) => MATH.DECIMAL.add(operand1, operand2),
  },
  [DocumentType.AddBonus]: {
    activeType: ActiveType.Future,
    dtoClass: RegisterBalansAccuredBonusTransformDto,
    operation: (operand1: string, operand2: string) => MATH.DECIMAL.add(operand1, operand2),
  },
  [DocumentType.RemoveBonus]: {
    activeType: ActiveType.Future,
    dtoClass: RegisterBalansAccuredBonusTransformDto,
    operation: (operand1: string, operand2: string) => MATH.DECIMAL.add(operand1, operand2),
  },
  //
  [DocumentType.SpentBonus]: {
    activeType: ActiveType.Close,
    dtoClass: RegisterBalansSpentBonusTransformDto,
    operation: (operand1: string, operand2: string) => MATH.DECIMAL.subtract(operand1, operand2),
  },
};
