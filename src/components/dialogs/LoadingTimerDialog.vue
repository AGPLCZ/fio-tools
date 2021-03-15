<template>
  <v-dialog :value="value" @input="$emit('input')" :max-width="dialogSize">
    <v-card color="primary" dark>
      <v-card-text class="text-center">
        {{ msg }} {{ timer }}
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
import { SMALL_DIALOG_SIZE } from "../../utils/data/constants";

export default Vue.extend({
  name: "LoadingTimeDialog",

  props: {
    value: Boolean,
    msg: String,
    fn: Function,
  },

  data: () => ({
    dialogSize: SMALL_DIALOG_SIZE,
  }),

  computed: {
    timer() {
      return this.$store.getters.getTimer;
    },
  },

  watch: {
    /**
    * If timer ends close this dialog
    */
    timer() {
      if (this.timer == 0 && this.value) {
        this.fn();
        this.$emit("input");
      }
    },
  },
});
</script>