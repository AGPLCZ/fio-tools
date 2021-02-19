<template>
  <div>
    <SuccessDialog v-model="sended" />
    <LoadingTimerDialog v-model="waitingForAPI" />
    <LoadingDialog v-model="loading" :size="235" msg="Sending data" />
    <v-btn
      block
      class="mt-1"
      color="orange"
      :disabled="payments.length == 0"
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
import SuccessDialog from "../dialogs/SuccessDialog";
import LoadingTimerDialog from "../dialogs/LoadingTimerDialog";
import LoadingDialog from "../dialogs/LoadingDialog";

export default Vue.extend({
  name: "ButtonSendData",

  components: {
    SuccessDialog,
    LoadingTimerDialog,
    LoadingDialog
  },

  data: () => ({
    sended: false,
    waitingForAPI: false,
    loading: false
  }),

  computed: {
    payments() {
      return this.$store.getters.getPayments.filter(payment => payment.valid);
    },
  },

  watch: {
    waitingForAPI(newValue, oldValue) {
      if (newValue == undefined && oldValue && this.$store.getters.getTimer == 0)
        this.sendData();
    },
  },

  mounted() {
    this.validPayments = this.payments.filter(payment => payment.valid);
  },

  methods: {
    async sendData() {
      if (this.$store.getters.getTimer != 0) {
        this.waitingForAPI = true;
      } else {
        this.loading = true;
        await this.$store
          .dispatch("sendData")
          .then((responceXML) => {
            if (
              responceXML.getElementsByTagName("status")[0].childNodes[0]
                .nodeValue == "error"
            ) {
              ipcRenderer.send(
                ERROR_DIALOG,
                responceXML.getElementsByTagName("message")[0].childNodes[0]
                  .nodeValue
              );
            } else {
              this.sended = true;
              this.$store.commit("removeValidPayments");
            }
          })
          .catch((e) => {
            ipcRenderer.send(ERROR_DIALOG, e);
          })
          .finally(() => {
            this.loading = false;
            this.$store.commit("apiCooldown", 30);
          });
      }
    },
  },
});
</script>

