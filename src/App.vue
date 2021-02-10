<template>
  <v-app>
    <LoginDialog v-model="dialog" :login="true"/>

    <v-main :class="{ 'blur-content': dialog }">
      <NavigationDrawer />

      <v-container fluid fill-height>
        <v-layout child-flex>
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import NavigationDrawer from "./components/NavigationDrawer.vue";
import LoginDialog from "./components/LoginDialog.vue";

export default Vue.extend({
  name: "App",

  components: { NavigationDrawer, LoginDialog },

  data: () => ({
    dialog: true,
  }),

  mounted() {
    // localStorage.clear();
    this.dialog = localStorage.getItem("token") == null;
  },
});
</script>

<style>
.blur-content {
  filter: blur(5px);
}
</style>