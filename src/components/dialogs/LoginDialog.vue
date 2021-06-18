<template>
  <div>
    <LoadingDialog
      v-model="loadingDialog"
      :msg="$t('loginDialog.loadingDialog')"
    />

    <v-dialog
      :value="value"
      @input="$emit('input')"
      persistent
      :max-width="dialogSize"
    >
      <v-card v-if="!loadingDialog">
        <v-card-title>
          <span>{{ $t("loginDialog.title") }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-if="errorMsg"
            v-model="token"
            label="Token"
            color="primary"
            :maxlength="maxSize"
            :counter="maxSize"
            error
            :error-messages="errorMsg"
          ></v-text-field>

          <v-text-field
            v-else
            v-model="token"
            label="Token"
            color="primary"
            :maxlength="maxSize"
            :counter="maxSize"
          ></v-text-field>

          <p style="padding-right: 5px">
            {{ $t("loginDialog.text") }}
            <span class="link" @click="moreInfo">{{
              $t("loginDialog.link")
            }}</span>
          </p>
        </v-card-text>
        <v-card-actions v-if="type == LOGIN_DIALOG.SETTINGS">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click.native="closeDialog">
            {{ $t("loginDialog.close") }}
          </v-btn>
          <v-btn color="primary" text @click.native="saveToken">
            {{ $t("loginDialog.save") }}
          </v-btn>
        </v-card-actions>

        <v-card-actions v-if="type == LOGIN_DIALOG.DEFAULT">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click.native="saveToken">
            {{ $t("loginDialog.validate") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { shell } from "electron";
import {
  FIO_INFO_URL,
  FIO_API_PREFIX,
  TOKEN_MAX_SIZE,
} from "../../utils/data/constants";
import LoadingDialog from "../dialogs/LoadingDialog";
import { LOGIN_DIALOG } from "../../utils/data/enums";
import { BIG_DIALOG_SIZE, API_COUNTDOWN } from "../../utils/data/constants";
import { getDate } from "../../utils/tools";

export default Vue.extend({
  name: "LoginDialog",

  props: {
    value: Boolean,
    type: LOGIN_DIALOG,
  },

  enums: {
    LOGIN_DIALOG,
  },

  components: {
    LoadingDialog,
  },

  data: () => ({
    dialogSize: BIG_DIALOG_SIZE,
    token: "",
    loadingDialog: false,
    errorMsg: "",
    maxSize: TOKEN_MAX_SIZE,
  }),

  mounted() {
    this.updateToken();
  },

  computed: {
    urlAPI() {
      const date = getDate();
      return (
        FIO_API_PREFIX +
        "/" +
        "periods" +
        "/" +
        this.token +
        "/" +
        date +
        "/" +
        date +
        "/" +
        "transactions.json"
      );
    },
  },

  methods: {
    /**
     * Set token based on localStorage
     */
    updateToken() {
      this.token = localStorage.getItem("token");
    },

    /**
     * Open external link
     */
    moreInfo() {
      shell.openExternal(FIO_INFO_URL);
    },

    /**
     * loading dialog while waiting for responce from API
     * if token has changed or is not empty calls Get request
     * update token, start API timer and close dialog
     * in case of error set error msg
     */
    async saveToken() {
      if (!this.token || this.token != localStorage.getItem("token")) {
        this.loadingDialog = true;
        await this.$store
          .dispatch("getUser", this.urlAPI)
          .then(() => {
            localStorage.setItem("token", this.token);
            this.$store.commit("apiCooldownReset", API_COUNTDOWN);
            this.closeDialog();
          })
          .catch(() => {
            this.errorMsg = this.$i18n.t("loginDialog.errorMsg");
          })
          .finally(() => {
            this.loadingDialog = false;
          });
      } else {
        this.closeDialog();
      }
    },

    /**
     * Close dialog, erase errorMsg, update token to last valid value
     */
    closeDialog() {
      this.$emit("input");
      this.errorMsg = "";
      this.updateToken();
    },
  },
});
</script>

<style scoped>
.link {
  color: var(--v-primary-base);
}

.link:hover {
  cursor: pointer;
  text-decoration-line: underline;
}
</style>
