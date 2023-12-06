<template>
  <v-text-field
    density="compact"
    variant="outlined"
    v-model="parentField.value.value"
    :error-messages="parentField.errorMessage.value"
    persistent-hint
    :hint="hint"
    :placeholder="placeholder"
  ></v-text-field>
</template>

<script setup>
import { computed } from 'vue';

// 親から子へ
const props = defineProps({
  field: Object,
  hint: String,
  placeholder: String
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
