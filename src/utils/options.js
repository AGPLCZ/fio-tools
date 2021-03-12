import Validator from "./validators/Validator";
import { getItem } from "./parsers/arrayParse";

/**
 * Check all account and tries to validate then if more than half of the validations
 * fails assume that user uses payment and bank id in different column
 * @param {payments as 2d array} array2d 
 * @param {store state} state 
 * @returns true if account format is one cell false if it is in two cells
 */
function getAccountType(array2d, state) {
  var tmp = 0;
  array2d.forEach((row) => {
    for (var index = 0; index < state.columnOrder.length; index++) {
      if (state.columnOrder[index].value == "account") {
        row[index] = "" + row[index];
        tmp = Validator.validateAccount(row[index]) != "" ? tmp + 1 : tmp - 1;
      }
    }
  });
  return tmp > 0;
}

/**
 * Tries to validate all param in first line and if all fails assume it is header and returns boolean
 * @param {first row of payments as 2d array} firstRow 
 * @param {store state} state 
 * @param {options with account type} options 
 * @returns true if it has header false otherwise
 */
function hasHeader(firstRow, state, options) {
  var item = getItem(firstRow, state, options);
  var errors = Validator.validate(item);
  return Object.keys(errors).every(function (key) {
    return errors[key] != "" || item[key] == "";
  });
}

/**
 * @param {payments as 2d array} array2d 
 * @param {store state} state 
 * @returns options object with account and header option
 */
export default function (array2d, state) {
  var options = {};
  options.account = getAccountType(array2d, state);
  options.header = hasHeader(array2d[0], state, options);
  return options;
}
