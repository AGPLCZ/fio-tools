import Validator from "./validators/Validator";
import { KS_SIZE, VS_MIN_SIZE, SS_SIZE } from "./data/constants";
import { PAYMENT_TYPE } from "./data/collections";

function addZeroes(num, len) {
  return !isNaN(num) && num.length && num.length < len
    ? "0".repeat(len - num.length) + num
    : num;
}

function toString(item) {
  return item == undefined || item == "undefined" ? "" : "" + item;
}

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
  item.currency = state.user.currency;
  item.type = PAYMENT_TYPE[0].value;
  return item;
}

function loadData(data, options, state) {
  var payments = [];
  data.forEach((row, number) => {
    if (options.header && number == 0) return;
    var item = getItem(row, state, options);

    item.errors = Validator.validate(item);
    payments.push(item);
  });
  return payments;
}

export default function (data, options, state) {
  return loadData(data, options, state);
}
