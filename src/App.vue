<template>
  <v-app>
    <LoginDialog v-model="loginDialog" :type="LOGIN_DIALOG.DEFAULT" />

    <v-main :class="{ 'blur-content': loginDialog }">
      <NavigationDrawer />

      <v-container fluid fill-height>
        <v-layout child-flex>
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Vue from "vue";
import NavigationDrawer from "./components/NavigationDrawer.vue";
import LoginDialog from "./components/dialogs/LoginDialog.vue";
import { PAYMENT_PROPS } from "./utils/data/collections";
import { LOGIN_DIALOG } from "./utils/data/enums";

export default Vue.extend({
  name: "App",

  components: { NavigationDrawer, LoginDialog },

  data: () => ({
    loginDialog: true,
  }),

  enums: {
    LOGIN_DIALOG,
  },

  /**
  * If token is not in localStorage show login loginDialog
  * if columnOrder is not set set default value
  */
  mounted() {
    // localStorage.clear();
    this.loginDialog = localStorage.getItem("token") == null;
    if (localStorage.getItem("columnOrder") == null)
      localStorage.setItem("columnOrder", JSON.stringify(PAYMENT_PROPS));
  },
});
</script>

<style>
.blur-content {
  filter: blur(5px);
}
</style>