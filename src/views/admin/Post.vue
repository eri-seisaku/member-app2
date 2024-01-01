<template>
  <v-container>
    <v-row v-if="message || errorMessage">
      <v-col cols="12" md="6">
        <Alert
            v-if="message"
            color="primary"
            :text="message"
          />
          <Alert
            v-if="errorMessage"
            color="red"
            :text="errorMessage"
          />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <v-sheet class="pa-2 pa-sm-3 pa-md-6" rounded>
          <form @submit.prevent="submit" id="postForm">
            <NormalLabel label="ポートフォリオ画像" />
            <DropFileInput
              :schema="portfolioSchema.fields.portfolioImage"
              v-model:error="portfolioImage.errorMessage.value"
              @update:fileData="handleFileData"
              @update:deleteFileData="handleDeleteFileData"
            />
            <NormalLabel label="タイトル" />
            <TextField
              :field="title"
            />
            <NormalLabel label="詳細URL" />
            <TextField
              :field="portfolioURL"
            />
            <NormalLabel label="分野" />
            <TextArea
              :field="genre"
              hint="最大100文字まで"
              :rows="2"
            />
            <NormalLabel label="コメント" />
            <TextArea
              :field="comment"
              hint="最大500文字まで"
              :rows="4"
            />
          </form>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="4">
        <div class="sticky">
          <v-sheet class="pa-2 pa-sm-3 pa-md-6" rounded>
            <v-checkbox
              v-model="state.value.value"
              :true-value="'request'"
              :false-value="'save'"
              label="ポートフォリオを申請する"
              persistent-hint
              hint="申請する場合は全ての項目が入力必須です"
            ></v-checkbox>
            <div class="d-flex justify-end mt-6">
              <v-btn
                variant="flat"
                color="member"
                type="submit"
                form="postForm"
              >
                保存
              </v-btn>
            </div>
          </v-sheet>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from "vue";
const user = ref({});
const message = ref('');
const errorMessage = ref('');

// components
import Alert from '@/components/Alert.vue';
import DropFileInput from '@/components/inputs/DropFileInput.vue';
import NormalLabel from '@/components/inputs/helpers/NormalLabel.vue';
import TextField from '@/components/inputs/TextField.vue';
import TextArea from '@/components/inputs/TextArea.vue';

// validate
import { useField, useForm } from 'vee-validate';
import { portfolioSchema } from '@/validate/validate';

const { handleSubmit, handleReset } = useForm({
  validationSchema: portfolioSchema,
});

const state = useField('state');
const title = useField('title');
const portfolioURL = useField('portfolioURL');
const comment = useField('comment');
const genre = useField('genre');
const storagePath = useField('storagePath');
const portfolioImage = useField('portfolioImage');

// checkboxの初期値
state.value.value = 'save';

// デバック
// watch(() => state.value.value, (newVal, oldVal) => {
//   console.log('old', oldVal)
//   console.log('new', newVal)
// });

// firebase
import { upload } from '@/firebase/v1/storage';
import { getCurrentUser } from '@/firebase/v1/auth';
import {
  addTwoLevelSingleData,
  addElementToArray,
  recordLog
} from '@/firebase/v1/firestore';
// utils
import { formatFormValues } from '@/utils/formatData';

// router
import { useRouter } from 'vue-router';
const router = useRouter();

onMounted(async() => {
  try {
    user.value = await getCurrentUser();
  } catch (error) {
    console.error('ユーザー情報を読み込みできませんでした', error);
    errorMessage.value = 'ユーザー情報を読み込みできませんでした';
  }
});

// 送信処理
const submit = handleSubmit(async (values) => {
  const { portfolioImage, ...otherValues } = values;
  let url;
  let fileInfo;
  try {
    if (portfolioImage !== undefined) {
      [url, fileInfo] = await upload("portfolio", portfolioImage, user.value.uid);
    }

    otherValues.storagePath = url;

    const secondDocID = await addData(otherValues, fileInfo);

    // セカンドDocIDをフィールドに保存する
    await addElementToArray("members", user.value.uid, "portfolioIDs", secondDocID);

    if (otherValues.state === 'request') {
      await recordLog(user.value.uid, secondDocID, 'ポートフォリオが申請されました');
    }

    handleReset();

    router.push(`/admin/portfolio/${secondDocID}`);

  } catch (error) {
    console.error('更新エラー', error);
    errorMessage.value = '更新に失敗しました。';
  }
});

// フォームデータの登録
const addData = async (values, fileInfo) => {
  const formattedInputData = formatFormValues(values);
  // 1つでもvalueが空白であるかどうかをチェック
  const isEmpty = Object.values(formattedInputData).some(value => !value) || !fileInfo;
  if (isEmpty) {
    // 1つでも空白があれば申請できないようにする
    formattedInputData.requestReady = false;
  } else {
    formattedInputData.requestReady = true;
  }
  const saveData = { ...formattedInputData, createDateTimestamp: new Date() };
  if (fileInfo) {
    saveData.portfolioImage = fileInfo;
  }
  const secondDocID = await addTwoLevelSingleData(user.value.uid, saveData, "members", "portfolios");
  return secondDocID;
}

// 画像処理
const handleFileData = (file) => {
  if (file) {
    portfolioImage.value.value = file;
  } else {
    errorMessage.value = "アップロードするファイルがありません。";
  }
}
const handleDeleteFileData = () => {
  portfolioImage.value.value = [];
}

</script>
<style>
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 64px;
}
</style>
