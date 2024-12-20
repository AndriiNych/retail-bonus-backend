import { MethodNotAllowedException } from '@nestjs/common';
import { MSG } from '../get.message';

export const isBonusEnoughToPay = (amountBonus: string, spentBonus: string): boolean => {
  if (parseFloat(amountBonus) < parseFloat(spentBonus)) {
    throw new MethodNotAllowedException(MSG.ERR.MESSAGES.isBonusEnoughToPay);
  }

  return true;
};
