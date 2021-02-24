<template>
  <v-btn
    block
    color="primary"
    class="mt-1"
    @click="saveDialog"
    :disabled="payments.length == 0"
  >
    Save data
  </v-btn>
</template>

<script>
import Vue from "vue";
import { ipcRenderer } from "electron";
import { SAVE_DIALOG } from "../../utils/data/constants";
import { createWorkbook } from "../../utils/tools";

export default Vue.extend({
  name: "ButtonSaveData",

  computed: {
    payments() {
      return this.$store.getters.getPayments;
    },
  },

  data: () => ({}),

  methods: {
    saveDialog() {
      ipcRenderer.send(SAVE_DIALOG, createWorkbook(this.payments, this.$store.getters.getColumnOrder, this.$store.getters.getSaveHeader));
      this.$router.push("/", () => {});
    },
  },
});
</script>

