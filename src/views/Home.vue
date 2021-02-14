<template>
  <div class="home">
    <v-toolbar flat>
      <v-chip
        v-if="!valid"
        class="ma-2"
        :color="isPaymentsEmpty ? 'green' : 'grey'"
        text-color="white"
        @click="setInvalid"
        :disabled="isPaymentsEmpty == 0"
      >
        All Data
      </v-chip>

      <v-chip
        v-else
        class="ma-2"
        :color="isPaymentsEmpty ? 'red' : 'grey'"
        text-color="white"
        @click="setInvalid"
        :disabled="isPaymentsEmpty == 0"
      >
        Invalid Data
      </v-chip>

      <v-spacer></v-spacer>

      <v-btn color="orange" dark class="mb-2" @click="addPayment">
        New Item
      </v-btn>
    </v-toolbar>
    <v-data-table
      dense
      :headers="headers"
      :items="items"
      hide-default-footer
      disable-pagination
      class="elevation-1"
      :class="{ 'row-pointer': isPaymentsEmpty }"
      @click:row="viewDetail"
    >
      <template v-slot:[`item.account`]="{ item }">
        <div :class="{ 'error--text': isAccountInvalid(item.id) }">
          <v-icon small color="error" v-if="item.account == ''"
            >mdi-alert-circle-outline</v-icon
          >{{ item.account }}
        </div>
      </template>

      <template v-slot:[`item.amount`]="{ item }">
        <div v-if="!isAmountInvalid(item.id)">
          {{ formatCurrency(parseInt(item.amount)) }}
        </div>
        <div v-else :class="{ 'error--text': isAmountInvalid(item.id) }">
          <v-icon small color="error" v-if="item.amount == ''"
            >mdi-alert-circle-outline</v-icon
          >
          {{ item.amount }}
        </div>
      </template>

      <template v-slot:[`item.ks`]="{ item }">
        <div :class="{ 'error--text': isKsInvalid(item.id) }">
          {{ item.ks }}
        </div>
      </template>

      <template v-slot:[`item.vs`]="{ item }">
        <div :class="{ 'error--text': isVsInvalid(item.id) }">
          {{ item.vs }}
        </div>
      </template>

      <template v-slot:[`item.ss`]="{ item }">
        <div :class="{ 'error--text': isSsInvalid(item.id) }">
          {{ item.ss }}
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "Home",

  data: () => ({
    valid: true,
    headers: [
      { text: "Account", value: "account" },
      {
        text: "Amount",
        value: "amount",
        dataType: "Currency",
      },
      { text: "Constant symbol", value: "ks" },
      { text: "Variable symbol", value: "vs" },
      { text: "Specific symbol", value: "ss" },
    ],
  }),

  computed: {
    items() {
      return this.valid
        ? this.payments.items
        : this.payments.items.filter((p) => p.valid == this.valid);
    },

    isPaymentsEmpty() {
      return this.$store.getters.isPaymentsEmpty;
    },

    payments() {
      return this.$store.getters.getPayments;
    },
  },

  watch: {
    payments: {
      deep: true,
      handler() {
        this.valid = true;
      },
    },
  },

  methods: {
    setInvalid() {
      this.valid = !this.valid;
    },

    viewDetail(payment) {
      this.$router.push("/payments/" + payment.id);
    },

    formatCurrency(amount) {
      return amount.toLocaleString("en-US", {
        style: "currency",
        currency: this.$store.getters.getUser.currency,
      });
    },

    addPayment() {
      this.$router.push("/payments");
    },

    isValid(id, property) {
      var item = this.payments.errors.find((x) => x.id === id);
      return item ? item[property] != "" : false;
    },

    isAccountInvalid(id) {
      return this.isValid(id, "account");
    },

    isAmountInvalid(id) {
      return this.isValid(id, "amount");
    },

    isKsInvalid(id) {
      return this.isValid(id, "ks");
    },

    isVsInvalid(id) {
      return this.isValid(id, "vs");
    },

    isSsInvalid(id) {
      return this.isValid(id, "ss");
    },
  },
});
</script>

<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
