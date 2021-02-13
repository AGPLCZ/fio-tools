import {BANK_CODES} from "../data";

export default class AccountValidator {
  constructor() {
    if (this instanceof AccountValidator) {
      throw Error('A static class cannot be instantiated.');
    }
  }

  static accountNumber(n) {
    var number = n.toString().replace("-", "");
    if (number.length == 0)
      return "Your account number can not be empty";
    if (isNaN(number))
      return "Invalid number format"
    var digits = Array.from(number, Number);
    digits = Array(16 - digits.length).fill(0).concat(digits).reverse();
    var result = 0;
    for (var i = 0; i < 16; i++) {
      result += (digits[i] * ((2 ** i) % 11));
    }
    return result % 11 == 0 ? "" : "Invalid account number";
  }

  static accountBank(n) {
    return BANK_CODES.includes(n) ? "" : "Invalid bank code";
  }

  static validate(account) {
    if (account.length == 0)
      return "Your account can not be empty";
    var accountSplited = account.split("/");
    if (accountSplited.length < 2)
      return "Your account is missing '/'";
    if (accountSplited.length > 2)
      return "Your account has to many '/' in it";
    const tmp = this.accountNumber(accountSplited[0]);
    return tmp ? tmp : this.accountBank(accountSplited[1])
  }
}