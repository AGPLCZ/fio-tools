<template>
  <div>
    <v-dialog
      :value="value"
      @input="$emit('input')"
      persistent
      max-width="650px"
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
          <v-btn color="primary" text @click.native="$emit('input')">
            Close
          </v-btn>
          <v-btn color="primary" text @click.native="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { PAYMENT_PROPS } from "../../utils/data/collections";
import draggable from "vuedraggable";

export default Vue.extend({
  name: "ColumnDialog",

  props: {
    value: Boolean,
  },

  components: {
    draggable,
  },

  computed: {
    isDefault() {
      return this.columnOrder == PAYMENT_PROPS;
    },
  },

  data: () => ({
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
