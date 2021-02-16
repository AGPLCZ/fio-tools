import Vue from "vue";
import Vuex from "vuex";
import XLSX from "xlsx";
import Validator from "../utils/validators/Validator";
import parseData from "../utils/parser";
import getOptions from "../utils/options";

Vue.use(Vuex);

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
    payments: [],
    selectedPayments: [],
    columnOrder: JSON.parse(localStorage.getItem("columnOrder")),
  },
  mutations: {
    addPayments(state, path) {
      var data = loadFile(path);
      var options = getOptions(data, state);
      state.payments = parseData(data, options, state).concat(state.payments);
    },

    resetPayments(state) {
      state.payments = [];
    },

    addPayment(state, payment) {
      state.payments.unshift(payment);
    },

    updatePayment(state, payment) {
      state.payments[
        state.payments.findIndex((item) => item.id === payment.id)
      ] = payment;
    },

    removePayment(state, id) {
      var index = state.payments.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.payments.splice(index, 1);
      }
    },

    updatePaymentSelected(state, template) {
      Object.keys(template).forEach((key) => {
        if (template[key] != "" && key != "errors") {
          state.selectedPayments.forEach((item) => {
            item[key] = template[key];
          });
        }
      });
      state.selectedPayments.forEach((item) => {
        item.errors = Validator.validate(item);
      });
      state.selectedPayments = [];
    },

    updateSelected(state, payments) {
      state.selectedPayments = payments;
    },

    updateColumnOrder(state, columnOrder) {
      localStorage.setItem("columnOrder", JSON.stringify(columnOrder));
      state.columnOrder = columnOrder;
    },

    setUser(state, user) {
      localStorage.setItem("user", JSON.stringify(user));
      state.user = user;
    },
  },
  actions: {},
  getters: {
    getPayments(state) {
      return state.payments;
    },
    getSelected(state) {
      return state.selectedPayments;
    },
    getUser(state) {
      return state.user;
    },
    getColumnOrder(state) {
      return state.columnOrder;
    },
  },
});
