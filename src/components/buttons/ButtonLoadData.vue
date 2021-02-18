<template>
  <v-btn block class="mt-1" color="orange" @click="openDialog">
    Load data
  </v-btn>
</template>

<script>
import Vue from "vue";
import { ipcRenderer } from "electron";
import { GET_FILE, OPEN_DIALOG } from "../../utils/constants";

export default Vue.extend({
  name: "ButtonLoadData",

  data: () => ({}),
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
  },
});
</script>

