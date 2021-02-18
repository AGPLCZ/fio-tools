<template>
  <div>
    <v-dialog :value="value" @input="$emit('input')" max-width="325">
      <v-card>
        <v-card-title primary-title class="justify-center">
          Upload successfull
        </v-card-title>
        <v-card-text class="text-center">
          <p>
            All <b>{{ dataCount }}</b> payments has been uploaded
          </p>
          <p style="padding-right: 5px">
            You can complete your payments
            <span class="link" @click="moreInfo">here</span>
          </p></v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange" text @click.native="$emit('input')"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { shell } from "electron";
import { FIO_PAYMENT_URL } from "../utils/constants";

export default Vue.extend({
  name: "SuccessDialog",

  props: {
    value: Boolean,
    dataCount: {
      type: Number,
      default: 0,
    },
  },

  data: () => ({}),

  mounted() {},

  methods: {
    moreInfo() {
      shell.openExternal(FIO_PAYMENT_URL);
    },
  },
});
</script>

<style scoped>
.link {
  color: orange;
}

.link:hover {
  cursor: pointer;
  text-decoration-line: underline;
}
</style>
