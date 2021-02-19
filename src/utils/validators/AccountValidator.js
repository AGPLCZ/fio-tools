import { BANK_CODES } from "../data/collections";
import { ACCOUNT_MAX_SIZE } from "../data/constants";

export default class AccountValidator {
  constructor() {
    if (this instanceof AccountValidator) {
      throw Error('A static class cannot be instantiated.');
    }
  }

  static accountNumber(n) {
    var number = n.replace("-", "");
    if (number.length == 0)
      return "Your account number can not be empty";
    if (isNaN(number) || !/^(\d{1,6}-)?\d{1,10}$/.test(n))
      return "Invalid number format"
    var digits = Array.from(number, Number);
    digits = Array(ACCOUNT_MAX_SIZE - digits.length).fill(0).concat(digits).reverse();
    var result = 0;
    for (var i = 0; i < ACCOUNT_MAX_SIZE; i++) {
      result += (digits[i] * ((2 ** i) % 11)); //Calculates valid bank number formula
    }
    return result % 11 == 0 ? "" : "Invalid account number";
  }

  static accountBank(n) {
    return BANK_CODES.includes(n) ? "" : "Invalid bank code";
  }

  static validate(account) {
    if (account.length == 0)
      return "Account is required";
    var accountSplitted = account.split("/");
    if (accountSplitted.length < 2)
      return "Your account is missing '/'";
    if (accountSplitted.length > 2)
      return "Your account has to many '/' in it";
    const tmp = this.accountNumber(accountSplitted[0]);
    return tmp ? tmp : this.accountBank(accountSplitted[1])
  }
}