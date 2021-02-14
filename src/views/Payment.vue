<template>
  <div class="payment">
    <Toolbar v-if="exists" title="Edit payment" />
    <Toolbar v-else title="Add payment" />

    <v-form ref="form" v-model="valid">
      <v-container>
        <v-row class="pa-3">
          <v-text-field
            v-model="payment.account"
            label="Account"
            :rules="[() => !errors.account || errors.account]"
            required
          ></v-text-field>
        </v-row>

        <v-row class="pa-3">
          <v-text-field
            v-model="payment.amount"
            label="Amount"
            :rules="[() => !errors.amount || errors.amount]"
            required
          ></v-text-field>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              v-model="payment.ks"
              label="Constant symbol"
              :rules="[() => !errors.ks || errors.ks]"
              :counter="ksMaxSize"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="payment.vs"
              label="Variable symbol"
              :rules="[() => !errors.vs || errors.vs]"
              :counter="vsMaxSize"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
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
              v-model="payment.messageFrom"
              label="Message to you"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="payment.messageTo"
              label="Message to receiver"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row class="pa-3" v-if="exists">
          <v-btn color="success" class="mr-4" @click="editPayment">
            Edit payment
          </v-btn>

          <v-btn color="error" class="mr-4" @click="removePayment">
            Remove payment
          </v-btn>
        </v-row>

        <v-row class="pa-3" v-else>
          <v-btn color="success" class="mr-4" @click="addPayment">
            Add payment
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
import {
  PAYMENT_PROPS,
  KS_SIZE,
  VS_MAX_SIZE,
  SS_SIZE,
} from "../utils/constants";

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
  }),

  computed: {
    exists() {
      return this.$route.params.id != undefined;
    },
  },

  mounted() {
    if (this.exists) this.setPayment();
    else this.setPaymentEmpty();
  },

  methods: {
    setPayment() {
      this.payment = Object.assign(
        {},
        this.$store.getters.getPayments.items.find(
          (p) => p.id == this.$route.params.id
        )
      );
      this.errors = this.$store.getters.getPayments.errors.find(
        (p) => p.id == this.$route.params.id
      );
    },

    setPaymentEmpty() {
      for (var i = 0; i < PAYMENT_PROPS.length; i++) {
        this.payment[PAYMENT_PROPS[i]] = "";
      }
    },

    addPayment() {
      this.errors = Validator.validate(this.payment);
      if (this.$refs.form.validate()) {
        this.$store.commit("addPayment", {
          item: this.payment,
          errors: this.errors,
        });
        this.$router.back();
      }
    },

    editPayment() {
      this.errors = Validator.validate(this.payment);
      if (this.$refs.form.validate()) {
        this.$store.commit("updatePayment", {
          item: this.payment,
          errors: this.errors,
        });
        this.$router.back();
      }
    },

    removePayment() {
      this.$store.commit("removePayment", {
        item: this.payment,
        errors: this.errors,
      });
      this.$router.back();
    },
  },
});
</script>

<style>
