<template>
  <v-select
    variant="outlined"
    density="compact"
    label="選択してください"
    :items="items"
    v-model="parentField.value.value"
    :error-messages="parentField.errorMessage.value"
  ></v-select>
</template>

<script setup>
import { computed } from 'vue';

// 親から子へ
const props = defineProps({
  field: Object,
  items: Array,
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
</script>
