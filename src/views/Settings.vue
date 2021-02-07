<template>
  <div class="settings">
    <Toolbar title="Settings" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Toolbar from "../components/Toolbar.vue";

export default Vue.extend({
  name: "Settings",

  components: {
    Toolbar,
  }
});
</script>
