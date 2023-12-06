<template>
  <v-row>
    <v-col cols="12" v-if="errorMessage">
      <p>{{ errorMessage }}</p>
    </v-col>
    <v-col cols="12" v-else-if="!loading && portfolios.length === 0">
      <p>投稿はありません</p>
    </v-col>
    <v-col cols="12" md="4" v-for="(item, index) in portfolios" :key="index">
      <v-img
        class="mx-auto event-img"
        aspect-ratio="16/9"
        cover
        @click="openDialog(index)"
        :src="item.filePath"
      ></v-img>

      <Dialog v-model:dialog="item.dialog" :size="448">
        <template v-slot:content>
          <v-img
            class="mx-auto"
            aspect-ratio="16/9"
            cover
            :src="item.filePath"
          ></v-img>
          <h3 class="text-h5 my-5">タイトル：{{ item.title }}</h3>
          <p>投稿日：{{ item.date }}</p>
          <p>コメント：{{ item.comment }}</p>
          <a :href="item.website" target="_blank" rel="noopener">WEB SITE</a>
        </template>
      </Dialog>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const portfolios = ref([]);
const loading = ref(true); // データのロード状態を表す変数
const errorMessage = ref('');

// component
import Dialog from '@/components/Dialog.vue';

const props = defineProps({
  userID: String,
});
// console.log(props.userID);

// firebase
import { getTwoLevelAllData } from '@/firebase/v1/firestore';

// utils
import { formatDateForTimestamp } from '@/utils/formatData'; // 日付形式変換

// 取得
onMounted(async () => {
  try {
    const allDoc = await getTwoLevelAllData(props.userID, 'portfolios', 'portfolio');

    portfolios.value = allDoc.map((doc) => ({
      title: doc.title,
      id: doc.id,
      comment: doc.comment,
      filePath: doc.filePath,
      website: doc.website,
      date: formatDateForTimestamp(doc.date),
    }));

    loading.value = false;

  } catch (error) {
    console.error('データ取得エラー', error);
    errorMessage.value = error;
    loading.value = false;
  }
});

const openDialog = (index) => {
  portfolios.value[index].dialog = true;
};

</script>

<style>
.event-img {
  cursor: pointer;
}
.event-img:hover {
  opacity: 0.5;
}
</style>
