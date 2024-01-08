<template>
  <!-- 真ん中中央ぞろえ -->
  <!-- <v-container class="fill-height" fluid> -->
  <v-container>
    <v-row>
      <v-col cols="6" md="2" v-for="menu in navMenus">
        <HoverIconCard
          :to="menu.to"
          :icon="menu.icon"
          :title="menu.title"
        ></HoverIconCard>
      </v-col>
    </v-row>
    <!-- 管理者のみ -->
    <v-row v-if="userData.role === role.administrator">
      <v-col cols="12" md="12">
        <v-data-table
          :headers="headers"
          :items="logs"
          class="px-6 py-4 rounded no-header"
          :height="200"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>LOG</v-toolbar-title>
            </v-toolbar>
          </template>
          <template v-slot:item.memberID="{ item }">
            <v-btn
              :href="item.memberID"
              variant="text"
            >MEMBER</v-btn>
          </template>
          <template v-slot:item.portfolioID="{ item }">
            <v-btn
              v-if="item.portfolioID"
              :href="item.portfolioID"
              variant="text"
              color="primary"
            >ACTION</v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const navMenus = ref([]);
const user = ref({});
const userData = ref({});
const logs = ref([]);

// component
import HoverIconCard  from '@/components/cards/HoverIconCard.vue';

// firebase
import { getCurrentUser } from '@/firebase/v1/auth';
import { getOneLevelSingleData, getOneLevelAllData } from '@/firebase/v1/firestore';

// utils
import { formatDateForTimestamp } from '@/utils/formatData'; // 日付形式変換
import { role } from '@/utils/category'; // 権限

// menu
import { getMenu } from '@/router/menu';

// メニュー取得
onMounted(async () => {
  try {
    user.value = await getCurrentUser(); // auth情報
    userData.value = await getOneLevelSingleData(user.value.uid, "members"); // db内のuser情報
    navMenus.value = getMenu(user.value, userData.value.role);

    const allDoc = await getOneLevelAllData("logs");

    logs.value = allDoc.map((doc) => ({
      log: doc.log,
      memberID: `/admin/profile/${doc.memberID}`,
      portfolioID: doc.portfolioID ? `/admin/portfolio/${doc.memberID}/${doc.portfolioID}` : '',
      date: formatDateForTimestamp(doc.date),
    }));

  } catch (error) {
    console.error('ユーザーデータ取得エラー', error);
  }
});

const headers = ref([
  {
    title: 'DATE',
    align: 'start',
    sortable: false,
    key: 'date',
  },
  { title: 'LOG', key: 'log' },
  { title: 'MEMBER', key: 'memberID' },
  { title: 'ACTION', key: 'portfolioID' },
]);

</script>

<style>
/* v2のhide-default-headerとhide-default-footerが使えない為自力で */
.v-data-table-footer {
  display: none;
}

div.no-header thead {
  display: none;
}

/* scrollbarの左側に余白 */
div.no-header table {
  padding: 0 10px;
}
</style>
