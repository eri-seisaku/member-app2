<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-sheet class="pa-6" rounded>
          <h3 class="text-subtitle-1">エクスポート</h3>
          <v-divider class="my-4"></v-divider>
          <ExportButton
            @update:errorMessage="handleError"
          />
        </v-sheet>
      </v-col>
      <v-col cols="12">
        <v-sheet class="pa-6" rounded>
          <h3 class="text-subtitle-1">インポート</h3>
          <v-divider class="my-4"></v-divider>
          <ImportButton
            @fileImport="handleFilesImport"
          />
        </v-sheet>
      </v-col>
    </v-row>
    <v-row v-if="message || errorMessage">
      <v-col cols="12">
        <Alert
          :color="message ? 'primary' : 'red'"
          :text="message ? message: errorMessage"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('');
const errorMessage = ref('');

// firebase
import { setOneLevelMultipleData } from '@/firebase/v1/firestore';

// components
import ImportButton from '@/components/buttons/ImportButton.vue';
import ExportButton from '@/components/buttons/ExportButton.vue';
import Alert from '@/components/Alert.vue';


// ファイルがアップロードされた時
const handleFilesImport = async (file) => {
  // console.log('jsondata:', file); // デバック
  try {
    await setOneLevelMultipleData("members", file);
    // 入会年月日が文字列でエラーになる
    message.value = 'ユーザー情報の更新に成功しました。';
  } catch (error) {
    errorMessage.value = error;
    console.error('ユーザー情報の更新に失敗しました。', error);
  }
}

// エラーメッセージ取得
const handleError = (error) => {
  errorMessage.value = error;
  console.error('ユーザー情報の更新に失敗しました。', error);
}

</script>
