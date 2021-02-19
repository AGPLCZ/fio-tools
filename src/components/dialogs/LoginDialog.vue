<template>
  <div>
    <LoadingDialog v-model="loading" :size="650" msg="Validating token" />

    <v-dialog
      :value="value"
      @input="$emit('input')"
      persistent
      max-width="650px"
    >
      <v-card v-if="!loading">
        <v-card-title>
          <span class="headline">Set your API token</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-if="errorMsg"
            v-model="token"
            label="Token"
            color="orange"
            :maxlength="maxSize"
            :counter="maxSize"
            error
            :error-messages="errorMsg"
          ></v-text-field>

          <v-text-field
            v-else
            v-model="token"
            label="Token"
            color="orange"
            :maxlength="maxSize"
            :counter="maxSize"
          ></v-text-field>

          <p style="padding-right: 5px">
            For more information click
            <span class="link" @click="moreInfo">here</span>
          </p>
        </v-card-text>
        <v-card-actions v-if="!login">
          <v-spacer></v-spacer>
          <v-btn color="orange" text @click.native="closeDialog"> Close </v-btn>
          <v-btn color="orange" text @click.native="saveToken"> Save </v-btn>
        </v-card-actions>

        <v-card-actions v-else>
          <v-spacer></v-spacer>
          <v-btn color="orange" text @click.native="saveToken">
            Validate
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
  TOKEN_ERROR_MSG,
} from "../../utils/data/constants";
import LoadingDialog from "../dialogs/LoadingDialog";

export default Vue.extend({
  name: "LoginDialog",

  props: {
    value: Boolean,
    login: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    LoadingDialog,
  },

  data: () => ({
    token: "",
    loading: false,
    errorMsg: "",
    maxSize: TOKEN_MAX_SIZE,
  }),

  mounted() {
    this.updateToken();
  },

  computed: {
    urlAPI() {
      const date = new Date().toISOString().slice(0, 10);
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
    updateToken() {
      this.token = localStorage.getItem("token");
    },

    moreInfo() {
      shell.openExternal(FIO_INFO_URL);
    },

    async saveToken() {
      if (!this.token || this.token != localStorage.getItem("token")) {
        this.loading = true;
        await this.$store
          .dispatch("getUser", this.urlAPI)
          .then(() => {
            localStorage.setItem("token", this.token);
            this.errorMsg = "";
            this.$emit("input");
          })
          .catch((e) => {
            console.log(e);
            this.errorMsg = TOKEN_ERROR_MSG;
          })
          .finally(() => {
            this.loading = false;
            this.$store.commit("apiCooldown", 30);
          });
      } else {
        this.closeDialog();
      }
    },

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
  color: orange;
}

.link:hover {
  cursor: pointer;
  text-decoration-line: underline;
}
</style>