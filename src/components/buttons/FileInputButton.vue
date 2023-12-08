<template>
  <div class="ma-4 my-md-0">
    <div class="d-flex flex-column flex-md-row">
      <v-btn
        variant="outlined"
        @click="openFileInput"
      >
        ファイルを選択
      </v-btn>
      <ul v-if="fileName && files" class="d-flex align-center my-4 my-md-0">
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
    <div v-if="errorMessage" class="custom-error-message d-flex align-end justify-space-between">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const files = ref([]);
const fileName = ref('');
const targetFile = ref([]);
const previewURL = ref(''); // プレビューurl
const errorMessage = ref('');

// 親から子へ
const props = defineProps({
  type: String
});

// validation
import { validationSchema } from '@/validate/validate';

// 子から親へ
const emit = defineEmits([
  'update:fileData',
  'update:previewURL',
  'update:deleteFileData'
]);

// ボタンでアプロード
const fileInput = ref(null);
const openFileInput = () => fileInput.value.click();

// ファイル入力を処理する
const handleFileInput = (e) => {
  targetFile.value = e.target.files;
  const file = targetFile.value[0];
  validateImage(file);
  if (errorMessage.value === '') {
    updatePreviewURL(file);
    addFile(file);
  }
};

// バリデーション
const validateImage = (file) => {
  const schema = validationSchema.fields.image;
  try {
    schema.validateSync(file);
    errorMessage.value = '';
  } catch (error) {
    errorMessage.value = error.message;
  }
};

// プレビューURLの生成と更新
const updatePreviewURL = (file) => {
  previewURL.value = URL.createObjectURL(file);
  emit('update:previewURL', previewURL.value);
};

// ファイルの追加
const addFile = (file) => {
  files.value = file;
  fileName.value = files.value.name;
  emit('update:fileData', files.value);
};


// ファイル削除
const deleteFile = (index) => {
  files.value = [];
  fileName.value = "";
  emit('update:deleteFileData');
}

</script>

<style>
.drop_area {
  width: 100%;
  min-height: 200px;
  border: 5px solid gray;
  border-radius: 15px;
  color: gray;
}
.enter {
  border: 5px solid #1867C0;
  color: #1867C0;
}
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
</style>
