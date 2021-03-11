import XMLBuilder from "./XMLBuilder";
import parseDownloadData from "./parsers/downloadData";
import { FIO_API_PREFIX } from "./data/constants";
import axios from "axios";
import XLSX from "xlsx";

/**
 * Create Blob with payments in xml format because the API accepts file as param
 * and blob behaves as file in this situation
 * @param {store state} state 
 * @returns Form data necessary for Post request
 */
function getFormData(state) {
  var blob = new Blob(
    [XMLBuilder.build(state.payments, state.user.accountId)],
    { type: "text/xml" }
  );
  const formData = new FormData();
  formData.append("type", "xml");
  formData.append("token", localStorage.getItem("token"));
  formData.append("file", blob, "data.xml");
  formData.append("lng", localStorage.getItem("lang"));
  return formData;
}

/**
 * Send given payment to API. POST request.
 * @param {store state} state 
 * @returns request respond as xml object
 */
export async function sendData(state) {
  return await axios.post(FIO_API_PREFIX + "/import/", getFormData(state))
    .then((response) => {
      return new window.DOMParser().parseFromString(response.data, "text/xml");
    });

}

/**
 * Get data from API and then parse them to "payment" format
 * @param {store state} state 
 * @param {API url} url 
 * @returns payments as array of json objects
 */
export async function downloadData(state, url) {
  return await axios
    .get(url)
    .then((response) => {
      return parseDownloadData(state, response.data.accountStatement.transactionList.transaction);
    });
}

/**
 * Get data from API with 3 sec timeout in case of invalid "url"(token)
 * if successful update user data in store
 * @param {store commit} commit 
 * @param {API url} url 
 * @returns empty
 */
export async function getUser(commit, url) {
  return await axios
    .get(url, { timeout: 3000 })
    .then((response) => {
      commit("updateUser", response.data.accountStatement.info);
      return;
    });
}

/**
 * Parse sheet format to 2d array
 * @param {filepath} path 
 * @returns 2d array as table
 */
export function loadFile(path) {
  const file = XLSX.readFile(path);
  return XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    header: 1,
  });
}

/**
 * Set with of column based on the longest element in it
 * @param {data as 2d array} arrayOfArray 
 * @returns get maximum character of each column
 */
function fitToColumn(arrayOfArray) {
  return arrayOfArray[0].map((a, i) => ({ wch: Math.max(...arrayOfArray.map(a2 => a2[i].toString().length)) }));
}

/**
 * @param {payments as array of payment items} payments 
 * @param {order of columns in which it the 2d array should be build} columnOrder 
 * @param {if it should have header or not} saveHeader 
 * @returns 2d array of payments based on "columnOrder" and "saveHeader" params
 */
function createArrayOfArray(payments, columnOrder, saveHeader) {
  const data = [];
  if (saveHeader) {
    const row = [];
    columnOrder.forEach((column) => {
      row.push(column.text);
    });
    data.push(row);
  }
  payments.forEach((payment) => {
    const row = [];
    columnOrder.forEach((column) => {
      row.push(payment[column.value]);
    });
    data.push(row);
  });
  return data;
}

/**
 * @param {payments as array of payment items} payments 
 * @param {order of columns in which it the 2d array should be build} columnOrder 
 * @param {if it should have header or not} saveHeader 
 * @returns sheets book with all given payments based on "columnOrder" and "saveHeader" params
 */
export function createWorkbook(payments, columnOrder, saveHeader) {
  const data = createArrayOfArray(payments, columnOrder, saveHeader);
  const book = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet(data);
  sheet['!cols'] = fitToColumn(data);
  XLSX.utils.book_append_sheet(book, sheet, 'sheet1');
  return book;
}

/**
 * Timer subtract 1 every second from state.timer
 * @param {store state} state 
 */
export function timer(state) {
  if (state.timer > 0) {
    setTimeout(() => {
      state.timer--;
      timer(state);
    }, 1000);
  }
}

/**
 * If it is past 23:50 set date to tomorrow
 * @param {date to parse} date 
 * @returns date with specific format
 */
export function getDate(date = new Date()) {
  var maxDate = new Date();
  maxDate.setHours(23, 50);
  if ((date > maxDate) && date.getDate() == maxDate.getDate()) {
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  }
  // toISOString ignores timezone 
  date.setHours(date.getHours() + 1);
  return date.toISOString().slice(0, 10);
}