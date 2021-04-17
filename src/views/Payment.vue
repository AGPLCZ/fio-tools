<template>
  <div class="payment">
    <Toolbar
      v-if="options == FORM_OPTION.ADD"
      :title="$t('payment.title.add')"
    />
    <Toolbar
      v-if="options == FORM_OPTION.EDIT"
      :title="$t('payment.title.edit')"
    />
    <Toolbar
      v-if="options == FORM_OPTION.EDIT_SELECTED"
      :title="$t('payment.title.editSelected')"
    />

    <v-form ref="form" v-model="valid">
      <v-container fluid>
        <v-row class="pa-3">
          <v-text-field
            :disabled="options == FORM_OPTION.EDIT_SELECTED"
            v-model="payment.account"
            :label="$t('payment.form.account')"
            :rules="[() => !errors.account || $t(errors.account)]"
          ></v-text-field>
        </v-row>

        <v-row class="pa-3">
          <v-text-field
            v-model="payment.amount"
            :label="$t('payment.form.amount')"
            :rules="[() => !errors.amount || $t(errors.amount)]"
          ></v-text-field>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              v-model="payment.ks"
              :label="$t('payment.form.ks')"
              :rules="[() => !errors.ks || $t(errors.ks)]"
              :counter="ksMaxSize"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="payment.vs"
              :label="$t('payment.form.vs')"
              :rules="[() => !errors.vs || $t(errors.vs)]"
              :counter="vsMaxSize"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="payment.ss"
              :label="$t('payment.form.ss')"
              :rules="[() => !errors.ss || $t(errors.ss)]"
              :counter="ssMaxSize"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <!-- CZ payments supports only CZK currency -->
            <v-autocomplete
              disabled
              v-model="payment.currency"
              :items="currencies"
              :label="$t('payment.form.currency')"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete
              v-model="type"
              :items="types"
              item-text="text"
              item-value="value"
              :label="$t('payment.form.type')"
            >
              <template v-slot:prepend>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-information-outline</v-icon>
                  </template>
                  <span v-html="$t('payment.form.typeToolTip')"></span>
                </v-tooltip>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col>
            <DatePicker
              v-model="payment.date"
              :minDate="minDate"
              :msg="$t('payment.form.date')"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              v-model="payment.messageFrom"
              :label="$t('payment.form.messageFrom')"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="payment.messageTo"
              :label="$t('payment.form.messageTo')"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row class="pa-3">
          <v-btn
            v-if="options == FORM_OPTION.ADD"
            color="success"
            class="mr-4"
            @click="addPayment"
          >
            {{ $t("payment.submitButton") }}
          </v-btn>
          <v-btn
            v-if="options == FORM_OPTION.EDIT"
            color="success"
            class="mr-4"
            @click="editPayment"
          >
            {{ $t("payment.submitButton") }}
          </v-btn>

          <v-btn
            v-if="options == FORM_OPTION.EDIT_SELECTED"
            color="success"
            class="mr-4"
            @click="editSelected"
          >
            {{ $t("payment.submitButton") }}
          </v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import Vue from "vue";
import Toolbar from "../components/Toolbar";
import DatePicker from "../components/DatePicker";
import Validator from "../utils/validators/Validator";
import { PAYMENT_PROPS, CURRENCIES } from "../utils/data/collections";
import { KS_SIZE, VS_SIZE, SS_SIZE } from "../utils/data/constants";
import { getDate } from "../utils/tools";
import { FORM_OPTION } from "../utils/data/enums";

export default Vue.extend({
  name: "Payment",

  components: {
    Toolbar,
    DatePicker,
  },

  data() {
    return {
      valid: true,
      payment: {},
      errors: {},
      ksMaxSize: KS_SIZE,
      vsMaxSize: VS_SIZE,
      ssMaxSize: SS_SIZE,
      currencies: CURRENCIES,
      types: [
        { value: 431001, text: this.$i18n.t("payment.types.standard") },
        { value: 431005, text: this.$i18n.t("payment.types.prior") },
        { value: 431022, text: this.$i18n.t("payment.types.direct") },
      ],
      type: "",
      minDate: "",
    };
  },
  enums: {
    FORM_OPTION,
  },

  computed: {
    options() {
      return this.$route.params.id == undefined
        ? FORM_OPTION.ADD
        : this.$route.params.id == Infinity
        ? FORM_OPTION.EDIT_SELECTED
        : FORM_OPTION.EDIT;
    },
  },

  watch: {
    /**
     * Change date and min date based on type via fio bank standarts
     */
    type() {
      var date = new Date();
      var maxDate = new Date();
      var maxPriorDate = new Date();
      maxDate.setHours(23, 50);
      maxPriorDate.setHours(13, 50);
      if (
        (this.type == 431005 && date >= maxPriorDate) ||
        this.type == 431022 ||
        date > maxDate
      ) {
        date.setDate(date.getDate() + 1);
        date = getDate(date);
        this.payment.date = date;
        this.minDate = date;
      } else if (
        this.type == 431001 ||
        (this.type == 431005 && date < maxPriorDate)
      ) {
        var todayFormat = getDate();
        this.payment.date = todayFormat;
        this.minDate = todayFormat;
      }
    },
  },

  /**
   * Initialize paymnet based on given option
   */
  mounted() {
    this.minDate = getDate();
    if (this.options == FORM_OPTION.EDIT) this.setPayment();
    else this.setPaymentEmpty();
  },

  methods: {
    /**
     * Set payment to copy of payment with id give as router param and errors to payment.errors
     */
    setPayment() {
      this.payment = Object.assign(
        {},
        this.$store.getters.getPayments.find(
          (payment) => payment.id == this.$route.params.id
        )
      );
      this.type = this.payment.type;
      this.errors = this.payment.errors;
    },

    /**
     * Set payment to empty payment with all property
     */
    setPaymentEmpty() {
      this.payment = {};
      for (var index = 0; index < PAYMENT_PROPS.length; index++) {
        this.payment[PAYMENT_PROPS[index].value] = "";
      }
      if (this.options == FORM_OPTION.ADD) {
        this.payment.currency = this.$store.getters.getUser.currency;
        this.type = this.types[0].value;
        this.payment.date = this.minDate = getDate();
      }
    },

    /**
     * Validate payment, update errors, try to validate form if succedded add payment to store and route back
     */
    addPayment() {
      this.payment.type = this.type;
      this.errors = Validator.validate(this.payment);
      this.payment.errors = this.errors;
      if (this.$refs.form.validate()) {
        this.$store.commit("addPayment", this.payment);
        this.$router.back();
      }
    },

    /**
     * Validate payment, update errors, try to validate form if succedded update payment in store and route back
     */
    editPayment() {
      this.payment.type = this.type;
      this.errors = Validator.validate(this.payment);
      this.payment.errors = this.errors;
      if (this.$refs.form.validate()) {
        this.$store.commit("updatePayment", this.payment);
        this.$router.back();
      }
    },

    /**
     * ValidateSelected(only some properties) payment, update errors, try to validate form
     * if succedded update selected payments in store and route back
     */
    editSelected() {
      this.payment.type = this.type;
      this.errors = Validator.validateSelected(this.payment);
      this.payment.errors = this.errors;
      if (this.$refs.form.validate()) {
        this.$store.commit("updatePaymentSelected", this.payment);
        this.$router.back();
      }
    },
  },
});
</script>
