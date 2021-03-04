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
      show-adjacent-months
      color="primary"
      v-model="localDate"
      no-title
      @input="change"
    ></v-date-picker>
  </v-menu>
</template>


<script>
export default {
  name: "DatePicker",

  props: {
    msg: String,
    minDate: {
        default: '',
        type: String,
    },
    maxDate: {
        default: '',
        type: String,
    }
  },

  data: () => ({
    menu: false,
    localDate: "",
  }),

  mounted(){
      this.localDate = new Date().toISOString().substr(0, 10);
  },

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.localDate);
    },
  },

  methods: {
    change() {
      this.menu = false;
      this.$emit("input", this.localDate);
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}.${month}.${year}`;
    },
  },
};
</script>