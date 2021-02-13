import AccountValidator from "./AccountValidator";
import { AMOUNT_MAX_SIZE, KS_SIZE, VS_MAX_SIZE, SS_SIZE } from "../constants";

export default class Validator {
  constructor() {
    if (this instanceof Validator) {
      throw Error('A static class cannot be instantiated.');
    }
  }

  static validateAccount(item){
    return AccountValidator.validate(item)
  }

  static validateNumber(item, maxLen){
    if (isNaN(item))
      return "Invalid number format";
    if (item.length > maxLen)
      return "Number is to long, max length is " + maxLen;
    return "";
  }

  static validateAmount(item){
    if (item.length == 0 || item == "0")
      return "Your amount can not be empty";
    return this.validateNumber(item, AMOUNT_MAX_SIZE)
  }

  static validate(item) {
    item.valid = true;
    const errorMsgs = {
      account: this.validateAccount(item.account),
      amount: this.validateAmount(item.amount),
      ks: this.validateNumber(item.ks, KS_SIZE),
      vs: this.validateNumber(item.vs, VS_MAX_SIZE),
      ss: this.validateNumber(item.ss, SS_SIZE),
    };
    for (let value of Object.values(errorMsgs)) {
      if (value != "") {
        item.valid = false;
        break;
      }
    }
    errorMsgs.id = item.id;

    return errorMsgs;

  }



}