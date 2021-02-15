<template>
  <div class="settings">
    <Toolbar title="Settings" />
    <LoginDialog v-model="login" />
    <ColumnDialog v-model="column" />

    <v-list three-line subheader>
      <v-subheader>User Controls</v-subheader>
      <v-list-item link @click="login = true">
        <v-list-item-content>
          <v-list-item-title>API token</v-list-item-title>
          <v-list-item-subtitle
            >Set your FIO bank api token</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list three-line subheader>
      <v-subheader>General</v-subheader>
      <v-list-item link @click="column = true">
        <v-list-item-content>
          <v-list-item-title>Column Order</v-list-item-title>
          <v-list-item-subtitle
            >Set column layout of a file</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import Vue from "vue";
import Toolbar from "../components/Toolbar.vue";
import LoginDialog from "../components/LoginDialog.vue";
import ColumnDialog from "../components/ColumnDialog.vue";

export default Vue.extend({
  name: "Settings",

  components: {
    Toolbar,
    LoginDialog,
    ColumnDialog,
  },

  data: () => ({
    login: false,
    column: false,
  }),
});
</script>
