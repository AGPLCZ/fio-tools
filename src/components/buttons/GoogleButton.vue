<template>
  <div>
    <ColumnDialog v-model="columnDialog" :type="COLUMN_DIALOG.DEFAULT" :fn="openDialog"/>
    <GoogleDialog v-model="googleDialog" />
    <v-list-item link @click="clicked" class="pl-10">
      <v-list-item-icon>
        <v-icon>mdi-google</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>{{
          $t("navigationDrawer.googleButton.name")
        }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import Vue from "vue";
import GoogleDialog from "../dialogs/GoogleDialog";
import ColumnDialog from "../dialogs/ColumnDialog";
import { COLUMN_DIALOG } from "../../utils/data/enums";


export default Vue.extend({
  name: "GoogleButton",

  components: {
    GoogleDialog,
    ColumnDialog
  },

  data: () => ({
    googleDialog: false,
    columnDialog: false
  }),

  enums: {
    COLUMN_DIALOG,
  },

  computed: {
    columnCheck() {
      return this.$store.getters.getColumnCheck;
    },
  },

  methods: {
    /**
     * Route to home page if not columnCheck procede else open column dialog
     */
    clicked() {
      this.$router.push("/", () => {});
      if (!this.columnCheck) this.openDialog();
      else this.columnDialog = true;
    },

    /**
     * Open googleDialog
     */
    openDialog() {
      this.googleDialog = true;
    }
  },
});
</script>

