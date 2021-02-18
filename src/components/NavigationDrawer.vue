<template>
  <div>
    <SuccessDialog v-model="sended" :dataCount="dataCount" />
    <v-navigation-drawer dark permanent left app color="#2C3A47">
      <template v-slot:prepend>
        <v-list-item class="px-2">
          <!-- catching error(routing to same page as user currently is) -->
          <v-list-item-avatar
            @click="$router.push('/', () => {})"
            class="clickable"
          >
            <img src="../assets/account.png" class="mx-auto" />
          </v-list-item-avatar>

          <v-list-item-title v-if="user"
            >{{ user.accountId }}/{{ user.bankId }}</v-list-item-title
          >
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <div class="pa-2">
        <v-btn block class="mt-1" color="orange" @click="openDialog">
          Load data
        </v-btn>
        <v-btn
          block
          class="mt-1"
          color="orange"
          :disabled="payments.length == 0"
          @click="sendData"
        >
          Send data
        </v-btn>
        <v-btn
          block
          class="mt-1"
          color="orange"
          :disabled="payments.length == 0"
        >
          Save data
        </v-btn>
      </div>

      <template v-slot:append>
        <v-list dense>
          <v-list-item route to="/settings">
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import Vue from "vue";
import { ipcRenderer } from "electron";
import { GET_FILE, OPEN_DIALOG, ERROR_DIALOG } from "../utils/constants";
import SuccessDialog from "./SuccessDialog.vue";
import XMLBuilder from "../utils/XMLBuilder";
import axios from "axios";

export default Vue.extend({
  name: "NavigationDrawer",

  components: {
    SuccessDialog,
  },

  data: () => ({
    sended: false,
    dataCount: 0
  }),

  computed: {
    payments() {
      return this.$store.getters.getPayments;
    },

    user() {
      return this.$store.getters.getUser;
    },
  },

  created() {
    ipcRenderer.on(GET_FILE, (event, arg) => {
      this.$store.commit("addPayments", arg);
    });
  },

  methods: {
    openDialog() {
      ipcRenderer.send(OPEN_DIALOG);
      this.$router.push("/", () => {});
    },

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
        .post("https://www.fio.cz/ib_api/rest/import/", this.getFormData())
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
            this.dataCount = responceXML.getElementsByTagName("detail").length;
            this.sended = true;
            this.$store.commit("resetPayments");
          }
        })
        .catch((e) => {
          ipcRenderer.send(ERROR_DIALOG, e);
        });
    },
  },
});
</script>

<style>
.clickable:hover {
  cursor: pointer;
}
</style>
