<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <h2 class="text-h5">組合員紹介</h2>
        <v-data-table
          v-model:items-per-page="itemsPerPage"
          v-model:expanded="expanded"
          :headers="headers"
          :items="filteredMembers"
          :loading="loadingMembers"
          :search="search"
          show-expand
        >
          <template v-slot:top>
            <v-row class="my-8">
              <v-col cols="12" md="6">
                <EightArea
                  @selected="handleAreaSelected"
                  @reset="handleTableReset"
                />
              </v-col>
              <v-col cols="12" md="6">
                <SearchForm
                  @searched="handleFormSubmitted"
                  @reset="handleTableReset"
                />
              </v-col>
            </v-row>
          </template>
          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td class="bg-grey-lighten-5" :colspan="columns.length">
                <a :href="item.url" class="text-decoration-underline text-black">
                  <v-icon> mdi-account-edit </v-icon>
                  Portfolio
                </a>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const initialMembers = ref([]); // 初期データ用
const filteredMembers = ref([]); // フィルタリング用
const expanded = ref([]);
const search = ref(''); // 八区分エリア用
const searchData = ref({
    keyword: '',
    state: '',
    specialty: '',
});
const loadingMembers = ref(true);
const itemsPerPage = 20;
const headers = [
  {
    title: '事業所名',
    align: 'start',
    sortable: false, // ソート
    key: 'officeName',
  },
  { title: '代表者名', align: 'start', key: 'name' },
  { title: '地方', align: 'start', key: 'eightArea' },
  { title: '都道府県', align: 'start', key: 'state' },
  { title: '入会年月日', align: 'start', key: 'joinDate' },
  { title: '専門デザイン分野', align: 'start', key: 'specialty' },
];

// components
import EightArea from '@/views/site/child_list/EightArea.vue';
import SearchForm from '@/views/site/child_list/SearchForm.vue';

// firebase
import { getOneLevelAllData } from '@/firebase/v1/firestore';

onMounted(async () => {
  try {
    const allDoc = await getOneLevelAllData("members");

    initialMembers.value = allDoc.map((doc) => ({
      url: `/members/${doc.memberID}`,
      officeName: doc.officeName,
      name: doc.name,
      eightArea: doc.eightArea,
      state: doc.state,
      joinDate: doc.joinDate,
      specialty: doc.specialty,
    }));

    // 初期データを filteredMembers にスプレッド構文でコピーを作成
    filteredMembers.value = [...initialMembers.value];

    loadingMembers.value = false;

  } catch (error) {
    console.error('ユーザーデータ取得エラー', error);
    loadingMembers.value = false;
  }
});

// 地図をクリックしたら
const handleAreaSelected = (areaName) => {
  search.value = areaName;
}

// リセットをクリックしたら
const handleTableReset = () => {
  // リセットボタンが押されたとき、フィルタリングされたデータを初期データにリセット
  filteredMembers.value = [...initialMembers.value];
  search.value = '';
}

// 検索フォームを送信したら
const handleFormSubmitted = (formData) => {
  searchData.value = formData;
  // console.log(searchData.value.keyword); // keywordが表示
  filterMembers();
}

const filterMembers = () => {
  // 検索ボタンが押されたとき、フィルタリングを実行
  filteredMembers.value = initialMembers.value.filter(member => {
    return (
      (searchData.value.keyword === '' || member.name.toLowerCase().includes(searchData.value.keyword.toLowerCase())) &&
      (searchData.value.state === '' || member.state === searchData.value.state) &&
      (searchData.value.specialty === '' || member.specialty === searchData.value.specialty)
    );
  });
}

</script>
<style>
.v-data-table tr:hover td {
    background-color: #eee!important;
}
</style>
