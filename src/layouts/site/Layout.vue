<template>
  <v-app id="inspire">
    <v-app-bar app flat>
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        class="d-block d-md-none"
      />

      <v-app-bar-title style="cursor: pointer" @click="$router.push({ name: 'Home' })">LOGO</v-app-bar-title>

        <v-tabs
          class="d-none d-md-block"
          centered
        >
          <v-tab
            v-for="menu in navMenus"
            :key="menu.title"
            :to="menu.to"
          >
            {{ menu.title }}
          </v-tab>
        </v-tabs>

        <v-spacer></v-spacer>

        <v-btn
          class="mr-4"
          variant="outlined"
          href='/login'
        >
          LOGIN
        </v-btn>

    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
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


    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col cols="12" md="10">
            <v-sheet
              min-height="70vh"
              rounded="lg"
              class="pa-8"
            >
              <router-view />
            </v-sheet>
          </v-col>
          <v-col cols="12" md="2">
            <v-sheet rounded="lg">
              <v-list rounded="lg">
                <v-list-item
                  v-for="n in 5"
                  :key="n"
                  link
                  :title="`List Item ${n}`"
                ></v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item
                  color="grey-lighten-4"
                  link
                  title="Refresh"
                ></v-list-item>
              </v-list>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
const drawer = ref(false)

onMounted(() => {
  const resizeHandler = (e) => {
    if (!(e instanceof UIEvent)) {
      drawer.value = false;
    }
  };
  window.addEventListener("resize", resizeHandler);

  // リサイズは頻繁にあるのでメモリを圧迫しないように削除する
  onBeforeUnmount(() => {
    window.removeEventListener("resize", resizeHandler);
  });
});

const navMenus = [
  {
    title: 'HOME',
    to: '/'
  },
  {
    title: 'CHECK',
    to: '/check'
  },
  {
    title: 'LIST',
    to: '/list'
  },
];

// components
import HoverImgCard from '@/components/cards/HoverImgCard.vue';

</script>


