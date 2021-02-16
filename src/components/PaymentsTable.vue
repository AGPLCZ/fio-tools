<template>
  <v-data-table
    dense
    v-model="selected"
    :headers="headers"
    :items="items"
    :search="search"
    show-select
    hide-default-footer
    disable-pagination
    class="elevation-1"
    :class="{ 'row-pointer': payments.length }"
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
</template>

<script>
export default {
  name: "PaymentsTable",

  props: {
    search: String,
    valid: Boolean,
  },

  data: () => ({
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

    selected: {
      get() {
        return this.$store.getters.getSelected;
      },
      set(value) {
        return this.$store.commit("updateSelected", value);
      },
    },
  },
  methods: {
    formatCurrency(amount) {
      return amount.toLocaleString("en-US", {
        style: "currency",
        currency: this.$store.getters.getUser.currency,
      });
    },

    viewDetail(payment) {
      this.$router.push("/payments/" + payment.id);
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
};
</script>

<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>

<style>
</style>