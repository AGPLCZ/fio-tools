<template>
  <div>
    <SuccessDialog v-model="successDialog" :type="SUCCESS_DIALOG.SEND" />
    <LoadingTimerDialog v-model="waitingForAPIdialog" />
    <LoadingDialog v-model="loadingDialog" msg="Sending data" />
    <v-btn
      block
      class="mt-1"
      color="primary"
      :disabled="paymentsValid.length == 0"
      @click="sendData"
    >
      Send data
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
      return this.$store.getters.getPayments;
    },
    paymentsValid() {
      return this.payments.filter((payment) => payment.valid);
    },
  },

  watch: {
    waitingForAPIdialog(newValue, oldValue) {
      if (
        newValue == undefined &&
        oldValue &&
        this.$store.getters.getTimer == 0 &&
        this.$store.getters.getTimerTarget == TIMER_TARGET.SEND
      )
        this.sendData();
    },
  },

  methods: {
    errorResponse(responceXML) {
      var errorMsg = [];
      const details = responceXML.getElementsByTagName("detail");
      for (var index = 0; index < details.length; index++) {
        var status = details[index].getElementsByTagName("message")[0];
        if (status.getAttribute("status") == "error") {
          errorMsg.push(
            this.paymentsValid[details[index].getAttribute("id") - 1].account +
              ": " +
              status.textContent
          );
        }
      }
      return errorMsg.join("\n");
    },
    async sendData() {
      if (this.$store.getters.getTimer != 0) {
        this.waitingForAPIdialog = true;
        this.$store.commit("updateTimerTarget", TIMER_TARGET.SEND);
      } else {
        this.loadingDialog = true;
        await this.$store
          .dispatch("sendData")
          .then((responceXML) => {
            if (
              responceXML.getElementsByTagName("status")[0].childNodes[0]
                .nodeValue == "error"
            ) {
              ipcRenderer.send(ERROR_DIALOG, this.errorResponse(responceXML));
            } else {
              this.successDialog = true;
              this.$store.commit("setPayments", this.payments.filter((payment) => !payment.valid));
            }
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

