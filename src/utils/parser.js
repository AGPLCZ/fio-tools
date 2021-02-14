import Validator from "./validators/Validator";
import { KS_SIZE, VS_MIN_SIZE, SS_SIZE } from "./constants";

function addZeroes(num, len) {
  return !isNaN(num) && num.length && num.length < len ? "0".repeat(len - num.length) + num : num;
}

function toString(item) {
  return (item == undefined || item == "undefined") ? "" : "" + item;
}

export function getItem(row, state, options) {
  var item = { id: ++state.id };
  var j = 0;
  var tmp;
  for (var i = 0; i < state.columnOrder.length; i++) {
    tmp = toString(row[i]);
    if (options.account && state.columnOrder[j] == "account") {
      tmp = tmp + "/" + addZeroes(toString(row[++i]), 4);
      tmp = tmp.length == 1 ? "" : tmp; // if both empty then empty string
    }
    if (state.columnOrder[j] == "ks")
      tmp = addZeroes(tmp, KS_SIZE)
    if (state.columnOrder[j] == "vs")
      tmp = addZeroes(tmp, VS_MIN_SIZE)
    if (state.columnOrder[j] == "ss")
      tmp = addZeroes(tmp, SS_SIZE)
    item[state.columnOrder[j]] = tmp;
    j++;
  }
  return item;
}

function loadData(data, options, state) {
  var payments = [];
  data.forEach((row, number) => {
    if (options.header && number == 0)
      return;
    var item = getItem(row, state, options);

    item.errors = Validator.validate(item);
    payments.push(item);
  })
  return payments;
}

export default function (data, options, state) {
  return loadData(data, options, state);
}