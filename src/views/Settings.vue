<template>
  <div class="settings">
    <Toolbar title="Settings" />
    <LoginDialog v-model="dialog" />

    <v-list three-line subheader>
      <v-subheader>User Controls</v-subheader>
      <v-list-item link @click="dialog = true">
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
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title>Column order</v-list-item-title>
          <v-list-item-subtitle
            >Set your structure of files you want to
            upload</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Default payment method</v-list-item-title>
          <v-list-item-subtitle
            ><v-select label="Payment" dense></v-select
          ></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import Vue from "vue";
import Toolbar from "../components/Toolbar.vue";
import LoginDialog from "../components/LoginDialog.vue";

export default Vue.extend({
  name: "Settings",

  components: {
    Toolbar,
    LoginDialog,
  },

  data: () => ({
    dialog: false,
  }),
});
</script>
