<template>
  <div>
    <DownloadDialog v-model="downloadDialog" />
    <v-list-item link @click="clicked" class="pl-10">
      <v-list-item-icon>
        <v-icon>mdi-bank</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>{{
          $t("navigationDrawer.apiButton.name")
        }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import Vue from "vue";
import DownloadDialog from "../dialogs/DownloadDialog";

export default Vue.extend({
  name: "ApiButton",

  components: {
    DownloadDialog,
  },

  data: () => ({
    downloadDialog: false,
  }),

  methods: {
    /**
     * Open downloadDialog
     */
    clicked() {
      this.$router.push("/", () => {});
      this.downloadDialog = true;
    },
  },
});
</script>

