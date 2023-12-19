<template>
  <div class="d-flex">
    <v-select
      v-model="selectedData"
      variant="outlined"
      density="compact"
      label="選択してください"
      :items="items"
      hide-details
      class="mr-3 custom-width"
      @update:menu="menuState => menuState || fetchData()"
      :loading="isLoading"
    ></v-select>
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
const selectedData = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const isDataReady = ref(false);

const items = [
  'メンバー',
  'ポートフォリオ',
];

// 子から親へ
const emit = defineEmits([
  'update:errorMessage' // エラーメッセージ
]);

// firebase
import { getOneLevelAllData, getTwoLevelAllData } from '@/firebase/v1/firestore';

const fetchData = async () => {
  isLoading.value = true;
  isDataReady.value = false;
  try {
    if (selectedData.value === 'メンバー') {
      const allDoc = await getOneLevelAllData("members");
      csvData.value = allDoc.map((doc) => {
        const { createDateTimestamp, ...otherProps } = doc;
        return otherProps;
      });
      isDataReady.value = true;

    } else if (selectedData.value === 'ポートフォリオ') {
      const allDoc = await getTwoLevelAllData("portfolios", "portfolio");
      csvData.value = allDoc.map((doc) => {
        const { createDateTimestamp, requestReady, ...otherProps } = doc;
        return otherProps;
      });
      isDataReady.value = true;

    } else {
      isDataReady.value = false;
    }

  } catch (error) {
    errorMessage.value = error;
    emit('update:errorMessage', errorMessage.value);
    console.error('データ取得エラー', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
