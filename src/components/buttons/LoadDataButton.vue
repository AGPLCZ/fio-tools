<template>
  <div>
    <ColumnDialog v-model="columnDialog" :type="COLUMN_DIALOG.DEFAULT" />

    <v-btn block color="primary" class="mt-1" @click="clicked">
      Load data
    </v-btn>
  </div>
</template>

<script>
import Vue from "vue";
import { ipcRenderer } from "electron";
import { GET_FILE, LOAD_DIALOG } from "../../utils/data/constants";
import { COLUMN_DIALOG } from "../../utils/data/enums";
import ColumnDialog from "..//dialogs/ColumnDialog.vue";

export default Vue.extend({
  name: "ButtonLoadData",

  components: {
    ColumnDialog,
  },

  data: () => ({
    columnDialog: false,
  }),

  enums: {
    COLUMN_DIALOG,
  },

  computed: {
    columnCheck() {
      return this.$store.getters.getColumnCheck;
    },
  },

  watch: {
    columnDialog(newValue, oldValue) {
      if (newValue == undefined && oldValue) this.openDialog();
    },
  },

  created() {
    ipcRenderer.on(GET_FILE, (event, arg) => {
      this.$store.commit("addPayments", arg);
    });
  },

  methods: {
    openDialog() {
      ipcRenderer.send(LOAD_DIALOG);
      this.$router.push("/", () => {});
    },

    clicked() {
      if (!this.columnCheck) this.openDialog();
      else this.columnDialog = true;
    },
  },
});
</script>

