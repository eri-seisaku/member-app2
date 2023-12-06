<template>
  <v-app id="inspire">


    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>Application</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary fixed>
      <v-list>
        <v-list-item
          v-for="menu in navMenus"
          :key="menu.title"
          :prepend-icon="menu.icon"
          :title="menu.title"
          :to="menu.to"
          :exact="true"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(null)


const navMenus = [
  {
    title: 'ホーム',
    to: '/'
  },
  {
    title: 'チェック',
    to: "/check"
  },
  {
    title: 'ログイン',
    to: '/login'
  },
  {
    title: 'リスト',
    to: "/list"
  },
];
</script>
