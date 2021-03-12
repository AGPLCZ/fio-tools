<template>
  <div>
    <SuccessDialog
      v-model="successDialog"
      :type="SUCCESS_DIALOG.LOAD"
      :number="successNumber"
    />
    <LoadingTimerDialog
      v-model="waitingForAPIdialog"
      :msg="$t('downloadDialog.loadingTimerDialog')"
    />
    <LoadingDialog
      v-model="loadingDialog"
      :msg="$t('downloadDialog.loadingDialog')"
    />
    <v-dialog
      :value="value"
      @input="$emit('input')"
      persistent
      :max-width="dialogSize"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t("downloadDialog.title") }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-container>
              <v-row>
                <v-col>
                  <DatePicker
                    v-model="dateFrom"
                    :maxDate="dateTo"
                    :msg="$t('downloadDialog.dateFrom')"
                  />
                </v-col>

                <v-col>
                  <DatePicker
                    v-model="dateTo"
                    :minDate="dateFrom"
                    :msg="$t('downloadDialog.dateTo')"
                  />
                </v-col>
              </v-row>
              <v-row class="pl-4 pr-4">
                <v-text-field
                  v-model="account"
                  :rules="[() => !errors.account || errors.account]"
                  :label="$t('downloadDialog.account')"
                ></v-text-field>
              </v-row>

              <v-row class="pl-4 pr-4">
                <v-text-field
                  v-model="vs"
                  :rules="[() => !errors.vs || errors.vs]"
                  :counter="vsMaxSize"
                  :label="$t('downloadDialog.vs')"
                ></v-text-field>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click.native="$emit('input')">
            {{ $t("downloadDialog.close") }}
          </v-btn>
          <v-btn color="primary" text @click.native="downloadData">
            {{ $t("downloadDialog.download") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { ipcRenderer } from "electron";
import {
  ERROR_DIALOG,
  FIO_API_PREFIX,
  BIG_DIALOG_SIZE,
  VS_MAX_SIZE,
} from "../../utils/data/constants";
import { SUCCESS_DIALOG, TIMER_TARGET } from "../../utils/data/enums";
import Validator from "../../utils/validators/Validator";
import SuccessDialog from "./SuccessDialog";
import LoadingTimerDialog from "./LoadingTimerDialog";
import LoadingDialog from "./LoadingDialog";
import DatePicker from "../DatePicker";
import { getDate } from "../../utils/tools";

export default Vue.extend({
  name: "LoginDialog",

  components: {
    SuccessDialog,
    LoadingTimerDialog,
    LoadingDialog,
    DatePicker,
  },

  props: {
    value: Boolean,
  },

  data: () => ({
    dialogSize: BIG_DIALOG_SIZE,
    valid: true,
    dateFrom: "",
    dateTo: "",
    account: "",
    vs: "",
    errors: {},
    vsMaxSize: VS_MAX_SIZE,
    successDialog: false,
    waitingForAPIdialog: false,
    loadingDialog: false,
    successNumber: 0,
  }),

  enums: {
    SUCCESS_DIALOG,
  },

  computed: {
    payments() {
      return this.$store.getters.getPayments;
    },
    urlAPI() {
      return (
        FIO_API_PREFIX +
        "/" +
        "periods" +
        "/" +
        localStorage.getItem("token") +
        "/" +
        this.dateFrom +
        "/" +
        this.dateTo +
        "/" +
        "transactions.json"
      );
    },
  },

  watch: {
    /**
     * If dialog is open then initialize params
     */
    value(newValue) {
      if (newValue) {
        this.initialize();
      }
    },
     
     /**
     * If timer ends and timerTarget is DOWNLOAD proceed to downloadData
     */
    waitingForAPIdialog(newValue, oldValue) {
      if (
        newValue == undefined &&
        oldValue &&
        this.$store.getters.getTimer == 0 &&
        this.$store.getters.getTimerTarget == TIMER_TARGET.DOWNLOAD
      )
        this.downloadData();
    },
  },

  /**
  * Initialize params
  */
  mounted() {
    this.initialize();
  },

  methods: {
    /**
     * Set all params to default values
     */
    initialize() {
      this.dateFrom = getDate();
      this.dateTo = getDate();
      this.account = "";
      this.vs = "";
      this.errors = {
        account: "",
        vs: "",
      };
    },

    /**
     * If account then filer payments based on acount
     * then If variable symbol filter payment based on vs prefix
     * @param {array of payment items} payments 
     */
    filter(payments) {
      if (this.account != "")
        payments = payments.filter(
          (payment) => payment.account == this.account
        );
      if (this.vs != "")
        payments = payments.filter((payment) => payment.vs.startsWith(this.vs));
      return payments;
    },

    /**
     * Validates account and variable symbol, tryes to validate form If succeded check timer 
     * if timer is running change target to DOWNLOAD and show loadingTimerDialog
     * loading dialog while waiting for responce from API
     * else filter given payments, update it to store and shows succes dialog
     * in case of error show errorDialog
     * close all open dialogs and start timer
     */
    async downloadData() {
      this.errors.account = Validator.validateAccount(this.account, true);
      this.errors.vs = Validator.validateNumber(this.vs, this.vsMaxSize);
      if (this.$refs.form.validate()) {
        if (this.$store.getters.getTimer != 0) {
          this.waitingForAPIdialog = true;
          this.$store.commit("updateTimerTarget", TIMER_TARGET.DOWNLOAD);
        } else {
          this.loadingDialog = true;
          await this.$store
            .dispatch("downloadData", this.urlAPI)
            .then((responce) => {
              var payments = this.filter(responce);
              this.$store.commit("setPayments", payments.concat(this.payments));
              this.successNumber = payments.length;
              this.successDialog = true;
            })
            .catch((e) => {
              ipcRenderer.send(ERROR_DIALOG, e);
            })
            .finally(() => {
              this.loadingDialog = false;
              this.$emit("input");
              this.$store.commit("apiCooldown", 30);
            });
        }
      }
    },
  },
});
</script>