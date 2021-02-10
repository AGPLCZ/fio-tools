<template>
  <div class="settings">
    <Toolbar title="Settings" />
    <v-btn @click="dialog = true">Edit login</v-btn>
    <LoginDialog v-model="dialog" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Toolbar from "../components/Toolbar.vue";
import LoginDialog from "../components/LoginDialog.vue";

export default Vue.extend({
  name: "Settings",

  data: () => ({
    dialog: false,
  }),

  components: {
    Toolbar,
    LoginDialog,
  },
});
</script>
