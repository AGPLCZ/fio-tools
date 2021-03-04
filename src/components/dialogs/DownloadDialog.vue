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
          </v-container>
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
} from "../../utils/data/constants";
import { SUCCESS_DIALOG, TIMER_TARGET } from "../../utils/data/enums";
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
    dateFrom: new Date().toISOString().substr(0, 10),
    dateTo: new Date().toISOString().substr(0, 10),
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
    async downloadData() {
      if (this.$store.getters.getTimer != 0) {
        this.waitingForAPIdialog = true;
        this.$store.commit("updateTimerTarget", TIMER_TARGET.DOWNLOAD);
      } else {
        this.loadingDialog = true;
        await this.$store
          .dispatch("downloadData", this.urlAPI)
          .then((responce) => {
            this.$store.commit("setPayments", responce.concat(this.payments));
            this.successNumber = responce.length;
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
    },

    closeDialog() {
      console.log(this.dateFrom);
      console.log(this.dateTo);
      this.$emit("input");
    },
  },
});
</script>