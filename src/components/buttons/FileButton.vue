<template>
  <div>
    <ColumnDialog v-model="columnDialog" :type="COLUMN_DIALOG.DEFAULT" />
    <SuccessDialog
      v-model="successDialog"
      :type="SUCCESS_DIALOG.LOAD"
      :number="successNumber"
    />
    <v-list-item link @click="clicked" class="pl-10">
      <v-list-item-icon>
        <v-icon>mdi-file-excel</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>{{
          $t("navigationDrawer.fileButton.name")
        }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import Vue from "vue";
import { ipcRenderer } from "electron";
import { GET_FILE, LOAD_DIALOG } from "../../utils/data/constants";
import { COLUMN_DIALOG, SUCCESS_DIALOG } from "../../utils/data/enums";
import ColumnDialog from "../dialogs/ColumnDialog.vue";
import SuccessDialog from "../dialogs/SuccessDialog.vue";

export default Vue.extend({
  name: "FileButton",

  components: {
    ColumnDialog,
    SuccessDialog,
  },

  data: () => ({
    columnDialog: false,
    successDialog: false,
    successNumber: 0,
  }),

  enums: {
    COLUMN_DIALOG,
    SUCCESS_DIALOG,
  },

  computed: {
    columnCheck() {
      return this.$store.getters.getColumnCheck;
    },
  },

  watch: {
    /**
     * If columnDialog was just closed open load file dialog
     */
    columnDialog(newValue, oldValue) {
      if (newValue == undefined && oldValue) this.openDialog();
    },
  },

  /**
   * Event listener if file get was succesfull
   * Loads payments via addPayments actions
   */
  created() {
    ipcRenderer.on(GET_FILE, (event, arg) => {
      var numberBefore = this.$store.getters.getPayments.length;
      this.$store.commit("addPayments", arg);
      this.successNumber = this.$store.getters.getPayments.length - numberBefore;
      this.successDialog = true;
    });
  },

  methods: {
    /**
     * Route back to the home page
     * Call ipcMain event to load file
     */
    openDialog() {
      this.$router.push("/", () => {});
      ipcRenderer.send(LOAD_DIALOG);
    },

    /**
     * If columnCheck show column dialog
     * else open load file dialog
     */
    clicked() {
      if (!this.columnCheck) this.openDialog();
      else this.columnDialog = true;
    },
  },
});
</script>

