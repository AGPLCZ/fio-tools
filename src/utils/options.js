import Validator from "./validators/Validator";
import { getItem } from "./parser";

function getAccountType(data, state) {
  var x = 0;
  data.forEach((row) => {
    for (var index = 0; index < state.columnOrder.length; index++) {
      if (state.columnOrder[index].value == "account") {
        row[index] = "" + row[index];
        x = Validator.validateAccount(row[index]) != "" ? x + 1 : x - 1;
      }
    }
  });
  return x > 0;
}

function hasHeader(firstRow, state, options) {
  var item = getItem(firstRow, state, options);
  var errors = Validator.validate(item);
  return Object.keys(errors).every(function (key) {
    return errors[key] != "" || item[key] == "";
  });
}

export default function (data, state) {
  var options = {};
  options.account = getAccountType(data, state);
  options.header = hasHeader(data[0], state, options);
  return options;
}
