import Validator from "../validators/Validator";
import { KS_SIZE, VS_MIN_SIZE, SS_SIZE, DEFAULT_PAYMENT_TYPE } from "../data/constants";
import { getDate } from "../tools";

/**
 * Append zeroes to number that could have been lost in excel
 * @param {number} number 
 * @param {given length} len 
 * @returns number with appended zeroes in the front
 */
function addZeroes(number, len) {
  return !isNaN(number) && number.length && number.length < len
    ? "0".repeat(len - number.length) + number
    : number;
}

/**
 * @param {item of table} item 
 * @returns parse item to string
 */
function toString(item) {
  return item == undefined || item == "undefined" ? "" : "" + item;
}

/**
 * Parse given row, Add zeroes to symbols format account based on parse options
 * @param {given row of table} row 
 * @param {store state} state 
 * @param {parse options} options 
 * @returns payment item
 */
export function getItem(row, state, options) {
  var item = { id: ++state.id };
  var columnIndex = 0;
  var tmp;
  for (var index = 0; index < state.columnOrder.length; index++) {
    tmp = toString(row[index]);
    if (options.account && state.columnOrder[columnIndex].value == "account") {
      tmp = tmp + "/" + addZeroes(toString(row[++index]), 4);
      tmp = tmp.length == 1 ? "" : tmp; // if both empty then empty string
    }
    if (state.columnOrder[columnIndex].value == "ks")
      tmp = addZeroes(tmp, KS_SIZE);
    if (state.columnOrder[columnIndex].value == "vs")
      tmp = addZeroes(tmp, VS_MIN_SIZE);
    if (state.columnOrder[columnIndex].value == "ss")
      tmp = addZeroes(tmp, SS_SIZE);
    item[state.columnOrder[columnIndex].value] = tmp;
    columnIndex++;
  }
  item.type = DEFAULT_PAYMENT_TYPE;
  item.currency = state.user.currency;
  item.date = getDate();
  item.errors = Validator.validate(item);
  return item;
}

/**
 * Create payment item from every row in data
 * If options.header skip first row
 * @param {2d array of excel sheet} array2d
 * @param {json of parse options} options 
 * @param {store state} state 
 * @returns array of payment items
 */
export default function (array2d, options, state) {
  var payments = [];
  array2d.forEach((row, number) => {
    if (options.header && number == 0) return;
    payments.push(getItem(row, state, options));
  });
  return payments;
}
