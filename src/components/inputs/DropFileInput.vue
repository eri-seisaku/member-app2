<template>
  <div>
    <div
      v-if="uploadMode"
      @drop.prevent="dropFile"
      @dragover.prevent="dragover = true"
      @dragenter="dragover = true"
      @dragleave="dragover = false"
      :class="{enter: dragover}"
      class="drop_area d-flex flex-column justify-center align-center"
    >
      <!-- 中身 -->
      <v-icon size="60">mdi-cloud-upload</v-icon>
        <p class="text-center">ここに写真をドラッグ<br>又は</p>
          <v-btn
            variant="outlined"
            @click="openFileInput"
          >
            ファイルを選択
          </v-btn>
          <!-- 非表示画像選択input -->
          <input
            ref="fileInput"
            class="d-none"
            type="file"
            @change="handleFileInput"
          >
      <!-- /中身 -->
    </div>
    <!-- エラーメッセージ -->
    <div class="v-input__details pl-4">
      <div class="error-message text-error" :class="{ show: errorMessage }">{{ errorMessage }}</div>
    </div>
    <!-- /エラーメッセージ -->
    <v-row v-if="fileData && previewURL">
      <v-col cols="12" class="text-center">
        <v-img
          max-height="200"
          :src="previewURL"
        />
      </v-col>
      <v-col cols="12" class="d-flex flex-column flex-md-row justify-center">
        <v-btn
          class="mx-8"
          @click="deleteFile"
          color="primary"
          variant="text"
        >
          キャンセル
        </v-btn>
        <slot name="action"></slot>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const uploadMode = ref(true); // モード切替
const fileData = ref([]);
const targetFile = ref([]);
const previewURL = ref(''); // プレビューurl
const dragover = ref(false);
const errorMessage = ref('');

// 親から子へ
const props = defineProps({
  type: String,
  schema: Object,
  error: String,
  filePath: String,
  fileData: Object,
});


if (props.fileData && props.filePath) {
  fileData.value = props.fileData;
  previewURL.value = props.filePath;
  uploadMode.value = false;
}

watch(() => props.error, (newVal) => {
  errorMessage.value = newVal;
});

// 子から親へ
const emit = defineEmits([
  'update:fileData',
  'update:deleteFileData'
]);

// ボタンでアプロード
const fileInput = ref(null);
const openFileInput = () => fileInput.value.click();
const handleFileInput = (e) => {
  targetFile.value = e.target.files;
  handleFileUpload(targetFile.value[0]);
}

// ドロップでアプロード
const dropFile = (e) => {
  dragover.value = false; // 枠線の色変更
  // console.log(e.dataTransfer.files.length)
  if (e.dataTransfer.files.length === 1) {
    targetFile.value = e.dataTransfer.files;
    handleFileUpload(targetFile.value[0]);
  } else {
    errorMessage.value = "一度にアップロードできるファイルは 1 つだけです。";
  }
};

// 共通: ファイルを追加する
const handleFileUpload = (file) => {
  errorMessage.value = "";
  validateImage(file);
  if (errorMessage.value === '') {
    setPreviewURL(file);
    addFile(file);
  }
}

// バリデーション
const validateImage = (file) => {
  const schema = props.schema;
  try {
    schema.validateSync(file);
    errorMessage.value = '';
  } catch (error) {
    errorMessage.value = error.message;
  }
};

// プレビューURLの生成
const setPreviewURL = (file) => {
  previewURL.value = URL.createObjectURL(file);
}

// ファイルの追加
const addFile = (file) => {
  fileData.value = file;
  emit('update:fileData', fileData.value);
  uploadMode.value = false;
};

// ファイル削除
const deleteFile = () => {
  fileData.value = [];
  previewURL.value = '';
  emit('update:deleteFileData');
  uploadMode.value = true;
}

</script>

<style>
.drop_area {
  width: 100%;
  min-height: 200px;
  border: 5px dashed rgba(128, 128, 128, 0.38);
  border-radius: 15px;
  color: gray;
}
.enter {
  border: 5px solid #1867C0;
  color: #1867C0;
}
.error-message {
  opacity: 0;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  transform: translateY(-20px);
}
.error-message.show {
  opacity: 1;
  transform: translateY(0);
}
</style>
