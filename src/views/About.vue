<template>
  <div class="about">
    <Toolbar :title="$t('about.title')" />
    <div class="pt-5">
      <div class="pb-2">
        <p v-html="$t('about.text')"></p>
      </div>
      <div>
        <p style="margin-bottom: 0px" v-html="$t('about.info', { version: currVersion })">
        </p>
        <p>
          <b style="padding-right: 5px">{{ $t("about.repo") }}</b>
          <span class="link" @click="moreInfo">Github</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { shell } from "electron";
import Toolbar from "../components/Toolbar.vue";
import { version } from "../../package.json";

export default Vue.extend({
  name: "About",

  components: {
    Toolbar,
  },

  data: () => ({
    currVersion: version,
  }),
  methods: {
    /**
     * Open external link
     */
    moreInfo() {
      shell.openExternal("https://github.com/lopapex/FIO-Tool");
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
