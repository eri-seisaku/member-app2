<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          class="bg-white"
          variant="outlined"
          href='/admin/post'
        >
          新規追加
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-sheet class="pa-2" rounded>
          <v-data-table
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="portfolios"
            :loading="loading"
          >
            <template v-slot:item.id="{ item }">
              <v-btn
                variant="text"
                @click="moveNextPage(item.columns.id)"
              ><v-icon> mdi-pencil </v-icon>編集</v-btn>
            </template>
            <template v-slot:item.filePath="{ item }">
              <v-img
                :width="100"
                :src="item.filePath"
                class="pa-6"
              ></v-img>
            </template>
          </v-data-table>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// 初期値
import { ref, onMounted } from "vue";
const user = ref('');
const portfolios = ref([]);

const message = ref('');
const errorMessage = ref('');


const itemsPerPage = 10;
const loading = ref(true);
const headers = [
  {
    title: 'アクション',
    align: 'start',
    sortable: false, // ソート
    key: 'id',
  },
  { title: 'タイトル', align: 'start', key: 'title' },
  { title: 'コメント', align: 'start', key: 'comment' },
  { title: '日付', align: 'start', key: 'date' },
  { title: '画像', align: 'start', key: 'filePath' },
  { title: 'webサイト', align: 'start', key: 'website' },
];

// firebase
import { getCurrentUser } from '@/firebase/v1/auth';
import { getTwoLevelAllData } from '@/firebase/v1/firestore';

// utils
import { formatDateForTimestamp } from '@/utils/formatData'; // 日付形式変換


// 取得
onMounted(async () => {
  try {
    user.value = await getCurrentUser();

    const allDoc = await getTwoLevelAllData(user.value.uid, 'portfolios', 'portfolio');

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

// router
import { useRouter } from 'vue-router';
const router = useRouter(); // ルーターインスタンスを取得
const moveNextPage = (id) => {
  router.push(`/admin/portfolio/${id}`);
}

</script>
