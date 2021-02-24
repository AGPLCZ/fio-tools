<template>
  <div>
    <SuccessDialog v-model="successDialog" :type="SUCCESS_DIALOG.SAVE" />
    <v-btn
      block
      color="primary"
      class="mt-1"
      @click="saveDialog"
      :disabled="payments.length == 0"
    >
      Save data
    </v-btn>
  </div>
</template>

<script>
import Vue from "vue";
import { ipcRenderer } from "electron";
import { SAVE_DIALOG, SAVE_FILE } from "../../utils/data/constants";
import { SUCCESS_DIALOG } from "../../utils/data/enums";
import { createWorkbook } from "../../utils/tools";
import SuccessDialog from "../dialogs/SuccessDialog";

export default Vue.extend({
  name: "ButtonSaveData",

  components: {
    SuccessDialog,
  },

  computed: {
    payments() {
      return this.$store.getters.getPayments;
    },
  },

  data: () => ({
    successDialog: false,
  }),

  enums: {
    SUCCESS_DIALOG,
  },

  created() {
    ipcRenderer.on(SAVE_FILE, () => {
      this.successDialog = true;
    });
  },
  methods: {
    saveDialog() {
      ipcRenderer.send(
        SAVE_DIALOG,
        createWorkbook(
          this.payments,
          this.$store.getters.getColumnOrder,
          this.$store.getters.getSaveHeader
        )
      );
      this.$router.push("/", () => {});
    },
  },
});
</script>

