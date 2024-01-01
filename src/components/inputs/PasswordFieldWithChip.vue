<template>
  <v-text-field
    density="compact"
    variant="outlined"
    bg-color="white"
    v-model="parentField.value.value"
    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
    :type="visible ? 'text' : 'password'"
    @click:append-inner="visible = !visible"
    :error-messages="parentField.errorMessage.value"
    persistent-hint
    hint="大文字、小文字、数字、特殊文字(@、$、!、%、*、?、&)の8文字以上"
  ></v-text-field>
  <v-chip
    v-for="chip in chips"
    :key="chip.key"
    class="ma-2"
    size="small"
    :color="chip.value.value ? 'success' : 'gray'"
    :prepend-icon="chip.value.value ? 'mdi-checkbox-marked-circle' : 'mdi-check-circle-outline'"
  >
    {{ chip.text }}
  </v-chip>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
const visible = ref(false);

// 親から子へ
const props = defineProps({
  field: Object,
});

// 子から親へ
const emit = defineEmits([
  'field'
]);

// 直接v-modelにバインドしないように
const parentField = computed({
  get: () => props.field,
  set: (val) => emit('field', val),
});

import { chips, updateChips } from '@/utils/formHelper'; // password入力ヘルパー
// watchでpassword入力の状態を監視
watch(() => props.field.value.value, (newVal) => {
  updateChips(newVal, chips);
  // updateChips(newVal);
});
</script>
