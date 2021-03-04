<template>
  <div>
    <!-- TODO send => download -->
    <SuccessDialog v-model="successDialog" :type="SUCCESS_DIALOG.DOWNLOAD" />
    <LoadingTimerDialog v-model="waitingForAPIdialog" />
    <LoadingDialog v-model="loadingDialog" msg="Downloading data" />
    <v-btn block outlined class="mt-1" color="primary" @click="downloadData">
      Download data
    </v-btn>
  </div>
</template>

<script>
import Vue from "vue";
import { ipcRenderer } from "electron";
import { ERROR_DIALOG } from "../../utils/data/constants";
import { SUCCESS_DIALOG, TIMER_TARGET } from "../../utils/data/enums";
import SuccessDialog from "../dialogs/SuccessDialog";
import LoadingTimerDialog from "../dialogs/LoadingTimerDialog";
import LoadingDialog from "../dialogs/LoadingDialog";

export default Vue.extend({
  name: "ButtonSendData",

  components: {
    SuccessDialog,
    LoadingTimerDialog,
    LoadingDialog,
  },

  data: () => ({
    successDialog: false,
    waitingForAPIdialog: false,
    loadingDialog: false,
  }),

  enums: {
    SUCCESS_DIALOG,
  },

  computed: {
    payments() {
      return this.$store.getters.getPayments.filter((payment) => payment.valid);
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
          .dispatch(
            "downloadData",
            "https://www.fio.cz/ib_api/rest/periods/jpEKKoIo9TyJHRRaKZ7t4xSukxaAiTanlZP5wY8KqJ1aDNfvf5Ak4pz7Ni41c7Oq/2021-02-08/2021-03-04/transactions.json"
          )
          .then(() => {
            this.successDialog = true;
          })
          .catch((e) => {
            ipcRenderer.send(ERROR_DIALOG, e);
          })
          .finally(() => {
            this.loadingDialog = false;
            this.$store.commit("apiCooldown", 30);
          });
      }
    },
  },
});
</script>

