<template>
  <v-dialog :value="value" @input="$emit('input')" :max-width="dialogSize">
    <v-card v-if="type == SUCCESS_DIALOG.SEND">
      <v-card-title primary-title class="justify-center">
        Upload successfull
      </v-card-title>
      <v-card-text style="margin-top: -10px" class="text-center">
        <p style="padding-right: 5px">
          You can complete your payments
          <span class="link" @click="moreInfo">here</span>
        </p></v-card-text
      >
      <v-card-actions style="margin-top: -40px">
        <v-btn block color="primary" text @click.native="$emit('input')">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-if="type == SUCCESS_DIALOG.SAVE">
      <v-card-title primary-title class="justify-center">
        Export successfull
      </v-card-title>
      <v-card-text style="margin-top: -10px" class="text-center">
        <p style="padding-right: 5px">
          Your payments has been successfully saved
        </p></v-card-text
      >
      <v-card-actions style="margin-top: -40px">
        <v-btn block color="primary" text @click.native="$emit('input')">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-if="type == SUCCESS_DIALOG.DOWNLOAD">
      <v-card-title primary-title class="justify-center">
        Import successfull
      </v-card-title>
      <v-card-text style="margin-top: -10px" class="text-center">
        <p v-if="number > 0" style="padding-right: 5px">
          All <b>{{ number }}</b> payments has been successfully downloaded
        </p>

        <p v-else style="padding-right: 5px">No Payment found</p>
      </v-card-text>
      <v-card-actions style="margin-top: -40px">
        <v-btn block color="primary" text @click.native="$emit('input')">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from "vue";
import { shell } from "electron";
import { FIO_PAYMENT_URL, SMALL_DIALOG_SIZE } from "../../utils/data/constants";
import { SUCCESS_DIALOG } from "../../utils/data/enums";

export default Vue.extend({
  name: "SuccessDialog",

  props: {
    value: Boolean,
    type: SUCCESS_DIALOG,
    number: Number,
  },

  data: () => ({
    dialogSize: SMALL_DIALOG_SIZE,
  }),

  enums: {
    SUCCESS_DIALOG,
  },

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
