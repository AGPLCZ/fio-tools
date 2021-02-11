<template>
  <div class="home">
    <v-toolbar flat>
      <v-chip
        v-if="!valid"
        class="ma-2"
        :color="isPaymentsEmpty ? 'green' : 'grey'"
        text-color="white"
        @click="setValid"
        :disabled="isPaymentsEmpty == 0"
      >
        All Data
      </v-chip>

      <v-chip
        v-else
        class="ma-2"
        :color="isPaymentsEmpty ? 'red' : 'grey'"
        text-color="white"
        @click="setValid"
        :disabled="isPaymentsEmpty == 0"
      >
        Invalid Data
      </v-chip>

      <v-spacer></v-spacer>

      <v-btn color="orange" dark class="mb-2"> New Item </v-btn>
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
        <div :class="{ 'error--text': isAccountValid(item.id) }">
          {{ item.account }}
        </div>
      </template>

      <template v-slot:[`item.amount`]="{ item }">
        {{ formatCurrency(parseInt(item.amount)) }}
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
    setValid() {
      this.valid = !this.valid;
    },

    viewDetail(row) {
      console.log(row);
    },

    formatCurrency(amount) {
      return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "CZK",
      });
    },
    
    isAccountValid(id) {
      return this.payments.errors.find((x) => x.id === id).account != "";
    },
  },
});
</script>

<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
