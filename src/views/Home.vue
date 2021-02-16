<template>
  <div class="home">
    <v-toolbar flat>
      <v-text-field
      v-model="search"
        width="25%"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
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
      <v-btn
        :disabled="!selected.length"
        @click="editSelected"
        color="#2C3A47"
        class="mb-2 mr-2"
        icon
        small
      >
        <v-icon> mdi-pencil </v-icon>
      </v-btn>
      <v-btn
        :disabled="!selected.length"
        @click="deleteSelected"
        color="error"
        class="mb-2 mr-2"
        icon
        small
      >
        <v-icon> mdi-delete </v-icon>
      </v-btn>

      <v-btn color="orange" dark class="mb-2" @click="addPayment">
        New Item
      </v-btn>
    </v-toolbar>
    <v-data-table
      dense
      v-model="selected"
      :headers="headers"
      :items="items"
      :search="search"
      :show-select="items.length != 0"
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
        <div class="text-right">
          <div v-if="!isAmountInvalid(item.id)">
            {{ formatCurrency(parseInt(item.amount)) }}
          </div>
          <div v-else :class="{ 'error--text': isAmountInvalid(item.id) }">
            <v-icon small color="error" v-if="item.amount == ''"
              >mdi-alert-circle-outline</v-icon
            >
            {{ item.amount }}
          </div>
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
    search: "",
    headers: [
      { text: "Account", value: "account" },
      { text: "Constant symbol", value: "ks" },
      { text: "Variable symbol", value: "vs" },
      { text: "Specific symbol", value: "ss" },
      {
        text: "Amount",
        value: "amount",
        dataType: "Currency",
      },
    ],
  }),

  computed: {
    payments() {
      return this.$store.getters.getPayments;
    },

    items() {
      return this.valid
        ? this.payments
        : this.payments.filter((p) => p.valid == this.valid);
    },

    isPaymentsEmpty() {
      return this.payments.length;
    },

    selected: {
      get() {
        return this.$store.getters.getSelected;
      },
      set(value) {
        return this.$store.commit("updateSelected", value);
      },
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

    editSelected() {
      this.$router.push("/payments/" + Infinity);
    },

    deleteSelected() {
      this.selected.forEach((item) => {
        this.$store.commit("removePayment", item.id);
      });
      this.$store.commit("updateSelected", []);
    },

    isInvalid(id, property) {
      var item = this.payments.find((x) => x.id === id);
      return item ? item.errors[property] != "" : false;
    },

    isAccountInvalid(id) {
      return this.isInvalid(id, "account");
    },

    isAmountInvalid(id) {
      return this.isInvalid(id, "amount");
    },

    isKsInvalid(id) {
      return this.isInvalid(id, "ks");
    },

    isVsInvalid(id) {
      return this.isInvalid(id, "vs");
    },

    isSsInvalid(id) {
      return this.isInvalid(id, "ss");
    },
  },
});
</script>

<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
