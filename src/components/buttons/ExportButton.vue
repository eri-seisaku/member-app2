<template>
  <div>
    <v-btn
      variant="outlined"
      class="bg-white"
      min-height="40"
      @click="fetchData"
      :loading="isLoading"
      v-if="!isDataReady"
    >
      エクスポートを作成
    </v-btn>
    <download-csv :data="csvData" v-if="isDataReady">
      <v-btn
        variant="flat"
        color="administrator"
        min-height="40"
      >
        エクスポート
      </v-btn>
    </download-csv>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const csvData = ref([]);
const errorMessage = ref('');
const isLoading = ref(false);
const isDataReady = ref(false);

// 子から親へ
const emit = defineEmits([
  'update:errorMessage' // エラーメッセージ
]);

// firebase
import { getOneLevelAllData, getTwoLevelUserData } from '@/firebase/v1/firestore';
const fetchData = async () => {
  isLoading.value = true;
  isDataReady.value = false;
  try {
    const members = await getOneLevelAllData("members");
    for (let member of members) {
      const userID = member.memberID;
      const portfolios = await getTwoLevelUserData(userID, "members", "portfolios");
      console.log(portfolios.length)
      // メンバーとポートフォリオのデータをフラットな形式でcsvDataに追加
      if (portfolios.length > 0) {
        for (let portfolio of portfolios) {
          const { createDateTimestamp: _, requestReady: __, ...portfolioProps } = portfolio;
          const { createDateTimestamp: ___, ...memberProps } = member;
          csvData.value.push({ ...memberProps, ...portfolioProps });
        }
      } else {
        const { createDateTimestamp: _, ...memberProps } = member;
        const emptyPortfolios = {
          title: '',
          comment: '',
          portfolioURL: '',
          StoragePath: '',
          state: ''
        };
        csvData.value.push({ ...memberProps, ...emptyPortfolios });
      }
    }
    // データが準備完了
    isDataReady.value = true;
  } catch (error) {
    errorMessage.value = error;
    emit('update:errorMessage', errorMessage.value);
    console.error('データ取得エラー', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
