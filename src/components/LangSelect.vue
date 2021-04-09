<template>
  <v-select
    :items="langs"
    :item-text="item => $t(item.text)"
    v-model="currentLang"
    :label="$t('settings.general.languages.title')"
    dense
  ></v-select>
</template>

<script>
import Vue from "vue";
import { LANGUAGES } from "../utils/data/collections";

export default Vue.extend({
  name: "LangSelect",
  data() {
    return {
      langs: LANGUAGES,
      currentLang: this.$i18n.locale,
    };
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