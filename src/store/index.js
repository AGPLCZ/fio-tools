import Vue from "vue";
import Vuex from "vuex";
import Validator from "../utils/validators/Validator";
import parseLoadData from "../utils/parsers/loadData";
import getOptions from "../utils/options";
import { sendData, downloadData, getUser, loadFile, timer } from "../utils/tools";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    id: 0,
    user: JSON.parse(localStorage.getItem("user")),
    payments: [],
    selectedPayments: [],
    columnOrder: JSON.parse(localStorage.getItem("columnOrder")),
    columnCheck: JSON.parse(localStorage.getItem("columnCheck")),
    saveHeader: JSON.parse(localStorage.getItem("saveHeader")),
    timer: 0,
    timerTarget: ""
  },
  mutations: {
    setPayments(state, payments) {
      state.payments = payments;
    },

    addPayments(state, path) {
      var data = loadFile(path);
      var options = getOptions(data, state);
      state.payments = parseLoadData(data, options, state).concat(state.payments);
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

    updateColumnOrder(state, value) {
      localStorage.setItem("columnOrder", JSON.stringify(value));
      state.columnOrder = value;
    },

    updateColumnCheck(state, value) {
      localStorage.setItem("columnCheck", value);
      state.columnCheck = value;
    },

    updateSaveHeader(state, value) {
      localStorage.setItem("saveHeader", value);
      state.saveHeader = value;
    },

    updateUser(state, user) {
      localStorage.setItem("user", JSON.stringify(user));
      state.user = user;
    },

    updateTimerTarget(state, target) {
      state.timerTarget = target;
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

    async downloadData({ commit, state }, url) {
      return downloadData(state, commit, url);
    },

    async getUser({ commit }, url) {
      return getUser(commit, url)
    }
  },
  getters: {
    getPayments(state) {
      return state.payments;
    },
    getSelected(state) {
      return state.selectedPayments;
    },
    getTimer(state) {
      return state.timer;
    },
    getTimerTarget(state) {
      return state.timerTarget;
    },
    getUser(state) {
      return state.user;
    },
    getColumnOrder(state) {
      return state.columnOrder;
    },
    getColumnCheck(state) {
      return state.columnCheck;
    },
    getSaveHeader(state) {
      return state.saveHeader;
    },
  },
});
