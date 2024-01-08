<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-sheet class="pa-6" rounded>
          <h3 class="text-h5">エクスポート<span class="text-caption">※開発途中</span></h3>
          <v-divider class="my-4"></v-divider>
          <v-row>
            <v-col cols="12" md="6" class="bg-blue-lighten-4">
              <h4 class="mb-3">バージョン1:ユーザー情報とポートフォリオまとめて</h4>
              <p class="mb-3 text-caption">ポートフォリオの数だけユーザー情報が繰り返されてしまう</p>
              <ExportButton @update:errorMessage="handleError" />
            </v-col>
            <v-col cols="12" md="6" class="bg-green-lighten-4">
              <h4 class="mb-3">バージョン2:ユーザー情報とポートフォリオ別々に</h4>
              <p class="mb-3 text-caption">ファイルが別々、選択する必要がある</p>
              <SelectExport @update:errorMessage="handleError" />
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
      <v-col cols="12">
        <v-sheet class="pa-6" rounded>
          <h3 class="text-h5">インポート<span class="text-caption">※開発途中</span></h3>
          <v-divider class="my-4"></v-divider>
          <SelectImport
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

// components
import SelectExport from '@/components/SelectExport.vue';
import ExportButton from '@/components/buttons/ExportButton.vue';
import SelectImport from '@/components/SelectImport.vue';
import Alert from '@/components/Alert.vue';

// firebase
import { setOneLevelMultipleData } from '@/firebase/v1/firestore';

// ファイルがアップロードされた時
const handleFilesImport = async (selected, file) => {
  try {
    if (selected === 'メンバー') {
      await setOneLevelMultipleData("members", file);
    }
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
<style>
.custom-width {
  max-width: 200px;
}
</style>
