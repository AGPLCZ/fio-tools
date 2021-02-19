import Vue from "vue";
import Vuex from "vuex";
import Validator from "../utils/validators/Validator";
import parseData from "../utils/parser";
import getOptions from "../utils/options";
import { sendData, getUser, loadFile, timer } from "../utils/tools";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    id: 0,
    user: JSON.parse(localStorage.getItem("user")),
    payments: [],
    selectedPayments: [],
    columnOrder: JSON.parse(localStorage.getItem("columnOrder")),
    timer: 0,
  },
  mutations: {
    addPayments(state, path) {
      var data = loadFile(path);
      var options = getOptions(data, state);
      state.payments = parseData(data, options, state).concat(state.payments);
    },

    removeValidPayments(state) {
      state.payments = state.payments.filter((payment) => !payment.valid);
    },

    addPayment(state, payment) {
      state.payments.unshift(payment);
    },

    updatePayment(state, payment) {
      state.payments[state.payments.findIndex((item) => item.id === payment.id)] = payment;
      // to trigger depp change
      var tmp = state.payments;
      state.payments = [];
      state.payments = tmp;
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

    apiCooldown(state, time) {
      if (state.timer == 0) {
        state.timer = time;
        timer(0, state);
      }
    },

    apiCooldownReset(state, time) {
      if (state.timer != 0)
        state.timer = time;
      if (state.timer == 0) {
        state.timer = time;
        timer(0, state);
      }
    }
  },
  actions: {
    async sendData({ state }) {
      return sendData(state);
    },

    async getUser({ commit }, url) {
      return getUser(commit, url)
    }
  },
  getters: {
    getPayments(state) {
      return state.payments;
    },
    getPayments2(state) {
      return state.payments.filter(p => p.valid);
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
    getTimer(state) {
      return state.timer;
    }
  },
});
