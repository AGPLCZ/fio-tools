<template>
  <v-navigation-drawer dark permanent left app color="#2C3A47">
    <template v-slot:prepend>
      <v-list-item class="px-2">
        <!-- catching error(routing to same page as user currently is) -->
        <v-list-item-avatar
          @click="$router.push('/', () => {})"
          class="clickable"
        >
          <img src="../assets/account.png" class="mx-auto" />
        </v-list-item-avatar>

        <v-list-item-title>2701933259/2010</v-list-item-title>
      </v-list-item>
    </template>

    <v-divider></v-divider>

    <div class="pa-2">
      <v-btn block class="mt-1" color="orange"> Remove all data </v-btn>
      <v-btn block class="mt-1" color="orange" @click="openDialog">
        Load data
      </v-btn>
    </div>

    <template v-slot:append>
      <v-list dense>
        <v-list-item route to="/settings" active-class="orange--text">
          <v-list-item-icon>
            <v-icon>mdi-wrench</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import { ipcRenderer } from "electron";
import { GET_FILE, OPEN_DIALOG } from "../utils/constants";
import XLSX from "xlsx";

export default Vue.extend({
  name: "NavigationDrawer",

  data: () => ({}),
  mounted() {
    ipcRenderer.on(GET_FILE, (event, arg) => {
      const w = XLSX.readFile(arg);
      const j = XLSX.utils.sheet_to_json(w.Sheets[w.SheetNames[0]], {
        header: 1,
      });
      console.log(j);
    });
  },
  methods: {
    openDialog(): void {
      //Comunicate with electron api
      ipcRenderer.send(OPEN_DIALOG);
    },
  },
});
</script>

<style>
.clickable:hover {
  cursor: pointer;
}
</style>
