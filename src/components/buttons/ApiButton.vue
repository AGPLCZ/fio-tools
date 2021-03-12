<template>
  <div>
    <ApiDialog v-model="apiDialog" />
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
import ApiDialog from "../dialogs/ApiDialog";

export default Vue.extend({
  name: "ApiButton",

  components: {
    ApiDialog,
  },

  data: () => ({
    apiDialog: false,
  }),

  methods: {
    /**
     * Open apiDialog
     */
    clicked() {
      this.$router.push("/", () => {});
      this.apiDialog = true;
    },
  },
});
</script>

