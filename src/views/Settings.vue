<template>
  <div class="settings">
    <Toolbar title="Settings" />
    <LoginDialog v-model="loginDialog" />
    <ColumnDialog v-model="columnDialog" />

    <v-list three-line subheader>
      <v-subheader>User Controls</v-subheader>
      <v-list-item link @click="loginDialog = true">
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
      <v-list-item link @click="columnDialog = true">
        <v-list-item-content>
          <v-list-item-title>Column Order</v-list-item-title>
          <v-list-item-subtitle
            >Set columnDialog layout of a file</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-action>
          <v-checkbox v-model="columnCheck"></v-checkbox>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Set layout before data load</v-list-item-title>
          <v-list-item-subtitle
            >Show columnDialog order dialog every time file is being
            loaded</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import Vue from "vue";
import Toolbar from "../components/Toolbar.vue";
import LoginDialog from "../components/dialogs/LoginDialog.vue";
import ColumnDialog from "../components/dialogs/ColumnDialog.vue";

export default Vue.extend({
  name: "Settings",

  components: {
    Toolbar,
    LoginDialog,
    ColumnDialog,
  },

  data: () => ({
    loginDialog: false,
    columnDialog: false,
  }),

  computed: {
    columnCheck: {
      get() {
        return this.$store.getters.getColumnCheck;
      },
      set(newValue) {
        this.$store.commit("updateColumnCheck", newValue);
      },
    },
  },
});
</script>
