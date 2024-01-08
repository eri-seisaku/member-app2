<template>
  <v-container>
    <v-row v-if="message || errorMessage">
      <v-col cols="12" md="6">
        <Alert
            v-if="message"
            color="primary"
            :text="message"
          />
          <Alert
            v-if="errorMessage"
            color="red"
            :text="errorMessage"
          />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-sheet class="pa-2" rounded>
          <v-row no-gutters>
            <v-col cols="8" md="5">
              <form @submit.prevent="submit" class="d-flex">
                <v-select
                  v-model="selectedAction"
                  density="compact"
                  label="一括操作"
                  item-text="title"
                  item-value="value"
                  :items="selectItems"
                  variant="outlined"
                  class="mr-3"
                  return-object
                ></v-select>
                <v-btn
                  min-height="40"
                  variant="outlined"
                  type="submit"
                  :disabled="!selected.length || !selectedAction.value"
                >
                  適用
                </v-btn>
              </form>
            </v-col>
          </v-row>
          <v-data-table
            v-model:items-per-page="itemsPerPage"
            v-model="selected"
            :item-value="item => ({ portfolioID: item.portfolioID, memberID: item.memberID })"
            show-select
            :headers="headers"
            :items="portfolios"
            :loading="loading"
          >
            <template v-slot:item.title="{ item }">
              <v-btn
                variant="text"
                color="primary"
                @click="moveNextPage(item.memberID, item.portfolioID)"
              >{{ truncateTitle(item.title) }}</v-btn>
            </template>
            <template v-slot:item.storagePath="{ item }">
              <v-img
                :width="100"
                :src="item.storagePath"
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
import { ref, onMounted, watch } from "vue";
const portfolios = ref([]);
const selected = ref([]); // 投稿ID
const selectedAction = ref([]); // 削除or申請
const message = ref('');
const errorMessage = ref('');
const selectItems = [
  { title: "承認", value: "approved" },
];
// データテーブル関連
const itemsPerPage = 10;
const loading = ref(true);
const headers = [
  { title: 'メンバー', align: 'start', key: 'name' },
  { title: 'タイトル', align: 'start', key: 'title' },
  { title: '日付', align: 'start', key: 'createDateTimestamp' },
  { title: '画像', align: 'start', key: 'storagePath' },
];

// component
import Alert from '@/components/Alert.vue';

// firebase
import {
  getTwoLevelFilteredData,
  updateTwoLevelMultipleData
} from '@/firebase/v1/firestore';

// utils
import { formatDateForTimestamp } from '@/utils/formatData'; // 日付形式変換

// router
import { useRouter } from 'vue-router';
const router = useRouter();

// 投稿ページへ移動
const moveNextPage = (memberID, portfolioID) => {
  router.push(`/admin/portfolio/${memberID}/${portfolioID}`);
}

// タイトルを切り詰める
const truncateTitle = (title) => {
  return title.length > 20 ? title.substring(0, 20) + "..." : title;
}

watch(() => selected.value, (newVal) => {
  console.log(selected.value);
});
watch(() => selectedAction.value, (newVal) => {
  console.log(selectedAction.value);
});

// 取得
onMounted(async () => {
  try {
    // 申請中のportfolioのみ取得
    const allDoc = await getTwoLevelFilteredData("members", "portfolios", "state", "request");

    portfolios.value = allDoc.map((doc) => ({
      portfolioID: doc.postID,
      memberID: doc.userID,
      name: doc.name,
      title: doc.title,
      genre: doc.genre,
      comment: doc.comment,
      state: doc.state,
      portfolioURL: doc.portfolioURL,
      storagePath: doc.storagePath,
      createDateTimestamp: formatDateForTimestamp(doc.createDateTimestamp),
      requestReady: doc.requestReady
    }));

    console.log(portfolios.value)

    loading.value = false;

  } catch (error) {
    console.error('データ取得エラー', error);
    errorMessage.value = error;
    loading.value = false;
  }
});

// 選択したアイテムを送信
const submit = async () => {
  if (selected.value.length && selectedAction.value) {

    if (selectedAction.value.value === "approved") {
      const arrayData = {
        state: "approved"
      };
      console.log(selected.value[0].memberID)
      console.log(selected.value[0].portfolioID)

      await updateTwoLevelMultipleData(selected.value[0].memberID, "members", "portfolios", [selected.value[0].portfolioID], arrayData)

      message.value = "承認しました。";

    }
  } else {
    message.value = "一括操作を選択してください";
  }
}

</script>
