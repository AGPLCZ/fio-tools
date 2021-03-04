import XMLBuilder from "./XMLBuilder";
import parseDownloadData from "./parsers/downloadData";
import { FIO_API_PREFIX } from "./data/constants";
import axios from "axios";
import XLSX from "xlsx";

function getFormData(state) {
  var blob = new Blob(
    [XMLBuilder.build(state.payments, state.user.accountId)],
    { type: "text/xml" }
  );
  const formData = new FormData();
  formData.append("type", "xml");
  formData.append("token", localStorage.getItem("token"));
  formData.append("file", blob, "data.xml");
  formData.append("lng", "en");
  return formData;
}

export async function sendData(state) {
  return await axios.post(FIO_API_PREFIX + "/import/", getFormData(state))
    .then((response) => {
      return new window.DOMParser().parseFromString(response.data, "text/xml");
    });

}

export async function downloadData(state, commit, url) {
  return await axios
    .get(url)
    .then((response) => {
      var payments = parseDownloadData(state, response.data.accountStatement.transactionList.transaction).concat(state.payments);
      commit("setPayments", payments);
      return;
    });
}

export async function getUser(commit, url) {
  return await axios
    .get(url, { timeout: 3000 })
    .then((response) => {
      commit("updateUser", response.data.accountStatement.info);
      return;
    });
}

export function loadFile(path) {
  const file = XLSX.readFile(path);
  return XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    header: 1,
  });
}

function fitToColumn(arrayOfArray) {
  // get maximum character of each column
  return arrayOfArray[0].map((a, i) => ({ wch: Math.max(...arrayOfArray.map(a2 => a2[i].toString().length)) }));
}

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

export function createWorkbook(payments, columnOrder, saveHeader) {
  const data = createArrayOfArray(payments, columnOrder, saveHeader);
  const book = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet(data);
  sheet['!cols'] = fitToColumn(data);
  XLSX.utils.book_append_sheet(book, sheet, 'sheet1');
  return book;
}

export function timer(counter, state) {
  if (state.timer > 0) {
    setTimeout(() => {
      state.timer--;
      timer(counter, state);
    }, 1000);
  }
}