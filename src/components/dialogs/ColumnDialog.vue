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
          <span>{{ $t("columnDialog.title") }}</span>
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
                {{ $t(element.text) }}
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
            {{ $t("columnDialog.default") }}
          </v-btn>
          <v-spacer></v-spacer>
          <div v-if="type == COLUMN_DIALOG.DEFAULT">
            <v-btn color="primary" text @click.native="continueBtn">
              {{ $t("columnDialog.continue") }}
            </v-btn>
          </div>

          <div v-if="type == COLUMN_DIALOG.SETTINGS">
            <v-btn color="primary" text @click.native="$emit('input')">
              {{ $t("columnDialog.close") }}
            </v-btn>
            <v-btn color="primary" text @click.native="saveBtn">
              {{ $t("columnDialog.save") }}
            </v-btn>
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
    fn: Function,
  },

  enums: {
    COLUMN_DIALOG,
  },

  data: () => ({
    dialogSize: BIG_DIALOG_SIZE,
    drag: false,
    columnOrder: [],
  }),

  components: {
    draggable,
  },

  mounted() {
    this.columnOrder = this.$store.getters.getColumnOrder;
  },

  computed: {
    isDefault() {
      return JSON.stringify(this.columnOrder) == JSON.stringify(PAYMENT_PROPS);
    },
  },

  methods: {
    /**
     * Update columnOrder in store and close dialog
     */
    saveBtn() {
      this.$store.commit("updateColumnOrder", this.columnOrder);
      this.$emit("input");
    },

    /**
     * Calls saveBtn function and parent function
     */
    continueBtn() {
      this.saveBtn();
      this.fn();
    },

    /**
     * Reset columOrder to default order
     */
    toDefault() {
      var newValue = [];
      PAYMENT_PROPS.forEach(column => {
        newValue.push(this.columnOrder.find(col => col.value == column.value));
      });
      this.columnOrder = newValue;
    },
  },
});
</script>

<style scoped>
.drageble-list {
  display: flex;
}
</style>
