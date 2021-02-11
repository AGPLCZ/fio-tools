import AccountValidator from "./AccountValidator";

export default class Validator {
  constructor() {
    if (this instanceof Validator) {
      throw Error('A static class cannot be instantiated.');
    }
  }

  static validate(item) {
    item.valid = true;
    const errorMsgs = {
      //TODO rest param validation
      account: AccountValidator.validate(item.account),
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