<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <v-sheet class="pa-2 pa-sm-3 pa-md-6" rounded>
          <form @submit.prevent="submit" id="postForm" v-if="isReady">
            <NormalLabel label="ポートフォリオ画像" />
            <DropFileInput
              :schema="portfolioSchema.fields.portfolioImage"
              :fileData="portfolioImage.value.value ? portfolioImage.value.value : ''"
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
              hint="最大50文字まで"
              :rows="2"
            />
            <NormalLabel label="コメント" />
            <TextArea
              :field="comment"
              hint="最大200文字まで"
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
const portfolioData = ref({});
const isReady = ref(false);
const errorMessage = ref('');

// components
import DropFileInput from '@/components/inputs/DropFileInput.vue';
import NormalLabel from '@/components/inputs/helpers/NormalLabel.vue';
import TextField from '@/components/inputs/TextField.vue';
import TextArea from '@/components/inputs/TextArea.vue';

// validate
import { useField, useForm } from 'vee-validate';
import { portfolioSchema } from '@/validate/validate';

const { handleSubmit } = useForm({
  validationSchema: portfolioSchema,
});

const state = useField('state');
const title = useField('title');
const portfolioURL = useField('portfolioURL');
const comment = useField('comment');
const genre = useField('genre');
const portfolioImage = useField('portfolioImage');

// route
import { useRoute } from 'vue-router';
const route = useRoute();

// firebase
import { upload } from '@/firebase/v1/storage';
import { getCurrentUser } from '@/firebase/v1/auth';
import { getTwoLevelSingleData, updateTwoLevelSingleData, recordLog } from '@/firebase/v1/firestore';

onMounted(async() => {
  try {
    user.value = await getCurrentUser();
    if (route.params.portfolioID) {
      portfolioData.value = await getTwoLevelSingleData(user.value.uid, route.params.portfolioID, "portfolios", "portfolio");
    }
    if (portfolioData.value) {
      state.value.value = portfolioData.value.state;
      title.value.value = portfolioData.value.title;
      comment.value.value = portfolioData.value.comment;
      genre.value.value = portfolioData.value.genre;
      portfolioURL.value.value = portfolioData.value.portfolioURL;
      portfolioImage.value.value = portfolioData.value.portfolioImage;
    }
    isReady.value = true;
  } catch (error) {
    console.error('ポートフォリオデータの取得ができませんでした', error);
    errorMessage.value = 'ポートフォリオデータの取得ができませんでした';
  }
});

// 送信処理
const submit = handleSubmit(async (values) => {
  const { portfolioImage, ...otherValues } = values;
  let uploadResult;
  try {
    if (portfolioImage !== undefined) {
      uploadResult = await upload("portfolio", portfolioImage, user.value.uid);
    }

    await updateData(otherValues, uploadResult);
    if (otherValues.state === 'request') {
      await recordLog(user.value.uid, route.params.portfolioID, 'ポートフォリオが申請されました');
    }

  } catch (error) {
    console.error('更新エラー', error);
    errorMessage.value = '更新に失敗しました。';
  }
});

// フォームデータの登録
const updateData = async (values, uploadResult) => {
  const isEmpty = Object.values(values).some(value => !value) || !uploadResult;
  if (isEmpty) {
    values.requestReady = false;
  } else {
    values.requestReady = true;
  }
  if (uploadResult) {
    values.portfolioImage = uploadResult;
  }
  await updateTwoLevelSingleData(user.value.uid, "portfolios", "portfolio", route.params.portfolioID, values);
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
