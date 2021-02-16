<template>
  <div class="payment">
    <Toolbar v-if="options == 1" title="Edit payment" />
    <Toolbar v-else title="Add payment" />

    <v-form ref="form" v-model="valid">
      <v-container>
        <v-row class="pa-3">
          <v-text-field
            :disabled="options == 2"
            color="orange"
            v-model="payment.account"
            label="Account"
            :rules="[() => !errors.account || errors.account]"
          ></v-text-field>
        </v-row>

        <v-row class="pa-3">
          <v-text-field
            color="orange"
            v-model="payment.amount"
            label="Amount"
            :rules="[() => !errors.amount || errors.amount]"
          ></v-text-field>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              color="orange"
              v-model="payment.ks"
              label="Constant symbol"
              :rules="[() => !errors.ks || errors.ks]"
              :counter="ksMaxSize"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              color="orange"
              v-model="payment.vs"
              label="Variable symbol"
              :rules="[() => !errors.vs || errors.vs]"
              :counter="vsMaxSize"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              color="orange"
              v-model="payment.ss"
              label="Symbolic symbol"
              :rules="[() => !errors.ss || errors.ss]"
              :counter="ssMaxSize"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              color="orange"
              v-model="payment.messageFrom"
              label="Message to you"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              color="orange"
              v-model="payment.messageTo"
              label="Message to receiver"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-autocomplete
              color="orange"
              v-model="payment.currency"
              :items="currencies"
              label="Currencies"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete
              color="orange"
              v-model="payment.type"
              :items="types"
              item-text="text"
              item-value="value"
              label="PaymentType"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row class="pa-3">
          <v-btn
            v-if="options == 0"
            color="success"
            class="mr-4"
            @click="addPayment"
          >
            Add payment
          </v-btn>
          <v-btn
            v-if="options == 1"
            color="success"
            class="mr-4"
            @click="editPayment"
          >
            Edit payment
          </v-btn>

          <v-btn
            v-if="options == 2"
            color="success"
            class="mr-4"
            @click="editSelected"
          >
            Edit selected
          </v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import Vue from "vue";
import Toolbar from "../components/Toolbar.vue";
import Validator from "../utils/validators/Validator";
import { PAYMENT_PROPS, CURRENCIES, PAYMENT_TYPE } from "../utils/data";
import { KS_SIZE, VS_MAX_SIZE, SS_SIZE, FORM_OPTION } from "../utils/constants";

export default Vue.extend({
  name: "Payment",

  components: {
    Toolbar,
  },

  data: () => ({
    valid: true,
    payment: {},
    errors: {},
    ksMaxSize: KS_SIZE,
    vsMaxSize: VS_MAX_SIZE,
    ssMaxSize: SS_SIZE,
    currencies: CURRENCIES,
    types: PAYMENT_TYPE,
  }),

  computed: {
    options() {
      return this.$route.params.id == undefined
        ? FORM_OPTION.ADD
        : this.$route.params.id == Infinity
        ? FORM_OPTION.MULTIPLE_EDIT
        : FORM_OPTION.EDIT;
    },
  },

  mounted() {
    if (this.options == FORM_OPTION.EDIT) this.setPayment();
    else this.setPaymentEmpty();
  },

  methods: {
    setPayment() {
      this.payment = Object.assign(
        {},
        this.$store.getters.getPayments.find(
          (p) => p.id == this.$route.params.id
        )
      );
      this.errors = this.payment.errors;
    },

    setPaymentEmpty() {
      this.payment = {};
      for (var i = 0; i < PAYMENT_PROPS.length; i++) {
        this.payment[PAYMENT_PROPS[i].value] = "";
      }
      if (this.options == FORM_OPTION.ADD) {
        this.payment.currency = this.$store.getters.getUser.currency;
        this.payment.type = PAYMENT_TYPE[0].value;
      }
    },

    addPayment() {
      this.errors = Validator.validate(this.payment);
      this.payment.errors = this.errors;
      if (this.$refs.form.validate()) {
        this.$store.commit("addPayment", this.payment);
        this.$router.back();
      }
    },

    editPayment() {
      this.errors = Validator.validate(this.payment);
      this.payment.errors = this.errors;
      if (this.$refs.form.validate()) {
        this.$store.commit("updatePayment", this.payment);
        this.$router.back();
      }
    },

    editSelected() {
      this.errors = Validator.validateSelected(this.payment);
      this.payment.errors = this.errors;
      if (this.$refs.form.validate()) {
        this.$store.commit("updatePaymentSelected", this.payment);
        this.$router.back();
      }
    },

    removePayment() {
      this.$store.commit("removePayment", this.payment.id);
      this.$router.back();
    },
  },
});
</script>

<style>
