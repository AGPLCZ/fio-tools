import Vue from 'vue'
import Vuex from 'vuex'
import XLSX from "xlsx";
import parseData from "../utils/parser"
import getOptions from "../utils/options";
import {PAYMENT_PROPS} from "../utils/constants";

Vue.use(Vuex)

function loadFile(path) {
  const file = XLSX.readFile(path);
  return XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    header: 1,
  });
}

function arrayUpdate(array, item) {
  array[array.findIndex(i => i.id === item.id)] = item;
  return array;
}

function arrayRemove(array, item) {
  var index = array.findIndex(i => i.id === item.id);
  if (index !== -1) {
    array.splice(index, 1);
  }
  return array;
}

export default new Vuex.Store({
  state: {
    id: 0,
    user: JSON.parse(localStorage.getItem("user")),
    payments: {
      items: [],
      errors: []
    },
    columnOrder: PAYMENT_PROPS
  },
  mutations: {
    addPayments(state, path) {
      var data = loadFile(path);
      var options = getOptions(data, state);
      var payments = parseData(data, options, state);
      state.payments.items = payments.items.concat(state.payments.items)
      state.payments.errors = payments.errors.concat(state.payments.errors)
    },

    resetPayments(state) {
      state.payments.items = [];
      state.payments.errors = [];
    },

    addPayment(state, payload) {
      state.payments.items.unshift(payload.item);
      state.payments.errors.unshift(payload.errors);
    },

    updatePayment(state, payload) {
      state.payments.items = arrayUpdate(state.payments.items, payload.item);
      state.payments.errors = arrayUpdate(state.payments.errors, payload.errors);
    },

    removePayment(state, payload) {
      state.payments.items = arrayRemove(state.payments.items, payload.item);
      state.payments.errors = arrayRemove(state.payments.errors, payload.errors);
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
