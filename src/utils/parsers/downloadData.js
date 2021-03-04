import { PAYMENT_PROPS, PAYMENT_TYPE } from "../data/collections";
import Validator from "../validators/Validator";

function getValue(object) {
    return object == null ? null : object.value;
}

export function getItem(state, transaction) {
    var item = { id: ++state.id };
    item[PAYMENT_PROPS[0].value] = getValue(transaction.column2) + "/" + getValue(transaction.column3);
    item[PAYMENT_PROPS[1].value] = getValue(transaction.column1) * (-1);
    item[PAYMENT_PROPS[2].value] = getValue(transaction.column4);
    item[PAYMENT_PROPS[3].value] = getValue(transaction.column5);
    item[PAYMENT_PROPS[4].value] = getValue(transaction.column6);
    item[PAYMENT_PROPS[5].value] = getValue(transaction.column16);
    item[PAYMENT_PROPS[6].value] = getValue(transaction.column7);
    item.currency = getValue(transaction.column14);
    item.type = PAYMENT_TYPE[0].value;
    item.errors = Validator.validate(item);
    return item;

}

export default function (state, transactions) {
    var payments = [];
    transactions.forEach((transaction) => {
        if (transaction.column2 != null)
            payments.push(getItem(state, transaction));
    })
    return payments;
}