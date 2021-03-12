<template>
  <div>
    <LoadingDialog
      v-model="loadingDialog"
      :msg="$t('googleDialog.loadingDialog')"
    />
    <SuccessDialog
      v-model="successDialog"
      :type="SUCCESS_DIALOG.LOAD"
      :number="successNumber"
    />
    <v-dialog
      :value="value"
      @input="$emit('input')"
      persistent
      :max-width="dialogSize"
    >
      <v-card v-if="!loadingDialog">
        <v-card-title>
          <span class="headline">{{ $t("googleDialog.title") }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="url"
              :rules="[() => urlValid || $t('googleDialog.url.message')]"
              :label="$t('googleDialog.url.name')"
              color="primary"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click.native="closeDialog">
            {{ $t("googleDialog.close") }}
          </v-btn>
          <v-btn color="primary" text @click.native="clicked">
            {{ $t("googleDialog.download") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import {
  BIG_DIALOG_SIZE,
  GOOGLE_API_PREFIX,
  GOOGLE_API_POSTFIX,
  GOOGLE_URL_PREFIX,
  ERROR_DIALOG,
} from "../../utils/data/constants";
import { SUCCESS_DIALOG } from "../../utils/data/enums";
import { ipcRenderer } from "electron";
import LoadingDialog from "../dialogs/LoadingDialog";
import SuccessDialog from "../dialogs/SuccessDialog";

export default Vue.extend({
  name: "LoginDialog",

  props: {
    value: Boolean,
  },

  components: {
    LoadingDialog,
    SuccessDialog,
  },

  enums: {
    SUCCESS_DIALOG,
  },

  data: () => ({
    dialogSize: BIG_DIALOG_SIZE,
    loadingDialog: false,
    successDialog: false,
    successNumber: 0,
    valid: true,
    url: "",
    urlValid: true,
  }),

  watch: {
    /**
     * If dialog is open then initialize params
     */
    value(newValue) {
      if (newValue) {
        this.url = "";
      }
    },
  },

  computed: {
    sheetId() {
      var res = this.url.substring(this.url.indexOf("/d/") + "/d/".length);
      return res.substring(0, res.indexOf("/"));
    },
    urlAPI() {
      return GOOGLE_API_PREFIX + this.sheetId + GOOGLE_API_POSTFIX;
    },
  },

  /**
   * Validates url, tries to validate form If succeded show loadingTimerDialog
   * loading dialog while waiting for responce from API
   * update payments to store and shows success dialog
   * in case of error show errorDialog or response == null
   * close all open dialogs and start timer
   */
  methods: {
    async clicked() {
      this.urlValid = this.url.startsWith(GOOGLE_URL_PREFIX);
      if (this.$refs.form.validate()) {
        this.loadingDialog = true;
        await this.$store
          .dispatch("getDataGoogle", this.urlAPI)
          .then((response) => {
            if (response) {
              this.$store.commit(
                "setPayments",
                response.concat(this.$store.getters.getPayments)
              );
              this.successNumber = response.length;
              this.$emit("input");
              this.successDialog = true;
            } else {
              ipcRenderer.send(
                ERROR_DIALOG,
                this.$i18n.t("googleDialog.error"),
                this.$i18n.t("electron.error")
              );
            }
          })
          .catch((e) => {
            ipcRenderer.send(ERROR_DIALOG, e, this.$i18n.t("electron.error"));
          })
          .finally(() => {
            this.loadingDialog = false;
          });
      }
    },
    closeDialog() {
      this.$emit("input");
    },
  },
});
</script>
