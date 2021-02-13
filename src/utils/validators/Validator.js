import AccountValidator from "./AccountValidator";

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
      return "Number is to long";
    return "";
  }

  static validateAmount(item){
    if (item.length == 0 || item == "0")
      return "Your amount can not be empty";
    return this.validateNumber(item, 18)
  }

  static validate(item) {
    item.valid = true;
    const errorMsgs = {
      //TODO rest param validation
      account: this.validateAccount(item.account),
      amount: this.validateAmount(item.amount),
      ks: this.validateNumber(item.ks, 4),
      vs: this.validateNumber(item.vs, 10),
      ss: this.validateNumber(item.ss, 10),
    };
    // console.log(errorMsgs);
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