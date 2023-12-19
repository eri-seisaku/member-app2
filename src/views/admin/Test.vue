<template>
  <!-- vuetifyを使ったサンプル -->
  <v-select
    dense
    :items="options"
    @input="handleSelect"
    v-model="selectValue"
  >
  </v-select>
</template>

<script setup>
import { ref } from 'vue';
const options = [
  'メンバー',
  'ポートフォリオ',
];

const selectValue = ref('');

const handleSelect = () => {
  if (selectValue === 'メンバー') {
    console.log('イベント発火！');
  }
};
</script>
