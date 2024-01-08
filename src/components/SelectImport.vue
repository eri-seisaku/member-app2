<template>
  <div class="d-flex">
    <v-select
      v-model="selectedData"
      variant="outlined"
      density="compact"
      label="選択してください"
      bg-color="white"
      :items="items"
      hide-details
      class="mr-3 custom-width"
    ></v-select>
    <div v-if="selectedData">
      <v-btn
        variant="flat"
        color="administrator"
        min-height="40"
        @click="openFileInput"
      >
        インポート
      </v-btn>
      <input
        ref="fileInput"
        class="d-none"
        type="file"
        accept=".csv"
        @change="handleFileInput"
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const fileInput = ref(null);
const selectedData = ref(null);

const items = [
  'メンバー',
  // 'ポートフォリオ',
];

// 子から親へ
const emit = defineEmits([
  'fileImport', // ファイル情報
]);


import { parseCSVToJSON } from '@/utils/csv';

const openFileInput = () => fileInput.value.click();

const handleFileInput = (e) => {
  const file = e.target.files[0];
  if (file) {
    readFileContents(file);
  }
};

const readFileContents = (file) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const csvData = event.target.result;
    processCSVData(csvData);
  };
  reader.readAsText(file);
};

const processCSVData = (csvData) => {
  const jsonData = parseCSVToJSON(csvData);
  emit('fileImport', selectedData.value, jsonData);
};

</script>

