import XMLBuilder from "./XMLBuilder";
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

export async function getUser(commit, url) {
    return await axios
        .get(url, { timeout: 3000 })
        .then((response) => {
            commit("setUser", response.data.accountStatement.info);
            return;
        });
}

export function loadFile(path) {
    const file = XLSX.readFile(path);
    return XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
      header: 1,
    });
  }
  
  export function timer(counter, state) {
    if (state.timer > 0) {
      setTimeout(() => {
        state.timer--;
        timer(counter, state);
      }, 1000);
    }
  }