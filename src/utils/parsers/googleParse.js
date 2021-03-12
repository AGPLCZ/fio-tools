import { PAYMENT_PROPS } from "../data/collections";
import getOptions from "../options";
import arrayParse from "./arrayParse";

/**
 * Builds 2d array from given json and then gets option and parse to payment item format
 * @param {store state} state 
 * @param {payments in json format from google sheet API} data 
 * @returns 
 */
export default function (state, data) {
    var array2d = [];
    var count = 0;
    data.forEach((item) => {
        if (count % PAYMENT_PROPS.length == 0)
            array2d.push([]);
        array2d[array2d.length -1].push(item.content.$t);
        count++;
    })
    var options = getOptions(array2d, state);
    return arrayParse(array2d, options, state);
}