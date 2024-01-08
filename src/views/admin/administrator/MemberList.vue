<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-sheet class="pa-2" rounded>
          <v-data-table
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="members"
            :loading="loading"
          >
            <template v-slot:item.name="{ item }">
              <v-btn
                variant="text"
                color="primary"
                @click="moveNextPage(item.id,'profile')"
              >{{ item.name }}</v-btn>
            </template>
            <template v-slot:item.portfolioIDs="{ item }">
              <v-btn
                variant="text"
                color="primary"
                @click="moveNextPage(item.id,'portfolio-list')"
              >{{ item.portfolioIDs }}</v-btn>
            </template>
          </v-data-table>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const members = ref([]);
const loading = ref(true);
const itemsPerPage = 20;
const headers = [
  { title: '事業所名', align: 'start', key: 'officeName' },
  { title: '代表者名', align: 'start', key: 'name' },
  { title: '投稿数', align: 'start', key: 'portfolioIDs' },
  { title: '入会年月日', align: 'start', key: 'joinDate' },
  { title: 'メールアドレス', align: 'start', key: 'email' },
  { title: '権限', align: 'start', key: 'role' },
];

// router
import { useRouter } from 'vue-router';
const router = useRouter();

const moveNextPage = (id, pageName) => {
  router.push(`/admin/${pageName}/${id}`);
}

// firebase
import { getOneLevelAllData } from '@/firebase/v1/firestore';

onMounted(async () => {
  try {
    const allDoc = await getOneLevelAllData("members");

    members.value = allDoc.map((doc) => ({
      id: doc.memberID,
      officeName: doc.officeName,
      name: doc.name,
      eightArea: doc.eightArea,
      state: doc.state,
      joinDate: doc.joinDate,
      email: doc.email,
      role: doc.role,
      portfolioIDs: doc.portfolioIDs ? doc.portfolioIDs.length : 0
    }));

    console.log(members.value)

    loading.value = false;

  } catch (error) {
    console.error('ユーザーデータ取得エラー', error);
    loading.value = false;
  }
});

</script>
