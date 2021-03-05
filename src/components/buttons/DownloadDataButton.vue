<template>
  <div>
    <DownloadDialog v-model="downloadDialog" />
    <v-btn block outlined class="mt-1" color="primary" @click="clicked">
      {{ $t("navigationDrawer.downloadButton.name") }}
    </v-btn>
  </div>
</template>

<script>
import Vue from "vue";
import DownloadDialog from "../dialogs/DownloadDialog";

export default Vue.extend({
  name: "DownloadDataButton",

  components: {
    DownloadDialog,
  },

  data: () => ({
    downloadDialog: false,
  }),

  methods: {
    clicked() {
      this.$router.push("/", () => {});
      this.downloadDialog = true;
    },
  },
});
</script>

