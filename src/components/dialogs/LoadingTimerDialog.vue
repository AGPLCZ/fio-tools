<template>
  <v-dialog
    :value="value"
    @input="$emit('input')"
    max-width="235"
  >
    <v-card color="orange" dark>
      <v-card-text class="text-center">
        Data will send in {{ timer }}
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "LoadingTimeDialog",

  props: {
    value: Boolean,
  },
  computed: {
    timer() {
      return this.$store.getters.getTimer;
    },
  },
  watch: {
    timer() {
      if (this.timer == 0) this.$emit("input");
    },
  },
});
</script>