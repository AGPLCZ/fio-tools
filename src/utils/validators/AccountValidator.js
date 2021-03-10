import { BANK_CODES } from "../data/collections";
import { ACCOUNT_MAX_SIZE } from "../data/constants";

export default class AccountValidator {
  constructor() {
    if (this instanceof AccountValidator) {
      throw Error('A static class cannot be instantiated.');
    }
  }


  /**
   * Validate number based on regex and then based on algorith via
   * https://www.rtsoft.cz/jak-validovat-cislo-uctu-platne-v-cr/
   * @param {number as string} n 
   * @returns specific error message
   */
  static accountNumber(n) {
    var number = n.replace("-", "");
    if (!/^(\d{1,6}-)?\d{1,10}$/.test(n))
      return "Invalid number format"
    var digits = Array.from(number, Number);
    digits = Array(ACCOUNT_MAX_SIZE - digits.length).fill(0).concat(digits).reverse();
    var result = 0;
    for (var i = 0; i < ACCOUNT_MAX_SIZE; i++) {
      result += (digits[i] * ((2 ** i) % 11)); //Calculates valid bank number formula
    }
    return result % 11 == 0 ? "" : "Invalid account number";
  }

  /**
  * Check if BANK_CODES includes "bank"
  * @param {bank code} bank 
  * @returns specific error message
  */
  static accountBank(bank) {
    return BANK_CODES.includes(bank) ? "" : "Invalid bank code";
  }

  /**
   * Check account number and its bank code, return first error message that is found
   * @param {account as string} account 
   * @param {if true account is not required} filter 
   * @returns specific error message
   */
  static validate(account, filter) {
    if (account.length == 0)
      return filter ? "" : "Account is required";
    var accountSplitted = account.split("/");
    if (accountSplitted.length < 2)
      return "Your account is missing '/'";
    if (accountSplitted.length > 2)
      return "Your account has to many '/' in it";
    const tmp = this.accountNumber(accountSplitted[0]);
    return tmp ? tmp : this.accountBank(accountSplitted[1])
  }
}