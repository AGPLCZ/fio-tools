<template>
  <v-dialog :value="value" @input="$emit('input')" persistent :max-width="dialogSize">
    <v-card color="primary" dark>
      <v-card-text class="text-center">
        {{ msg }}
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
  name: "LoadingDialog",

  props: {
    value: Boolean,
    msg: String,
  },

  data: () => ({
    dialogSize: SMALL_DIALOG_SIZE,
  }),
});
</script>