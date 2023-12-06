<template>
  <v-btn
    variant="outlined"
    @click="openFileInput"
  >
    <v-icon start icon="mdi-file-import-outline"></v-icon>
    IMPORT
  </v-btn>
  <input
    ref="fileInput"
    class="d-none"
    type="file"
    accept=".csv"
    @change="handleFileInput"
  >
</template>

<script setup>
import { ref } from 'vue';
const fileInput = ref(null);

const openFileInput = () => fileInput.value.click();

const handleFileInput = (e) => {
  const file = e.target.files[0];
  if (file) {
    readFileContents(file);
  }
};

// 子から親へ
const emit = defineEmits([
  'fileImport', // ファイル情報
]);


import { parseCSVToJSON } from '@/utils/csv';

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
  emit('fileImport', jsonData);
};

</script>
