<template>
  <v-checkbox
    v-model="parentField.value.value"
    :error-messages="parentField.errorMessage.value"
    :value="value"
    :label="label"
    type="checkbox"
  ></v-checkbox>
</template>

<script setup>
import { computed } from 'vue';

// 親から子へ
const props = defineProps({
  field: Object,
  value: String,
  label: String
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
