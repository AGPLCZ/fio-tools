import getOptions from "../options";
import arrayParse from "./arrayParse";

/**
 * Builds 2d array from given json and then gets option and parse to payment item format
 * if formattedValue means value is present else extract userEntered value
 * @param {store state} state 
 * @param {payments in json format from google sheet API} data 
 * @returns 
 */
export default function (state, data) {
    var array2d = [];
    var correction;
    data.forEach((row) => {
        array2d.push([]);
        correction = 0;
        row.values.forEach((item) => {
            if (item.formattedValue){
                var key = Object.keys(item.userEnteredValue)[0];
                array2d[array2d.length-1].push(item.userEnteredValue[key]);
            }
            else {
                array2d[array2d.length-1].push("")
                correction++;
            }
        })
        if(correction == row.values.length){
            array2d.pop();
        }
    })
    var options = getOptions(array2d, state);
    return arrayParse(array2d, options, state);
}