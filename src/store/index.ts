import Vue from 'vue'
import Vuex from 'vuex'
import XLSX from "xlsx";

Vue.use(Vuex)

function loadFile(path: string): unknown[] {
  const file = XLSX.readFile(path);
  return XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    header: 1,
  });
}

export default new Vuex.Store({
  state: {
    payments: [],
  },
  mutations: {
    addPayments(state, path) {
      console.log(loadFile(path));
      state.payments = [];
    },
  },
  actions: {
  },
  modules: {
  }
})
