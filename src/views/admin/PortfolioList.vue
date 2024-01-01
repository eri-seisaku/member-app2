<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-btn
          class="bg-white"
          variant="outlined"
          href='/admin/post'
        >
          新規追加
        </v-btn>
      </v-col>
    </v-row>
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
                  persistent-hint
                  :hint="selectedAction.value === 'request' ? '未入力がある投稿、または既に申請中の投稿は選択できません' : ''"
                  class="mr-3"
                  return-object
                ></v-select>
                <v-btn
                  min-height="40"
                  variant="outlined"
                  type="submit"
                  :disabled="!selected.length || !selectedAction"
                >
                  適用
                </v-btn>
              </form>
            </v-col>
          </v-row>
          <v-data-table
            v-model:items-per-page="itemsPerPage"
            v-model="selected"
            item-value="id"
            :headers="headers"
            :items="portfolios"
            :loading="loading"
          >
            <!-- 修正中 -->
            <template v-slot:headers>
              <tr>
                <th>
                  <v-checkbox
                    hide-details
                    @click="toggleSelectAllItems"
                  ></v-checkbox>
                </th>
                <th>{{ headers[1].title }}</th>
                <th>{{ headers[2].title }}</th>
                <th>{{ headers[3].title }}</th>
                <th>{{ headers[4].title }}</th>
              </tr>
            </template>
            <!-- 修正中 -->
            <template v-slot:item.requestReady="{ item }">
              <v-checkbox
                v-if="item.requestReady && item.state === 'save' && selectedAction.value === 'request'"
                v-model="selected"
                :true-value="item.id"
                hide-details
              ></v-checkbox>
              <v-checkbox
                v-if="selectedAction.value === 'delete'"
                v-model="selected"
                :true-value="item.id"
                hide-details
              ></v-checkbox>
            </template>
            <template v-slot:item.state="{ item }">
              <v-chip :color="getColor(item.state, item.requestReady)">
                <!-- {{ item.state === 'request' ? '申請中' : '下書き' }} -->
                {{
                  item.state === 'request' && item.requestReady
                    ? '申請中'
                    : item.state === 'save' && item.requestReady
                    ? '未申請'
                    : '下書き'
                }}
              </v-chip>
            </template>
            <template v-slot:item.title="{ item }">
              <v-btn
                variant="text"
                color="primary"
                @click="moveNextPage(item.id)"
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
const user = ref({});
const portfolios = ref([]);
const selected = ref([]); // 投稿ID
const allSelected = ref(false);
const selectedAction = ref([]); // 削除or申請
const message = ref('');
const errorMessage = ref('');
const selectItems = [
  { title: "削除", value: "delete" },
  { title: "申請", value: "request" },
];
// データテーブル関連
const itemsPerPage = 10;
const loading = ref(true);
const headers = [
  { title: '', align: 'start', key: 'requestReady', sortable: false },
  { title: '状態', align: 'start', key: 'state' },
  { title: 'タイトル', align: 'start', key: 'title' },
  { title: '日付', align: 'start', key: 'createDateTimestamp' },
  { title: '画像', align: 'start', key: 'storagePath' },
];
// 選択されたIDを確認
watch(() => selected.value, (newVal) => {
  console.log(selected.value);
});
// watch(() => selectedAction.value, (newVal) => {
//   console.log(selectedAction.value);
// });

const getColor = (state, requestReady) => {
  if (state === 'request') return 'green'
  else if (state === 'save' && requestReady === true) return 'primary'
  else return 'gray'
};

const toggleSelectAllItems = () => {
  if (allSelected.value) {
    selected.value = [];
  } else {
    for (let item of portfolios.value) {
      selected.value.push(item.id);
    }
  }
  allSelected.value = !allSelected.value; // 選択状態を反転
};

// component
import Alert from '@/components/Alert.vue';

// firebase
import { getCurrentUser } from '@/firebase/v1/auth';
import {
  getTwoLevelUserData,
  deleteTwoLevelData,
  updateTwoLevelMultipleData,
  removeElementFromArray,
  recordLog,
} from '@/firebase/v1/firestore';

// utils
import { formatDateForTimestamp } from '@/utils/formatData'; // 日付形式変換

// router
import { useRouter } from 'vue-router';
const router = useRouter();

const moveNextPage = (id) => {
  router.push(`/admin/portfolio/${id}`);
}

// 取得
onMounted(async () => {
  try {
    user.value = await getCurrentUser();
    const allDoc = await getTwoLevelUserData(user.value.uid, 'members', 'portfolios');

    portfolios.value = allDoc.map((doc) => ({
      id: doc.id,
      title: doc.title,
      genre: doc.genre,
      comment: doc.comment,
      state: doc.state,
      storagePath: doc.storagePath,
      portfolioURL: doc.portfolioURL,
      portfolioImage: doc.portfolioImage,
      createDateTimestamp: formatDateForTimestamp(doc.createDateTimestamp),
      requestReady: doc.requestReady
    }));

    loading.value = false;

  } catch (error) {
    console.error('データ取得エラー', error);
    errorMessage.value = error;
    loading.value = false;
  }
});

// 選択したアイテムを送信
const submit = async () => {
  console.log(selected.value)
  if (selected.value.length && selectedAction.value) {

    if (selectedAction.value.value === "delete") {
      await deleteTwoLevelData(user.value.uid, "members", "portfolios", selected.value)

      // portfolioIDsも削除
      await removeElementFromArray('members', user.value.uid, 'portfolioIDs', selected.value)

      message.value = "削除しました。";

      // 削除したアイテムをローカルの状態から手動で削除
      portfolios.value = portfolios.value.filter(item => !selected.value.includes(item.id));

    } else if (selectedAction.value.value === "request") {
      const arrayData = {
        state: "request"
      };
      await updateTwoLevelMultipleData(user.value.uid, "members", "portfolios", selected.value, arrayData)

      await recordLog(user.value.uid, selected.value, 'ポートフォリオが申請されました');
      message.value = "申請しました。";
    }
  } else {
    message.value = "一括操作を選択してください";
  }
}

// タイトルを切り詰める
const truncateTitle = (title) => {
  return title.length > 20 ? title.substring(0, 20) + "..." : title;
}
</script>
<style>
a.hover-underline {
  text-decoration: none;
}
a.hover-underline:hover {
  text-decoration: underline;
}
</style>
