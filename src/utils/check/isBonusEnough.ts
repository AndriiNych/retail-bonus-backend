import { MethodNotAllowedException } from '@nestjs/common';

export const isBonusEnoughToPay = (amountBonus: string, spentBonus: string): boolean => {
  if (parseFloat(amountBonus) < parseFloat(spentBonus)) {
    throw new MethodNotAllowedException('Insufficient bonus amount on the account');
  }

  return true;
};
