<template>
  <div>
    <v-dialog
      :value="value"
      @input="$emit('input')"
      persistent
      :max-width="dialogSize"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Set your column layout</span>
        </v-card-title>
        <v-card-text>
          <draggable
            class="drageble-list"
            v-model="columnOrder"
            group="people"
            @start="drag = true"
            @end="drag = false"
          >
            <div
              class="pr-2"
              v-for="element in columnOrder"
              :key="element.value"
            >
              <v-card class="pa-2 text-center elevation-1" height="60px">
                {{ element.text }}
              </v-card>
            </div>
          </draggable>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            :disabled="isDefault"
            text
            @click.native="toDefault"
          >
            Default
          </v-btn>
          <v-spacer></v-spacer>
          <div v-if="type == COLUMN_DIALOG.DEFAULT">
            <v-btn color="primary" text @click.native="save"> Continue </v-btn>
          </div>

          <div v-if="type == COLUMN_DIALOG.SETTINGS">
            <v-btn color="primary" text @click.native="$emit('input')">
              Close
            </v-btn>
            <v-btn color="primary" text @click.native="save"> Save </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { PAYMENT_PROPS } from "../../utils/data/collections";
import { COLUMN_DIALOG } from "../../utils/data/enums";
import { BIG_DIALOG_SIZE } from "../../utils/data/constants";
import draggable from "vuedraggable";

export default Vue.extend({
  name: "ColumnDialog",

  props: {
    value: Boolean,
    type: COLUMN_DIALOG,
  },

  enums: {
    COLUMN_DIALOG,
  },

  components: {
    draggable,
  },

  computed: {
    isDefault() {
      return JSON.stringify(this.columnOrder) == JSON.stringify(PAYMENT_PROPS);
    },
  },

  data: () => ({
    dialogSize: BIG_DIALOG_SIZE,
    drag: false,
    columnOrder: [],
  }),

  mounted() {
    this.columnOrder = this.$store.getters.getColumnOrder;
  },

  methods: {
    save() {
      this.$store.commit("updateColumnOrder", this.columnOrder);
      this.$emit("input");
    },

    toDefault() {
      this.columnOrder = PAYMENT_PROPS;
    },
  },
});
</script>

<style scoped>
.drageble-list {
  display: flex;
}
</style>
