<template>
  <v-row>
    <v-toolbar flat>
      <v-btn icon class="hidden-xs-only" @click="$router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{title}}</v-toolbar-title>
    </v-toolbar>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Toolbar",

  props: {
      title: String
  }
});
</script>

