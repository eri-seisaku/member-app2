<template>
  <v-row>
    <v-col cols="12">
      <v-sheet class="pa-6 mx-2" rounded>
        <v-form @submit.prevent="submit">
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
                variant="outlined"
                type="submit"
              >
                保存
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <Alert
          v-if="message || errorMessage"
          :color="message ? 'primary' : 'red'"
          :text="message ? message : errorMessage"
        />
      </v-sheet>
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
  { key: 'state', label: '都道府県', value: ref('')},
  { key: 'eightArea', label: '八区分', value: ref('')},
  { key: 'role', label: '権限', value: ref('')},
  { key: 'joinDate', label: '加入年月日', value: ref('')},
];
// 編集専用
const editData = [
  { key: 'name', field: useField('name'), label: '代表者名' },
  { key: 'nameKana', field: useField('nameKana'), label: '代表者名(フリガナ)' },
  { key: 'officeName', field: useField('officeName'), label: '事務所名' },
  { key: 'officeNameKana', field: useField('officeNameKana'), label: '事務所名(フリガナ)' },
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
import { updateOneLevelData } from '@/firebase/v1/firestore';

// 送信処理
const submit = handleSubmit(async (values) => {
  try {
    // console.log(values);
    // ユーザー情報を更新
    await updateOneLevelData(props.authUID, "members", values);
    message.value = 'ユーザー情報の更新に成功しました。';
  } catch (error) {
    console.error('ユーザーデータ更新エラー', error);
    errorMessage.value = 'ユーザー情報の更新に失敗しました。';
  }
});

</script>

