<template>
  <div class="home">
    <v-toolbar flat>
      <v-chip
        v-if="valid"
        class="ma-2"
        color="green"
        text-color="white"
        @click="setValid"
      >
        Valid Data
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
      :items="payments"
      hide-default-footer
      disable-pagination
      class="elevation-1"
      @click:row="viewDetail"
    >
      <template v-slot:[`item.amount`]="{ item }">
        {{ formatCurrency(parseInt(item.amount)) }}
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import IPayment from "../entities/IPayment";

export default Vue.extend({
  name: "NavigationDrawer",

  methods: {
    setValid(): void {
      this.valid = !this.valid;
    },
    viewDetail(row: IPayment): void {
      console.log(row);
    },
    formatCurrency(amount: number): string {
      return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "CZK",
      });
    },
  },
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
    payments: [
      {
        amount: 10,
        account: "2701933259/2010",
        ks: "",
        vs: "",
        ss: "",
      },
      {
        amount: 120,
        account: "2701933259/2010",
        ks: "",
        vs: "",
        ss: "",
      },
    ],
  }),
});
</script>
