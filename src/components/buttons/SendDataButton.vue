<template>
  <div>
    <SuccessDialog v-model="successDialog" :type="SUCCESS_DIALOG.SEND" />
    <LoadingTimerDialog
      v-model="waitingForAPIdialog"
      :msg="$t('navigationDrawer.sendButton.loadingTimerDialog')"
      :fn="sendData"
    />
    <LoadingDialog
      v-model="loadingDialog"
      :msg="$t('navigationDrawer.sendButton.loadingDialog')"
    />
    <v-list-item link :disabled="paymentsValid.length == 0" @click="sendData">
      <v-list-item-icon>
        <v-icon>mdi-upload</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>{{
          $t("navigationDrawer.sendButton.name")
        }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import Vue from "vue";
import { ipcRenderer } from "electron";
import { ERROR_DIALOG } from "../../utils/data/constants";
import { SUCCESS_DIALOG } from "../../utils/data/enums";
import SuccessDialog from "../dialogs/SuccessDialog";
import LoadingTimerDialog from "../dialogs/LoadingTimerDialog";
import LoadingDialog from "../dialogs/LoadingDialog";

export default Vue.extend({
  name: "SendDataButton",

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

  methods: {
    /**
     * Destructure xml object and creates array of error messages in format
     * payment acount : message
     * @param {responce from API in xml format} responceXML
     * @returns array of error messages
     */
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

    /**
     * Route back to the home page
     * if timer is running change target to SEND and show loadingTimerDialog
     * loading dialog while waiting for responce from API
     * else looks if responce contains "status" error if yes show error dialog with structured error messages
     *      otherwise show succesDialog and remove all valid data from payments in store
     * in case of error show errorDialog
     * close loading dialog and start timer
     */
    async sendData() {
      this.$router.push("/", () => {});
      if (this.$store.getters.getTimer != 0) {
        this.waitingForAPIdialog = true;
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
              this.$store.commit(
                "setPayments",
                this.payments.filter((payment) => !payment.valid)
              );
            }
          })
          .catch((e) => {
            ipcRenderer.send(ERROR_DIALOG, e, this.$i18n.t("electron.error"));
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

