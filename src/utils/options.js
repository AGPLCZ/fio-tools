import Validator from "./validators/Validator";
import {getItem} from "./parser";

function getAccountType(data, state) {
  var x = 0;
  data.forEach((row) => {
    for (var i = 0; i < state.columnOrder.length; i++) {
      if (state.columnOrder[i] == "account") {
        row[i] = "" + row[i];
        x = (Validator.validateAccount(row[i]) != "") ? x + 1 : x - 1;
      }
    }
  });
  return x > 0;
}

function hasHeader(firstRow, state, options) {
  var errors = Validator.validate(getItem(firstRow, state, options));
  return Object.keys(errors).every(function (key) {
    return errors[key] != "";
  });
}


export default function (data, state) {
  var options = {};
  options.account = getAccountType(data, state);
  options.header = hasHeader(data[0], state, options)
  return options;
}