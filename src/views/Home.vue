<template>
  <div class="home">
    <v-toolbar flat>
      <v-text-field
        v-model="search"
        width="25%"
        append-icon="mdi-magnify"
        :label="$t('home.filter.search')"
        single-line
        hide-details
      ></v-text-field>

      <v-chip
        v-if="!valid"
        class="ma-2"
        :color="payments.length ? 'green' : 'grey'"
        text-color="white"
        @click="setInvalid"
        :disabled="payments.length == 0"
      >
        {{ $t("home.filter.all") }}
      </v-chip>

      <v-chip
        v-else
        class="ma-2"
        :color="payments.length ? 'red' : 'grey'"
        text-color="white"
        @click="setInvalid"
        :disabled="payments.length == 0"
      >
        {{ $t("home.filter.invalid") }}
      </v-chip>

      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            :disabled="!selected.length"
            @click="editSelected"
            color="#2C3A47"
            class="mb-2 mr-2"
            icon
            small
          >
            <v-icon> mdi-pencil </v-icon>
          </v-btn>
        </template>
        <span>{{ $t("home.editButton.toolTip") }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            :disabled="!selected.length"
            @click="deleteSelected"
            color="error"
            class="mb-2 mr-2"
            icon
            small
          >
            <v-icon> mdi-delete </v-icon>
          </v-btn>
        </template>
        <span>{{ $t("home.deleteButton.toolTip") }}s</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            color="primary"
            dark
            class="mb-2"
            @click="addPayment"
          >
            {{ $t("home.addButton.name") }}
          </v-btn>
        </template>
        <span>{{ $t("home.addButton.toolTip") }}</span>
      </v-tooltip>
    </v-toolbar>
    <PaymentsTable :search="search" :valid="valid" />
  </div>
</template>

<script>
import Vue from "vue";
import PaymentsTable from "../components/PaymentsTable.vue";

export default Vue.extend({
  name: "Home",

  data: () => ({
    valid: true,
    search: "",
  }),

  components: {
    PaymentsTable,
  },

  computed: {
    payments() {
      return this.$store.getters.getPayments;
    },

    selected() {
      return this.$store.getters.getSelected;
    },
  },

  watch: {
    payments: {
      deep: true,
      handler() {
        this.valid = true;
      },
    },
  },

  methods: {
    setInvalid() {
      this.valid = !this.valid;
    },

    addPayment() {
      this.$router.push("/payments");
    },

    editSelected() {
      this.$router.push("/payments/" + Infinity);
    },

    deleteSelected() {
      this.selected.forEach((item) => {
        this.$store.commit("removePayment", item.id);
      });
      this.$store.commit("updateSelected", []);
    },
  },
});
</script>
