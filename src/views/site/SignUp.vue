<template>
  <v-container>
    <form @submit.prevent="submit" class="my-8">
      <div v-show="!confirmMode">
        <SignUpForm />
      </div>
      <div v-show="confirmMode">
        <Confirm
          :value="inputValues"
          @submit="submit"
          @back="back"
        />
      </div>
      <!-- 共通 -->
      <v-row align-content="center">
        <v-col cols="12" v-if="!confirmMode" align="center" class="my-4">
          <v-btn
            type="submit"
            variant="outlined"
            size="large"
            min-width="100"
          >
            確認
          </v-btn>
        </v-col>
        <v-col v-if="errorMessage">
          <Alert
            color="red"
            :text="errorMessage"
          />
        </v-col>
      </v-row>
    </form>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue';
const confirmMode = ref(false); // 確認画面の切り替え
const inputValues = ref({}); // 確認画面にデータを渡す
const errorMessage = ref('');

// components
import Alert from '@/components/Alert.vue';
import Confirm from '@/views/site/child_signup/Confirm.vue';
import SignUpForm from '@/views/site/child_signup/SignUpForm.vue';

// firebase
import { signUp } from '@/firebase/v1/auth';
import {
  setOneLevelSingleData,
  recordLog
} from '@/firebase/v1/firestore';
import { upload } from '@/firebase/v1/storage';

// functions
import { sendMail } from "@/firebase/firebase";

// utils
import { formatFormValues } from '@/utils/formatData';
import { setEightArea } from '@/utils/states'; // 八区分
import { role } from '@/utils/category'; // 権限

// router
import { useRouter } from 'vue-router';
const router = useRouter();

// validate
import { validationSchema } from '@/validate/validate';
import { useForm } from 'vee-validate';

const { handleSubmit, errors } = useForm({
  validationSchema: validationSchema,
});

// 入力フォーム全体を監視
watch(() => errors.value, () => {
  if (!confirmMode.value) {
    if (Object.keys(errors.value).length > 0) {
      errorMessage.value = '入力内容をご確認ください。';
    } else {
      errorMessage.value = "";
    }
  }
});

// 子から発火
const back = () => {
  confirmMode.value = false;
  errorMessage.value = "";
};

const submit = handleSubmit(async (values) => {
  try {
    if (!confirmMode.value) {
      confirmMode.value = true;
      errorMessage.value = '';
      inputValues.value = values;

    } else {
      const { userUniqueFile, portfolioFile, ...otherValues } = values;

      // undefinedは保存できないため空白に
      const formattedInputData = formatFormValues(otherValues);

      // authに保存
      const user = await signUp(formattedInputData.email, formattedInputData.password);

      // storageに保存
      const [userUniqueFileURL, userUniqueFileMetadata] = await upload("members", userUniqueFile[0], user.uid);

      const [portfolioFileURL, portfolioFileMetadata] = await upload("members", portfolioFile[0], user.uid);

      // firestoreに保存
      const otherData = {
        memberID: user.uid,
        eightArea: setEightArea(formattedInputData.state),
        role: role.member,
        joinDate: new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }),
        createDateTimestamp: new Date(),
        userUniqueFileURL: userUniqueFileURL,
        portfolioFileURL: portfolioFileURL
      };

      // 登録したくない物を削除
      ["checkbox", "password"].forEach(key => delete formattedInputData[key]);

      const userData = { ...formattedInputData, ...otherData };
      await setOneLevelSingleData(user.uid, "members", userData);

      // ログに記録
      await recordLog(user.uid, "", "会員申請されました");

      // メール送信
      const sendData = {
        name: values.name,
        email: values.email,
        content: '会員申込'
      };
      await sendMail(sendData);

      router.push({ name: 'Admin' });
    }
  } catch (error) {
    console.error("エラーが発生しました: ", error);
    errorMessage.value = error;
  }
});
</script>
