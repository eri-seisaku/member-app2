<template>
  <Dialog v-model:dialog="dialog" :size="450">
    <template v-slot:content>
      <v-row>
        <v-col cols="12">
          <p>画像をアップロードしてください。<br>※アップロードできるファイル形式は、JPEG/PNGのみです。</p>
        </v-col>
        <v-col cols="12">
          <form @submit.prevent="submit">
            <DropFileInput
              @fileImport="handleFilesImport"
              @update:errorMessage="handleError"
              type="circle"
            ><template v-slot:action>
              <v-btn
                class="mx-8"
                type="submit"
                variant="outlined"
              >
                プロフィール写真として保存
              </v-btn>
            </template>
            </DropFileInput>
          </form>
        </v-col>
      </v-row>
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue';
const dialog = ref(false);
const message = ref('');
const errorMessage = ref('');
const files = ref([]);

// 親から子へ
const props = defineProps({
  authData: Object
});

// 子から親へ
const emit = defineEmits([
  'profileIconUrl'
]);

// components
import Dialog from '@/components/Dialog.vue';
import DropFileInput from '@/components/inputs/DropFileInput.vue';
import Alert from '@/components/Alert.vue';

// firebase
import { upload } from '@/firebase/v1/storage';
import { updateOneLevelData } from '@/firebase/v1/firestore';

// ファイルがアップロードされたら
const handleFilesImport = (uploadedFiles) => {
  console.log(uploadedFiles.length);
  if (uploadedFiles.length > 0) {
    files.value = uploadedFiles;
    console.log(files.value)
    errorMessage.value = '';
  } else {
    errorMessage.value = "アップロードするファイルがありません。";
  }
}
// エラーメッセージ取得
const handleError = (error) => {
  errorMessage.value = error;
  console.error('ユーザー情報の更新に失敗しました。', error);
}

// 保存
const submit = async () => {
  try {
    const url = await upload("profile", files.value[0], props.authData.uid);

    // 登録前にデータを加工
    const userData = {
      profileIcon: url
    };

    await updateOneLevelData(props.authData.uid, "members", userData);

    emit('profileIconUrl', url);

    errorMessage.value = '';
    message.value = 'ユーザー情報の更新に成功しました。';

  } catch (error) {
    console.error(error);
    errorMessage.value = 'ユーザー情報の変更に失敗しました。';
  }
}

</script>
