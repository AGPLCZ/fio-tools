<template>
  <div class="settings">
    <Toolbar :title="$t('settings.title')" />
    <LoginDialog v-model="loginDialog" :type="LOGIN_DIALOG.SETTINGS" />
    <ColumnDialog v-model="columnDialog" :type="COLUMN_DIALOG.SETTINGS" />

    <v-list three-line subheader>
      <v-subheader>{{ $t("settings.user.title") }}</v-subheader>
      <v-list-item link @click="loginDialog = true">
        <v-list-item-content>
          <v-list-item-title>{{
            $t("settings.user.token.title")
          }}</v-list-item-title>
          <v-list-item-subtitle>{{
            $t("settings.user.token.subtitle")
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list three-line subheader>
      <v-subheader>{{ $t("settings.general.title") }}</v-subheader>
      <v-list-item link @click="columnDialog = true">
        <v-list-item-content>
          <v-list-item-title>{{
            $t("settings.general.columnOrder.title")
          }}</v-list-item-title>
          <v-list-item-subtitle>{{
            $t("settings.general.columnOrder.subtitle")
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <LangSelect />
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-action>
          <v-checkbox v-model="columnCheck"></v-checkbox>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{
            $t("settings.general.columnBefore.title")
          }}</v-list-item-title>
          <v-list-item-subtitle>{{
            $t("settings.general.columnBefore.subtitle")
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-action>
          <v-checkbox v-model="saveHeader"></v-checkbox>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{
            $t("settings.general.saveHeader.title")
          }}</v-list-item-title>
          <v-list-item-subtitle>{{
            $t("settings.general.saveHeader.subtitle")
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import Vue from "vue";
import { LOGIN_DIALOG, COLUMN_DIALOG } from "../utils/data/enums";
import Toolbar from "../components/Toolbar.vue";
import LoginDialog from "../components/dialogs/LoginDialog.vue";
import ColumnDialog from "../components/dialogs/ColumnDialog.vue";
import LangSelect from "../components/LangSelect";

export default Vue.extend({
  name: "Settings",

  components: {
    Toolbar,
    LoginDialog,
    ColumnDialog,
    LangSelect,
  },

  data: () => ({
    loginDialog: false,
    columnDialog: false,
  }),

  enums: {
    LOGIN_DIALOG,
    COLUMN_DIALOG,
  },

  computed: {
    columnCheck: {
      get() {
        return this.$store.getters.getColumnCheck;
      },
      set(newValue) {
        this.$store.commit("updateColumnCheck", newValue);
      },
    },
    saveHeader: {
      get() {
        return this.$store.getters.getSaveHeader;
      },
      set(newValue) {
        this.$store.commit("updateSaveHeader", newValue);
      },
    },
  },
});
</script>
