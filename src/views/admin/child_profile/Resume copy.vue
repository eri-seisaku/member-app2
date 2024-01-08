<template>
  <v-row>
    <v-col cols="12" class="pa-4">
      <form @submit.prevent="submit">
        <!-- 顔写真 -->
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <NormalLabel label="顔写真" />
            <div class="d-flex flex-column flex-md-row align-center">
              <Avatar
                :imageSrc="imageSrc ? imageSrc : ''"
                :size="100"
                rounded="0"
              />
              <FileInputButton
                :schema="resumeSchema.fields.image"
                @update:fileData="handleFileData"
                @update:previewURL="handlePreviewURL"
                @update:deleteFileData="handleDeleteFileData"
              />
            </div>
          </v-col>
        </v-row>
        <!-- /顔写真 -->
        <v-row v-for="fieldInfo in resumeFields" :key="fieldInfo.key">
          <v-col cols="12" md="6">
            <NormalLabel :label="fieldInfo.label" />
            <TextArea
              :field="fieldInfo.field"
              :hint="fieldInfo.hint"
              :rows="fieldInfo.rows"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn
              variant="flat"
              :color="loginUser.role === roleGroup.administrator ? 'administrator' : 'member'"
              type="submit"
            >
              保存
            </v-btn>
          </v-col>
        </v-row>
      </form>
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
const loginUser = ref({});
const imageSrc = ref('');
const fileData = ref([]);
const message = ref('');
const errorMessage = ref('');

const props = defineProps({
  authUID: String,
  dbData: Object
});

if (props.dbData.profileIcon) {
  imageSrc.value = props.dbData.profileIcon.url;
}


// components
import Alert from '@/components/Alert.vue';
import TextArea from '@/components/inputs/TextArea.vue';
import NormalLabel from '@/components/inputs/helpers/NormalLabel.vue';
import Avatar from '@/components/Avatar.vue';
import FileInputButton from '@/components/buttons/FileInputButton.vue';

// validation
import { useField, useForm } from 'vee-validate';
import { resumeSchema } from '@/validate/validate';

const { handleSubmit } = useForm({
  validationSchema: resumeSchema,
});

const resumeFields = [
  { key: 'jobType', label: '職種', field: useField('jobType'), rows: 2, hint: '最大50文字まで' },
  { key: 'shortCareer', label: '略歴', field: useField('shortCareer'), rows: 4, hint: '最大200文字まで' },
  { key: 'businessFields', label: '主な事業分野', field: useField('businessFields'), rows: 4, hint: '最大200文字まで' },
  { key: 'career', label: '経歴', field: useField('career'), rows: 4, hint: '最大200文字まで' },
];

// firebase
import { upload } from '@/firebase/v1/storage';
import { getOneLevelSingleData, updateOneLevelSingleData } from '@/firebase/v1/firestore';
import { getCurrentUser } from '@/firebase/v1/auth';
// utils
import { formatFormValues } from '@/utils/formatData';
import { role as roleGroup } from '@/utils/category'; // 権限

onMounted(async () => {
  try {
    // ログイン中ユーザー取得
    const user = await getCurrentUser();
    loginUser.value = await getOneLevelSingleData(user.uid, "members");

    resumeFields.forEach((fieldInfo) => {
      fieldInfo.field.value.value = props.dbData[fieldInfo.key];
    });
  } catch (error) {
    errorMessage.value = error;
    console.error('ユーザー情報を読み込みできませんでした', error);
  }
});

// 送信処理
const submit = handleSubmit(async (values) => {
  try {
    let uploadResult;
    if (fileData.value) {
      uploadResult = await upload("profile", fileData.value, props.authUID);
    }
    const formattedInputData = formatFormValues(values);

    console.log(uploadResult)
    // if (uploadResult) {
    //   formattedInputData.profileIcon = uploadResult;
    // }
    // await updateOneLevelSingleData(props.authUID, "members", formattedInputData);
    message.value = '更新に成功しました。';
  } catch (error) {
    console.error('更新エラー', error);
    errorMessage.value = '更新に失敗しました。';
  }
});

// 画像処理
const handleFileData = (file) => {
  console.log(file);
  if (file) {
    fileData.value = file;
  } else {
    errorMessage.value = "アップロードするファイルがありません。";
  }
}
const handlePreviewURL = (url) => {
  imageSrc.value = url;
}
const handleDeleteFileData = () => {
  imageSrc.value = props.dbData.profileIcon ? props.dbData.profileIcon : '';
  fileData.value = [];
}

</script>

