<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :color="color"
    >
      <v-sheet
        :color="color"
        class="pa-4"
        :height="64"
      >
        <v-img
          class="mx-auto"
          sizes="128"
          src="@/assets/logo-vuetify-white.svg"
        ></v-img>
      </v-sheet>

      <v-divider></v-divider>

      <v-sheet
        :color="color"
        class="pa-4 text-center"
      >
        <v-avatar
          class="mb-4"
          color="white"
          size="64"
        >
        <v-img
          cover
          :src="imageSrc"
          aspect-ratio="1/1"
        ></v-img>
        </v-avatar>

        <div>{{ user.email }}</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item
          v-for="menu in navMenus"
          :key="menu.title"
          :prepend-icon="menu.icon"
          :title="menu.title"
          :to="menu.to"
          :exact="true"
        ></v-list-item>
      </v-list>

      <!-- 動く矢印 -->
      <MoveArrow :move-y="arrowMovePx"/>
      <!-- /動く矢印 -->

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            block
            @click="logoutUser"
          >
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      flat
      hide-on-scroll
      color="background"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>
        <h2 class="text-h5">{{ title }}</h2>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer app absolute color="background">
      <v-col cols="12">
        <span>© 2023</span>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
const drawer = ref(null);
const color = ref('');
const navMenus = ref([]);
const user = ref({}); // authのデータ用
const userData = ref({}); // firestoreのデータ用
const imageSrc = ref('');
const linkHeight = ref(50); // 動く矢印用
const isReady = ref(false);

// router
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

// component
import MoveArrow from '@/components/MoveArrow.vue';

// ページのタイトルを取得
const arrowMovePx = computed(() => {
  // console.log(route.meta.index);
  return route.meta.index * linkHeight.value;
});

// ページのタイトルを取得
const title = computed(() => {
  return route.meta.title || 'Default Title';
});

// firebase
import { getCurrentUser, logout } from '@/firebase/v1/auth';
import { getOneLevelSingleData } from '@/firebase/v1/firestore';

// menu
import { getMenu } from '@/router/menu';

// utils
import { role } from '@/utils/category'; // 権限

// メニュー取得
onMounted(async () => {
  try {
    user.value = await getCurrentUser();
    userData.value = await getOneLevelSingleData(user.value.uid, "members");

    if (userData.value.profileIcon && userData.value.profileIcon.url) {
      imageSrc.value = userData.value.profileIcon.url;
    }

    navMenus.value = getMenu(user.value, userData.value.role);

    if (userData.value.role === role.administrator) {
      color.value = 'administrator';
    } else {
      color.value = 'member';
    }

    isReady.value = true;

  } catch (error) {
    console.error('ユーザーデータ取得エラー', error);
  }
});

// ログアウト処理
const logoutUser = () => {
  logout();
  // router.push('/');
  router.push({ name: 'Home' });
}
</script>

