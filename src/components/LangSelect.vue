<template>
  <v-select
    :items="langs"
    v-model="currentLang"
    :label="$t('settings.general.languages.title')"
    dense
  ></v-select>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "LangSelect",
  data() {
    return {
      langs: [
        { value: "en", text: this.$i18n.t("settings.general.languages.items.en") },
        { value: "cs", text: this.$i18n.t("settings.general.languages.items.cs") },
      ],
      currentLang: this.$i18n.locale,
    };
  },

  mounted() {
    if (localStorage.currentLang)
      this.currentLang = localStorage.getItem("lang");
  },

  watch: {
    currentLang(newLang) {
      localStorage.setItem("lang", newLang);
      this.$i18n.locale = newLang;
      this.langs = [
        { value: "en", text: this.$i18n.t("settings.general.languages.items.en") },
        { value: "cs", text: this.$i18n.t("settings.general.languages.items.cs") },
      ];
    },
  },
});
</script>