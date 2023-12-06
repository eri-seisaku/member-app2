<template>
  <Dialog v-model:dialog="dialog" :size="450">
    <template v-slot:content>
      <v-row>
        <v-col cols="12">
          <p class="text-subtitle-1 text-medium-emphasis">画像をアップロードしてください。<br>※アップロードできるファイル形式は、JPEG/PNGのみです。</p>
        </v-col>
        <v-col cols="12" v-if="message || errorMessage">
          <Alert
            :color="message ? 'primary' : 'red'"
            :text="message ? message : errorMessage"
          />
        </v-col>
        <v-col cols="12">
          <DragFileInput
            v-model:errorMessage="errorMessage"
            @update:filesUploaded="handleFilesUploaded"
          />
        </v-col>
      </v-row>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const dialog = ref(false);

const message = ref('');
const errorMessage = ref('');

// 親から子へ
const props = defineProps({
  authData: Object
});

// console.log(props.authData);

// 子から親へ
const emit = defineEmits([
  'update:profileIconUrl'
]);

// components
import Dialog from '@/components/Dialog.vue';
import DragFileInput from '@/components/inputs/DragFileInput.vue';
import Alert from '@/components/Alert.vue';

// firebase
import { upload } from '@/firebase/v1/storage';
import { updateOneLevelData } from '@/firebase/v1/firestore';

// ファイルがアップロードされたら
const handleFilesUploaded = async (files) => {
  console.log('Received uploaded files:', files);
  console.log('Received uploaded files:', files[0].type);
  try {
    const url = await upload("profile", files[0], props.authData.uid);

    // 登録前にデータを加工
    const userData = {
      profileIcon: url
    };

    await updateOneLevelData(props.authData.uid, "members", userData);

    emit('update:profileIconUrl', url);

    errorMessage.value = '';
    message.value = 'ユーザー情報の更新に成功しました。';

  } catch (error) {
    console.error(error);
    errorMessage.value = 'ユーザー情報の変更に失敗しました。';
  }
}

</script>
