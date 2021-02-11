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

        <v-list-item-title v-if="user">{{user.accountId}}/{{user.bankId}}</v-list-item-title>
      </v-list-item>
    </template>

    <v-divider></v-divider>

    <div class="pa-2">
      <v-btn block class="mt-1" color="orange" @click="resetData" :disabled="isPaymentsEmpty"> Reset data </v-btn>
      <v-btn block class="mt-1" color="orange" @click="openDialog">
        Load data
      </v-btn>
    </div>

    <template v-slot:append>
      <v-list dense>
        <v-list-item route to="/settings" active-class="orange--text">
          <v-list-item-icon>
            <v-icon>mdi-wrench</v-icon>
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

  data: () => ({
    user: null
  }),

  computed: {
    isPaymentsEmpty(){
      return !this.$store.getters.getPayments.items.length;
    }
  },

  mounted() {
    this.initialize();
  },

  watch: {
    "$store.state.user": function () {
      this.initialize();
    },
  },

  created() {
    ipcRenderer.on(GET_FILE, (event, arg) => {
      this.$store.commit("addPayments", arg);
    });
  },

  methods: {
    initialize() {
      this.user = this.$store.getters.getUser;
    },
    openDialog() {
      ipcRenderer.send(OPEN_DIALOG);
    },
    resetData() {
      this.$store.commit("setPayments", []);
    },
  },
});
</script>

<style>
.clickable:hover {
  cursor: pointer;
}
</style>
