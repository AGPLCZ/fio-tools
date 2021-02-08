<template>
  <v-app>
    <NavigationDrawer />

    <v-main>
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

export default Vue.extend({
  name: "App",

  components: { NavigationDrawer },

  data: () => ({}),
});
</script>