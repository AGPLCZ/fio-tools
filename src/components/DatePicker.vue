<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="computedDateFormatted"
        :label="msg"
        persistent-hint
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      :min="minDate"
      :max="maxDate"
      :locale="$i18n.locale"
      show-adjacent-months
      color="primary"
      v-model="localDate"
      no-title
      @input="change"
    ></v-date-picker>
  </v-menu>
</template>


<script>
import Vue from "vue";

export default Vue.extend({
  name: "DatePicker",

  props: {
    // props for params send as v-model
    value: String,
    msg: String,
    minDate:String,
    maxDate:String,
  },

  data: () => ({
    menu: false,
    localDate: "",
  }),


  mounted() {
    this.localDate = this.value;
  },

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.localDate);
    },
  },

  watch: {
    value(newValue) {
      this.localDate = newValue;
    },
  },

  methods: {
    /**
     * Close menu and update input to parrent component
     */
    change() {
      this.menu = false;
      this.$emit("input", this.localDate);
    },

    /**
    * Fomat date to specific format
    * @param {string date} date 
    */
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}.${month}.${year}`;
    },
  },
});
</script>