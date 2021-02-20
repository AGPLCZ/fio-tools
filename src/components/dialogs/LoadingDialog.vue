<template>
  <v-dialog
    :value="value"
    @input="$emit('input')"
    persistent
    max-width="235"
  >
    <v-card color="orange" dark>
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

export default Vue.extend({
  name: "LoadingDialog",

  props: {
    value: Boolean,
    msg: String,
  },
});
</script>