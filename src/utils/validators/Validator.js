import AccountValidator from "./AccountValidator";
import { AMOUNT_MAX_SIZE, KS_SIZE, VS_MAX_SIZE, SS_SIZE } from "../data/constants";
import i18n from "../../i18n";

export default class Validator {
  constructor() {
    if (this instanceof Validator) {
      throw Error('A static class cannot be instantiated.');
    }
  }

/**
 * Check if account is in valid format
 * @param {account string} account 
 * @param {true if it is used in filter window default false} filter 
 * @returns specific error message
 */
  static validateAccount(account, filter = false) {
    return AccountValidator.validate(account, filter)
  }

  /**
   * Check if it is number and if it is long enough
   * @param {number} number 
   * @param {maximum length} maxLen 
   * @returns specific error message
   */
  static validateNumber(number, maxLen) {
    if (isNaN(number)){
      return i18n.t("validator.number.invalid");
    }
    if (number.length > maxLen)
      return i18n.t("validator.number.long"); + maxLen;
    return "";
  }

  /**
   * Check if it is not empty and then if it is valid number
   * @param {amount number} amount 
   * @returns specific error message
   */
  static validateAmount(amount) {
    if (amount.length == 0 || amount == "0")
      return i18n.t("validator.amount.required");
    return this.validateNumber(amount, AMOUNT_MAX_SIZE)
  }

  /**
   * Create json of error messages with params used with selection
   * @param {payment as json} payment
   * @returns json object of specific error message
   */
  static validateSelected(payment) {
    const errorMsgs = {
      amount: this.validateNumber(payment.amount, AMOUNT_MAX_SIZE),
      ks: this.validateNumber(payment.ks, KS_SIZE),
      vs: this.validateNumber(payment.vs, VS_MAX_SIZE),
      ss: this.validateNumber(payment.ss, SS_SIZE),
    };
    return errorMsgs;
  }

  /**
   * Create json of error messages with all params, set param valid based on "errorMsg"
   * if all empty then tru otherwise false
   * @param {payment as json} payment
   * @returns json object of specific error message
   */
  static validate(payment) {
    payment.valid = true;
    const errorMsgs = {
      account: this.validateAccount(payment.account),
      amount: this.validateAmount(payment.amount),
      ks: this.validateNumber(payment.ks, KS_SIZE),
      vs: this.validateNumber(payment.vs, VS_MAX_SIZE),
      ss: this.validateNumber(payment.ss, SS_SIZE),
    };
    for (let value of Object.values(errorMsgs)) {
      if (value != "") {
        payment.valid = false;
        break;
      }
    }
    return errorMsgs;
  }
}