<template>
  <v-select
    ref="jedi"
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
      currentLang: this.$i18n.locale,
    };
  },

  computed: {
    langs() {
      return [
        {
          value: "en",
          text: this.$i18n.t("settings.general.languages.items.en"),
        },
        {
          value: "cs",
          text: this.$i18n.t("settings.general.languages.items.cs"),
        },
      ]
    },
  },

  watch: {
    /**
    * Update lang in store, locale and reloads langs with new translation
    */
    currentLang(newLang) {
      localStorage.setItem("lang", newLang);
      this.$i18n.locale = newLang;
    },
  },
});
</script>