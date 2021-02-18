<template>
  <v-btn block class="mt-1" color="orange" :disabled="payments.length == 0">
    Save data
  </v-btn>
</template>

<script>
import Vue from "vue";
// import { ipcRenderer } from "electron";
// import { GET_FILE, OPEN_DIALOG } from "../../utils/constants";

export default Vue.extend({
  name: "ButtonSaveData",

  computed: {
    payments() {
      return this.$store.getters.getPayments;
    },
  },

  data: () => ({}),

  methods: {},
});
</script>

