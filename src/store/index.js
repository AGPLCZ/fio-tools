import Vue from 'vue'
import Vuex from 'vuex'
import XLSX from "xlsx";
import parseData from "../utils/parser"
import getOptions from "../utils/options";

Vue.use(Vuex)

function loadFile(path) {
  const file = XLSX.readFile(path);
  return XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    header: 1,
  });
}

export default new Vuex.Store({
  state: {
    id: 0,
    user: JSON.parse(localStorage.getItem("user")),
    payments: {
      items: [],
      errors: []
    },
    columnOrder: ["account", "amount", "ks", "vs", "ss", "messageTo", "messageFrom"]
  },
  mutations: {
    addPayments(state, path) {
      var data = loadFile(path);
      var options = getOptions(data, state);
      var payments = parseData(data, options, state);
      state.payments.items = payments.items.concat(state.payments.items)
      state.payments.errors = payments.errors.concat(state.payments.errors)
    },

    setPayments(state, newPayments) {
      state.payments.items = newPayments;
    },

    setUser(state, user) {
      localStorage.setItem("user", JSON.stringify(user));
      state.user = user;
    }
  },
  actions: {

  },
  getters: {
    getPayments(state) {
      return state.payments;
    },
    isPaymentsEmpty(state) {
      return state.payments.items.length;
    },
    getUser(state) {
      return state.user;
    },
  }
})
