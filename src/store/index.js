import Vue from 'vue'
import Vuex from 'vuex'
import XLSX from "xlsx";

Vue.use(Vuex)

function loadFile(path) {
  const file = XLSX.readFile(path);
  return XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    header: 1,
  });
}

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem("user")),
    payments: [],
    columnOrder: ["account", "amount", "ks", "vs", "ss", "messageTo", "messageFrom"]
  },
  mutations: {
    addPayments(state, path) {
      const data = loadFile(path);
      var currentPayments = []
      data.forEach((row) => {
        var item = {};
        for (var i = 0; i < state.columnOrder.length; i++) {
          item[state.columnOrder[i]] = row[i];
        }
        currentPayments.push(item);
      })
      state.payments = currentPayments.concat(state.payments)
    },

    setPayments(state, newPayments) {
      state.payments = newPayments;
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
    getUser(state) {
      return state.user;
    },
  }
})
