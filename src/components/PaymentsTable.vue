<template>
  <v-data-table
    dense
    v-model="selected"
    :headers="headers"
    :items="items"
    :search="search"
    search-label="HSHSH"
    show-select
    hide-default-footer
    disable-pagination
    class="elevation-1"
    :class="{ 'row-pointer': payments.length }"
    @click:row="viewDetail"
  >

    <template v-slot:[`header.data-table-select`]="{ props, on }">
      <v-simple-checkbox
        color="primary"
        v-if="props.indeterminate"
        v-ripple
        v-bind="props"
        :value="props.indeterminate"
        v-on="on"
      ></v-simple-checkbox>
      <v-simple-checkbox
        color="primary"
        v-if="!props.indeterminate"
        v-ripple
        v-bind="props"
        v-on="on"
      ></v-simple-checkbox>
    </template>

    <template v-slot:[`item.data-table-select`]="{ item, isSelected, select }">
      <v-simple-checkbox
        :class="{ invalid: !item.valid && !isSelected }"
        :dark="!item.valid && !isSelected"
        color="primary"
        v-ripple
        :value="isSelected"
        @input="select($event)"
      ></v-simple-checkbox>
    </template>

    <template v-slot:[`item.account`]="{ item }">
      <div :class="{ 'error--text': isAccountInvalid(item.errors) }">
        {{ item.account }}
      </div>
    </template>

    <template v-slot:[`item.amount`]="{ item }">
      <div class="text-right">
        <div v-if="!isAmountInvalid(item.errors)">
          {{ formatCurrency(parseInt(item.amount)) }}
        </div>
        <div v-else :class="{ 'error--text': isAmountInvalid(item.errors) }">
          {{ item.amount }}
        </div>
      </div>
    </template>

    <template v-slot:[`item.ks`]="{ item }">
      <div :class="{ 'error--text': isKsInvalid(item.errors) }">
        {{ item.ks }}
      </div>
    </template>

    <template v-slot:[`item.vs`]="{ item }">
      <div :class="{ 'error--text': isVsInvalid(item.errors) }">
        {{ item.vs }}
      </div>
    </template>

    <template v-slot:[`item.ss`]="{ item }">
      <div :class="{ 'error--text': isSsInvalid(item.errors) }">
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

  data() {
    return {
      headers: [
        { text: this.$i18n.t("table.header.account"), value: "account" },
        { text: this.$i18n.t("table.header.ks"), value: "ks" },
        { text: this.$i18n.t("table.header.vs"), value: "vs" },
        { text: this.$i18n.t("table.header.ss"), value: "ss" },
        {
          text: this.$i18n.t("table.header.amount"),
          value: "amount",
          dataType: "Currency",
        },
      ],
    };
  },

  computed: {
    payments() {
      return this.$store.getters.getPayments;
    },

    items() {
      return this.valid
        ? this.payments
        : this.payments.filter((payment) => payment.valid == this.valid);
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

    isInvalid(errors, property) {
      return errors[property] != "";
    },

    isAccountInvalid(errors) {
      return this.isInvalid(errors, "account");
    },

    isAmountInvalid(errors) {
      return this.isInvalid(errors, "amount");
    },

    isKsInvalid(errors) {
      return this.isInvalid(errors, "ks");
    },

    isVsInvalid(errors) {
      return this.isInvalid(errors, "vs");
    },

    isSsInvalid(errors) {
      return this.isInvalid(errors, "ss");
    },
  },
};
</script>

<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}

.invalid {
  background-color: red;
  opacity: 0.75;
}
</style>
