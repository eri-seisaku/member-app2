<template>
  <v-textarea
    v-model="parentField.value.value"
    :error-messages="parentField.errorMessage.value"
    :hint="hint"
    :rows="rows"
    persistent-hint
    persistent-counter
    counter
    variant="outlined"
    auto-grow
  ></v-textarea>
</template>

<script setup>
import { computed } from 'vue';

// 親から子へ
const props = defineProps({
  field: Object,
  hint: String,
  rows: Number
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
