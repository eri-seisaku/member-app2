<template>
  <v-container>
    <!-- <v-row>
      <v-col cols="12" md="6">
        <v-btn
          class="bg-white"
          variant="outlined"
          href='/admin/post'
        >
          新規追加
        </v-btn>
      </v-col>
    </v-row> -->
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
          <form @submit.prevent="submit" id="postForm" v-if="isReady">
            <NormalLabel label="ポートフォリオ画像" />
            <DropFileInput
              :schema="portfolioSchema.fields.portfolioImage"
              :filePath="storagePath.value.value ? storagePath.value.value : ''"
              :fileData="portfolioImage.value.value ? portfolioImage.value.value : {}"
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
              v-if="state.value.value !== 'approved' && loginUser.role === role.fullMember"
              v-model="state.value.value"
              :true-value="'request'"
              :false-value="'save'"
              label="ポートフォリオを申請する"
              persistent-hint
              hint="申請する場合は全ての項目が入力必須です"
            ></v-checkbox>
            <v-checkbox
              v-if="loginUser.role === role.administrator"
              v-model="state.value.value"
              :true-value="'approved'"
              :false-value="state.value.value"
              label="ポートフォリオを承認する"
            ></v-checkbox>
            <div class="d-flex justify-end mt-6">
              <v-btn
                variant="flat"
                :color="loginUser.role === role.administrator ? 'administrator' : 'member'"
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
import { ref, onMounted, watch } from "vue";
const userID = ref('');
const portfolioData = ref({});
const isReady = ref(false);
const loginUser = ref({});
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

const { handleSubmit } = useForm({
  validationSchema: portfolioSchema,
});

const state = useField('state');
const title = useField('title');
const portfolioURL = useField('portfolioURL');
const comment = useField('comment');
const genre = useField('genre');
const storagePath = useField('storagePath');
const portfolioImage = useField('portfolioImage');

console.log(storagePath.value.value)

watch(() => portfolioImage.value.value, (newVal) => {
  console.log(portfolioImage.value.value);
});

// route
import { useRoute } from 'vue-router';
const route = useRoute();

// utils
import { role } from '@/utils/category'; // 権限

// firebase
import { upload } from '@/firebase/v1/storage';
import { getCurrentUser } from '@/firebase/v1/auth';
import { getOneLevelSingleData, getTwoLevelSingleData, updateTwoLevelSingleData, recordLog } from '@/firebase/v1/firestore';

onMounted(async() => {
  try {
    // if (route.params.userID) {
    //   userID.value = route.params.userID;
    // } else {
    //   const currentUser = await getCurrentUser();
    //   userID.value = currentUser.uid;
    // }
    // ルートから取得したID
    userID.value = route.params.userID;

    // ログイン中ユーザーを取得
    const currentUser = await getCurrentUser();
    if (currentUser) {
      loginUser.value = await getOneLevelSingleData(currentUser.uid, "members");
    }

    if (route.params.portfolioID) {
      portfolioData.value = await getTwoLevelSingleData(userID.value, route.params.portfolioID, "members", "portfolios");
    }

    if (portfolioData.value) {
      state.value.value = portfolioData.value.state;
      title.value.value = portfolioData.value.title;
      comment.value.value = portfolioData.value.comment;
      genre.value.value = portfolioData.value.genre;
      storagePath.value.value = portfolioData.value.storagePath;
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
  let url;
  let fileInfo;
  try {

    console.log(portfolioImage);
    console.log(otherValues);
    console.log(url);

    // 正会員が保存できる範囲
    if (loginUser.value.role === role.fullMember) {
      if (portfolioImage instanceof File) {
        [url, fileInfo] = await upload("portfolio", portfolioImage, userID.value);
      }

      otherValues.storagePath = url;

      await updateData(otherValues, fileInfo);

      if (otherValues.state === 'request') {
        await recordLog(userID.value, route.params.portfolioID, 'ポートフォリオが申請されました');
      }

    // 管理者が保存できる範囲
    } else if (loginUser.value.role === role.administrator) {
      await updateData(otherValues, '')
    }

    message.value = '変更内容を保存しました。';

  } catch (error) {
    console.error('更新エラー', error);
    errorMessage.value = '更新に失敗しました。';
  }
});

// フォームデータの登録
const updateData = async (values, fileInfo) => {
  const isEmpty = Object.values(values).some(value => !value) || !fileInfo;
  if (isEmpty) {
    values.requestReady = false;
  } else {
    values.requestReady = true;
  }
  if (fileInfo) {
    values.portfolioImage = fileInfo;
  }
  await updateTwoLevelSingleData(userID.value, "members", "portfolios", route.params.portfolioID, values);
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
  storagePath.value.value = '';
}

</script>
<style>
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 64px;
}
</style>
