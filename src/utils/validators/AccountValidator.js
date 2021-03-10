import { BANK_CODES } from "../data/collections";
import { ACCOUNT_MAX_SIZE } from "../data/constants";
import i18n from "../../i18n";

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
      return i18n.t("validator.account.invalidNumber")
    var digits = Array.from(number, Number);
    digits = Array(ACCOUNT_MAX_SIZE - digits.length).fill(0).concat(digits).reverse();
    var result = 0;
    for (var i = 0; i < ACCOUNT_MAX_SIZE; i++) {
      result += (digits[i] * ((2 ** i) % 11)); //Calculates valid bank number formula
    }
    return result % 11 == 0 ? "" : i18n.t("validator.account.invalidAccount");
  }

  /**
  * Check if BANK_CODES includes "bank"
  * @param {bank code} bank 
  * @returns specific error message
  */
  static accountBank(bank) {
    return BANK_CODES.includes(bank) ? "" : i18n.t("validator.account.invalidCode");
  }

  /**
   * Check account number and its bank code, return first error message that is found
   * @param {account as string} account 
   * @param {if true account is not required} filter 
   * @returns specific error message
   */
  static validate(account, filter) {
    if (account.length == 0)
      return filter ? "" : i18n.t("validator.account.required");
    var accountSplitted = account.split("/");
    if (accountSplitted.length < 2)
      return i18n.t("validator.account.hasSlash");
    if (accountSplitted.length > 2)
      return i18n.t("validator.account.toManySlash");
    const tmp = this.accountNumber(accountSplitted[0]);
    return tmp ? tmp : this.accountBank(accountSplitted[1])
  }
}