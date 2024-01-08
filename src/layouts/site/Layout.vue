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
          ログイン
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

    <v-main class="bg-white">
    <!-- <v-main class="bg-grey-lighten-3"> -->
      <v-container>
        <v-row>
          <v-col cols="12" md="9">
            <router-view />
          </v-col>
          <v-col cols="12" md="3">
            <v-hover v-for="n in 3" :key="n">
              <template v-slot:default="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :color="isHovering ? 'grey' : undefined"
                  variant="tonal"
                  height="120"
                  class="d-flex justify-center align-center mb-2"
                >サンプルバナー</v-card>
              </template>
            </v-hover>
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
    title: 'ホーム',
    to: '/'
  },
  {
    title: '加入案内',
    to: '/info'
  },
  {
    title: '組合員紹介',
    to: '/list'
  },
];

</script>


