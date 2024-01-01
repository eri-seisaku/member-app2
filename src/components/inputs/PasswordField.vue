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
    :hint="hint"
  ></v-text-field>
</template>

<script setup>
import { ref, computed } from 'vue';
const visible = ref(false);

// 親から子へ
const props = defineProps({
  field: Object,
  hint: String
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
