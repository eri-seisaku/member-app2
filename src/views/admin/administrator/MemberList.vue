<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <v-data-table
          v-model:items-per-page="itemsPerPage"
          v-model:expanded="expanded"
          :headers="headers"
          :items="filteredMembers"
          :loading="loadingMembers"
          show-expand
        >
          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td class="bg-grey-lighten-5" :colspan="columns.length">
                <!-- <pre>{{ item.raw.url }}</pre> -->
                <a :href="item.url" class="text-decoration-underline">
                  <v-icon> mdi-account-edit </v-icon>
                  ユーザー詳細
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
const initialMembers = ref([]);
const filteredMembers = ref([]);
const expanded = ref([]);

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
  // { title: 'URL', align: 'start', key: 'url' },
];

// firebase
import { getOneLevelAllData } from '@/firebase/v1/firestore';

onMounted(async () => {
  try {
    const allDoc = await getOneLevelAllData("members");

    initialMembers.value = allDoc.map((doc) => ({
      url: `/admin/profile/${doc.memberID}`,
      officeName: doc.officeName,
      name: doc.name,
      eightArea: doc.eightArea,
      state: doc.state,
      joinDate: doc.joinDate, // フォーマット不要ならそのまま
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

</script>
