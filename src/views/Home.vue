<template>
  <div class="home">
    <v-toolbar flat>
      <v-chip
        v-if="!valid"
        class="ma-2"
        color="green"
        text-color="white"
        @click="setValid"
      >
        All Data
      </v-chip>

      <v-chip
        v-else
        class="ma-2"
        color="red"
        text-color="white"
        @click="setValid"
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
      :class="{ 'row-pointer': items }"
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
  name: "NavigationDrawer",

  data: () => ({
    valid: true,
    payments: {},
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
  },

  watch: {
    "$store.state.payments.items": function () {
      this.initialize();
    },
  },

  mounted() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.payments = this.$store.getters.getPayments;
    },
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
