<template>
  <form @submit.prevent="submit">
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
            color="primary"
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
    <v-row v-if="files.length && previewUrl">
      <v-col cols="12" class="text-center">
        <Avatar :imageSrc="previewUrl" />
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
        <v-btn
          class="mx-8"
          type="submit"
          variant="outlined"
        >
        プロフィール写真として保存
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const uploadMode = ref(true); // モード切替
const files = ref([]);
const targetFile = ref([]);
const previewUrl = ref(''); // プレビューurl
const dragover = ref(false);
const errorMessage = ref('');

// validation
import { validationSchema } from '@/validate/validate';

// component
import Avatar from '@/components/Avatar.vue';

// 子から親へ
const emit = defineEmits([
  'update:filesUploaded', // ファイル情報
  'update:errorMessage' // エラーメッセージ
]);

// ボタンでアプロード
const fileInput = ref(null);
const openFileInput = () => fileInput.value.click();

const handleFileInput = (e) => {
  targetFile.value = e.target.files;
  addFiles(targetFile.value);
}

// ドロップでアプロード
const dropFile = (e) => {
  dragover.value = false; // ドロップが終わると枠線の色が変わる
  targetFile.value = e.dataTransfer.files;
  addFiles(targetFile.value);
};

// 共通: ファイルを追加する
const addFiles = (files) => {
  if (files.length > 1) {
    errorMessage.value = "一度にアップロードできるファイルは 1 つだけです。";
    emit('update:errorMessage', errorMessage.value);

  } else {
    errorMessage.value = "";
    validateImage(files[0]);
  }
}

// バリデーション
const validateImage = (file) => {
  // 画像のバリデーションルールを適用
  const schema = validationSchema.fields.image;
  try {
    schema.validateSync(file);
    errorMessage.value = ''; // バリデーション成功時
    previewUrl.value = URL.createObjectURL(file);
    uploadMode.value = false;
    files.value.push(file); // ファイルを追加
  } catch (error) {
    // バリデーションエラー時
    errorMessage.value = error.message;
    emit('update:errorMessage', errorMessage.value);
  }
};

// ファイル削除
const deleteFile = (index) => {
  files.value.splice(index, 1);
  uploadMode.value = true;
}

const submit = () => {
  if (files.value.length > 0) {
    // console.log(files.value);
    errorMessage.value = '';
    emit('update:filesUploaded', files.value);
  } else {
    errorMessage.value = "アップロードするファイルがありません。";
    emit('update:errorMessage', errorMessage.value);
  }
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
</style>
