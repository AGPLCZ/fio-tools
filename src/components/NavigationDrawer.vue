<template>
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
        @click="test"
      >
        Send data
      </v-btn>
      <v-btn block class="mt-1" color="orange" :disabled="payments.length == 0">
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
</template>

<script>
import Vue from "vue";
import { ipcRenderer } from "electron";
import { GET_FILE, OPEN_DIALOG } from "../utils/constants";

export default Vue.extend({
  name: "NavigationDrawer",

  data: () => ({}),

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

    async test() {
      var blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?><Import xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.fio.cz/schema/importIB.xsd"><Orders><DomesticTransaction><accountFrom>2701933259</accountFrom><currency>CZK</currency><amount>100.00</amount><accountTo>115-2889070247</accountTo><bankCode>0100</bankCode><ks>0558</ks><vs>1234567890</vs><ss>1234567890</ss><date>2021-02-17</date><messageForRecipient>Hračky pro děti v PENNY MARKET</messageForRecipient><comment></comment><paymentType>431001</paymentType></DomesticTransaction></Orders></Import>'], { type: "text/xml" });
      const formData = new FormData();
      formData.append("type", "xml");
      formData.append(
        "token",
        "jpEKKoIo9TyJHRRaKZ7t4xSukxaAiTanlZP5wY8KqJ1aDNfvf5Ak4pz7Ni41c7Oq"
      );
      formData.append("file", blob, "davka.xml");
      formData.append("lng", "en");

      fetch("https://www.fio.cz/ib_api/rest/import/", {
        body: formData,
        method: "POST",
      })
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
      .then((data) => console.log(data));
    },
  },
});
</script>

<style>
.clickable:hover {
  cursor: pointer;
}
</style>
