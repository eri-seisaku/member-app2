<template>
  <div class="ma-4 my-md-0">
    <div class="d-flex flex-column flex-md-row">
      <v-btn
        variant="outlined"
        @click="openFileInput"
      >
        ファイルを選択
      </v-btn>
      <ul v-if="fileName && fileData" class="d-flex align-center my-4 my-md-0">
        <li>
          <span class="mx-4">{{ fileName }}</span>
          <v-icon
            class="cursor"
            @click="deleteFile"
          >mdi-close-circle</v-icon>
        </li>
      </ul>
    </div>
    <!-- 非表示画像選択input -->
    <input
      ref="fileInput"
      class="d-none"
      type="file"
      @change="handleFileInput"
    >
    <!-- <div v-if="errorMessage" class="custom-error-message d-flex align-end justify-space-between">
      {{ errorMessage }}
    </div> -->
    <!-- エラーメッセージ -->
    <div class="v-input__details">
      <div class="error-message text-error" :class="{ show: errorMessage }">{{ errorMessage }}</div>
    </div>
    <!-- /エラーメッセージ -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
const fileData = ref([]);
const fileName = ref('');
const targetFile = ref([]);
const previewURL = ref(''); // プレビューurl
const errorMessage = ref('');

// 親から子へ
const props = defineProps({
  schema: Object
});

// 子から親へ
const emit = defineEmits([
  'update:fileData',
  'update:previewURL',
  'update:deleteFileData'
]);

// ボタンでアプロード
const fileInput = ref(null);
const openFileInput = () => fileInput.value.click();

// ファイルを追加する
const handleFileInput = (e) => {
  targetFile.value = e.target.files;
  const file = targetFile.value[0];
  validateImage(file);
  if (errorMessage.value === '') {
    setPreviewURL(file);
    addFile(file);
  }
};

// バリデーション
const validateImage = (file) => {
  // 画像のバリデーションルールを適用
  const schema = props.schema;
  try {
    schema.validateSync(file);
    errorMessage.value = '';
  } catch (error) {
    errorMessage.value = error.message;
  }
};

// プレビューURLの生成と更新
const setPreviewURL = (file) => {
  previewURL.value = URL.createObjectURL(file);
  emit('update:previewURL', previewURL.value);
};

// ファイルの追加
const addFile = (file) => {
  fileData.value = file;
  fileName.value = fileData.value.name;
  emit('update:fileData', fileData.value);
};


// ファイル削除
const deleteFile = () => {
  fileData.value = [];
  fileName.value = "";
  emit('update:deleteFileData');
}

</script>

<style>
.error-message {
  opacity: 0;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  transform: translateY(-20px);
}
.error-message.show {
  opacity: 1;
  transform: translateY(0);
}
/*
.custom-spacing {
  margin-top: 22px;
}
.custom-error-message {
  padding-inline: 16px;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.0333333333em;
  min-height: 22px;
  padding-top: 6px;
  overflow: hidden;
  color: rgb(var(--v-theme-error));
  line-height: 12px;
}
*/
</style>
