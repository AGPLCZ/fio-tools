<template>
  <div>
    <SuccessDialog v-model="successDialog" :type="SUCCESS_DIALOG.SAVE" />
    <v-list-item link @click="saveDialog" :disabled="payments.length == 0">
      <v-list-item-icon>
        <v-icon>mdi-content-save</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>{{
          $t("navigationDrawer.saveButton.name")
        }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
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
  name: "SaveDataButton",

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

  /**
   * Event listener if file save was succesfull
   * Show succesDialog
   */
  created() {
    ipcRenderer.on(SAVE_FILE, () => {
      this.successDialog = true;
    });
  },
  methods: {
    /**
     * Route back to the home page
     * Call ipcMain event to save file with created workbook
     */
    saveDialog() {
      this.$router.push("/", () => {});
      ipcRenderer.send(
        SAVE_DIALOG,
        createWorkbook(
          this.payments,
          this.$store.getters.getColumnOrder,
          this.$store.getters.getSaveHeader
        ),
        this.$i18n.t("electron.errorSave")
      );
    },
  },
});
</script>

