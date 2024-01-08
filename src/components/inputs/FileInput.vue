<template>
  <v-file-input
    density="compact"
    variant="outlined"
    prepend-icon=""
    ref="fileInput"
    bg-color="white"
    v-model="parentField.value.value"
    :error-messages="parentField.errorMessage.value"
    :label="label"
    persistent-hint
    hint="PNG、JPG、GIF、PDF、DOC、DOCX、PPT、PPTX形式のファイルをアップロードしてください"
  >
    <template v-slot:append>
      <v-btn
        variant="outlined"
        class="bg-white"
        min-height="40"
        @click="fileInput.click()"
      >画像を選択</v-btn>
    </template>
  </v-file-input>
</template>

<script setup>
import { ref, computed } from 'vue';
const fileInput = ref(null);

// 親から子へ
const props = defineProps({
  field: Object,
  label: String,
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
