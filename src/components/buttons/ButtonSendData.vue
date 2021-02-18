<template>
  <div>
    <SuccessDialog v-model="sended" />
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
import { FIO_API_PREFIX, ERROR_DIALOG } from "../../utils/constants";
import SuccessDialog from "../dialogs/SuccessDialog";
import XMLBuilder from "../../utils/XMLBuilder";
import axios from "axios";

export default Vue.extend({
  name: "ButtonSendData",

  components: {
    SuccessDialog,
  },

  data: () => ({
    sended: false,
  }),

  computed: {
    payments() {
      return this.$store.getters.getPayments;
    },

    user() {
      return this.$store.getters.getUser;
    },
  },

  methods: {
    getFormData() {
      var blob = new Blob(
        [XMLBuilder.build(this.payments, this.user.accountId)],
        { type: "text/xml" }
      );
      const formData = new FormData();
      formData.append("type", "xml");
      formData.append("token", localStorage.getItem("token"));
      formData.append("file", blob, "data.xml");
      formData.append("lng", "en");
      return formData;
    },

    async sendData() {
      axios
        .post(FIO_API_PREFIX + "/import/", this.getFormData())
        .then((response) => {
          const responceXML = new window.DOMParser().parseFromString(
            response.data,
            "text/xml"
          );
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
        });
    },
  },
});
</script>

