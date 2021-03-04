<template>
  <div>
    <SuccessDialog
      v-model="successDialog"
      :type="SUCCESS_DIALOG.DOWNLOAD"
      :number="successNumber"
    />
    <LoadingTimerDialog
      v-model="waitingForAPIdialog"
      msg="Data will download"
    />
    <LoadingDialog v-model="loadingDialog" msg="Downloading data" />
    <v-dialog
      :value="value"
      @input="$emit('input')"
      persistent
      :max-width="dialogSize"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Set filters</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-container>
              <v-row>
                <v-col cols="6">
                  <DatePicker
                    v-model="dateFrom"
                    :maxDate="dateTo"
                    msg="Payments from"
                  />
                </v-col>

                <v-col cols="6">
                  <DatePicker
                    v-model="dateTo"
                    :minDate="dateFrom"
                    msg="Payments to"
                  />
                </v-col>
              </v-row>
              <v-row class="pl-4 pr-4">
                <v-text-field
                  v-model="account"
                  :rules="[() => !errors.account || errors.account]"
                  label="Account"
                ></v-text-field>
              </v-row>

              <v-row class="pl-4 pr-4">
                <v-text-field
                  v-model="vs"
                  :rules="[() => !errors.vs || errors.vs]"
                  :counter="vsMaxSize"
                  label="Variable symbol prefix"
                ></v-text-field>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click.native="closeDialog">
            Close
          </v-btn>
          <v-btn color="primary" text @click.native="downloadData">
            Download
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
    dateFrom: new Date().toISOString().substr(0, 10),
    dateTo: new Date().toISOString().substr(0, 10),
    account: "",
    vs: "",
    vsMaxSize: VS_MAX_SIZE,
    errors: {
      account: "",
      vs: "",
    },
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

  methods: {
    validateVs() {
      if (isNaN(this.vs)) {
        return "Invalid number format";
      }
      if (this.vs.length > VS_MAX_SIZE)
        return "Number is to long, max length is " + VS_MAX_SIZE;
      return "";
    },

    filter(payments) {
      if (this.account != "")
        payments = payments.filter((payment) => payment.account == this.account);
      if (this.vs != "")
        payments = payments.filter((payment) => payment.vs.startsWith(this.vs));
      return payments;
    },

    async downloadData() {
      this.errors.account = Validator.validateAccount(this.account, true);
      this.errors.vs = this.validateVs();
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

    closeDialog() {
      console.log(Validator.validateAccount(this.account));
      this.$emit("input");
    },
  },
});
</script>