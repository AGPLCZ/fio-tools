<template>
  <div>
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

export default Vue.extend({
  name: "GoogleButton",

  components: {
    GoogleDialog,
  },

  data: () => ({
    googleDialog: false,
  }),

  methods: {
    /**
     * Open googleDialog
     */
    clicked() {
      this.$router.push("/", () => {});
      this.googleDialog = true;
    },
  },
});
</script>

