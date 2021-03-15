import Vue from "vue";
import Vuex from "vuex";
import Validator from "../utils/validators/Validator";
import arrayParse from "../utils/parsers/arrayParse";
import getOptions from "../utils/options";
import { sendData, getDataBank, getDataGoogle, getUser, loadFile, timer } from "../utils/tools";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    payments: [],
    selectedPayments: [],
    // id of last payment
    id: 0,
    // user information such as bank account, currency
    user: JSON.parse(localStorage.getItem("user")),
    columnOrder: JSON.parse(localStorage.getItem("columnOrder")) ?? {},
    // settings: column dialog before data load
    columnCheck: JSON.parse(localStorage.getItem("columnCheck")),
    // settings: save with header
    saveHeader: JSON.parse(localStorage.getItem("saveHeader")),
    // timer value
    timer: 0,
  },
  mutations: {
    /**
     * Set payments
     * @param {array of payment items} payments 
     */
    setPayments(state, payments) {
      state.payments = payments;
    },

    /**
     * Load file, get parse options and concat this new payments at the beginning of state.payments
     * @param {filepath} path 
     */
    addPayments(state, path) {
      var array2d = loadFile(path);
      var options = getOptions(array2d, state);
      state.payments = arrayParse(array2d, options, state).concat(state.payments);
    },

    /**
     * Insert new item at the beginning of state.payments
     * @param {payment item} payment 
     */
    addPayment(state, payment) {
      state.payments.unshift(payment);
    },

    /**
     * Update given payment
     * HACK!! changing state.payments to trigger watch event in vue components
     * @param {payment item} payment 
     */
    updatePayment(state, payment) {
      state.payments[state.payments.findIndex((item) => item.id === payment.id)] = payment;
      var tmp = state.payments;
      state.payments = [];
      state.payments = tmp;
    },

    /**
     * Remove element with given id
     * @param {id of payment item} id 
     */
    removePayment(state, id) {
      var index = state.payments.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.payments.splice(index, 1);
      }
    },

    /**
     * Foreach selected payment change values based on template
     * Foreach selected payment update errors property
     * @param {template with params that should change} template 
     */
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

     /**
     * Set selectedPayments
     * @param {array of payment items} payments 
     */
    setSelected(state, payments) {
      state.selectedPayments = payments;
    },

     /**
     * Set columnOrder and store it to localStorage
     * @param {new columnOrder value} value 
     */
    updateColumnOrder(state, value) {
      localStorage.setItem("columnOrder", JSON.stringify(value));
      state.columnOrder = value;
    },

      /**
     * Set columnCheck and store it to localStorage
     * @param {new columnCheck value} value 
     */
    updateColumnCheck(state, value) {
      localStorage.setItem("columnCheck", value);
      state.columnCheck = value;
    },

    /**
     * Set saveHeader and store it to localStorage
     * @param {new saveHeader value} value 
     */
    updateSaveHeader(state, value) {
      localStorage.setItem("saveHeader", value);
      state.saveHeader = value;
    },

    /**
     * Set user and store it to localStorage
     * @param {new user value} user 
     */
    updateUser(state, user) {
      localStorage.setItem("user", JSON.stringify(user));
      state.user = user;
    },

    /**
     * If timer isn't running start countdown
     * @param {time for the timer} time 
     */
    apiCooldown(state, time) {
      if (state.timer == 0) {
        state.timer = time;
        timer(state);
      }
    },

    /**
     * if timer running reset time otherwise start new timer
     * @param {time for the timer} time 
     */
    apiCooldownReset(state, time) {
      if (state.timer != 0)
        state.timer = time;
      if (state.timer == 0) {
        state.timer = time;
        timer(state);
      }
    }
  },
  actions: {
    async sendData({ state }) {
      return sendData(state);
    },

    async getDataBank({ state }, url) {
      return getDataBank(state, url);
    },

    async getDataGoogle({ state }, url) {
      return getDataGoogle(state, url);
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
