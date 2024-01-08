<template>
  <v-row>
    <v-col cols="12">
      <form @submit.prevent="submit">
        <v-row>
          <v-col cols="12" md="6" v-for="editInfo in editData">
            <NormalLabel :label="editInfo.label" />
            <TextField
              :field="editInfo.field"
              :hint="editInfo.hint"
            />
          </v-col>
          <v-col cols="12" md="6" v-for="readInfo in readData">
            <NormalLabel :label="readInfo.label" />
            <v-text-field
              v-model="readInfo.value.value"
              density="compact"
              variant="outlined"
              :disabled="true"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn
              variant="flat"
              color="member"
              type="submit"
            >
              保存
            </v-btn>
          </v-col>
        </v-row>
      </form>
      <Alert
        v-if="message || errorMessage"
        :color="message ? 'primary' : 'red'"
        :text="message ? message : errorMessage"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const message = ref('');
const errorMessage = ref('');

const props = defineProps({
  authUID: String,
  dbData: Object
});

// console.log(props.dbData.role)

// components
import Alert from '@/components/Alert.vue';
import TextField from '@/components/inputs/TextField.vue';
import NormalLabel from '@/components/inputs/helpers/NormalLabel.vue';

// validation
import { useField, useForm } from 'vee-validate';
import { profileSchema } from '@/validate/validate';

const { handleSubmit } = useForm({
  validationSchema: profileSchema,
});

// 読み取り専用
const readData = [
  { key: 'joinDate', label: '加入年月日', value: ref('')},
];
// 編集専用
const editData = [
  { key: 'name', field: useField('name'), label: '代表者名' },
  { key: 'nameKana', field: useField('nameKana'), label: '代表者名(フリガナ)' },
  { key: 'officeName', field: useField('officeName'), label: '事務所名' },
  { key: 'officeNameKana', field: useField('officeNameKana'), label: '事務所名(フリガナ)' },
  { key: 'state', field: useField('state'), label: '都道府県' },
  { key: 'eightArea', field: useField('eightArea'), label: '八区分' },
  { key: 'specialty', field: useField('specialty'), label: '専門分野' },
  { key: 'industry', field: useField('industry'), label: '業種' },
  { key: 'role', field: useField('role'), label: '権限' },
];

onMounted(async () => {
  try {
    // 編集データ
    editData.forEach((editInfo) => {
      editInfo.field.value.value = props.dbData[editInfo.key];
    });
    // 読みとり専用
    readData.forEach((readInfo) => {
      readInfo.value.value = props.dbData[readInfo.key];
    });

  } catch (error) {
    errorMessage.value = error;
    console.error('ユーザー情報を読み込みできませんでした', error);
  }
});

// firebase
import { updateOneLevelSingleData } from '@/firebase/v1/firestore';

// 送信処理
const submit = handleSubmit(async (values) => {
  try {
    // ユーザー情報を更新
    await updateOneLevelSingleData(props.authUID, "members", values);
    message.value = 'ユーザー情報の更新に成功しました。';
  } catch (error) {
    console.error('ユーザーデータ更新エラー', error);
    errorMessage.value = 'ユーザー情報の更新に失敗しました。';
  }
});

</script>

