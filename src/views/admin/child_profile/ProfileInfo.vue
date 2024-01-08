<template>
  <v-row>
    <v-col cols="12">
      <form @submit.prevent="submit">
        <v-row>
          <v-col cols="12" md="6" v-for="editInfo in textFields" :key="editInfo.key">
            <NormalLabel :label="editInfo.label" />
            <TextField
              :field="editInfo.field"
              :hint="editInfo.hint"
            />
          </v-col>
          <v-col cols="12" md="6">
            <NormalLabel label="生年月日" />
            <TextField
              :field="birthday"
              hint="半角数字でYYYYMMDD形式でご記入ください"
              placeholder="19910101"
              @blur="formatDate(birthday.value.value)"
            />
          </v-col>
          <v-col cols="12" md="6">
            <NormalLabel label="郵便番号" />
            <div class="d-flex">
              <TextField
                :field="zipCode"
                hint="ハイフンなし数字のみ"
              />
              <v-btn
                variant="outlined"
                class="ml-4 bg-white"
                min-height="40"
                :disabled="!!zipCode.errorMessage.value || !zipCode.value.value"
                @click="searchAddress"
              >
                住所検索
              </v-btn>
              <p v-if="searchMessage" class="text-red-lighten-1 text-subtitle-2">{{ searchMessage }}</p>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <NormalLabel label="八区分" />
            <Select
              :field="eightArea"
              :items="eightAreas"
              disabled
            />
          </v-col>
          <v-col cols="12" md="6">
            <NormalLabel label="都道府県" />
            <Select
              :field="state"
              :items="states"
            />
          </v-col>
          <v-col cols="12" md="6" v-for="editInfo in addressFields" :key="editInfo.key">
            <NormalLabel :label="editInfo.label" />
            <TextField
              :field="editInfo.field"
              :hint="editInfo.hint"
              :placeholder="editInfo.placeholder"
            />
          </v-col>
          <v-col cols="12" md="6" v-for="editInfo in categoryFields" :key="editInfo.key">
            <NormalLabel :label="editInfo.label" />
            <Select
              :field="editInfo.field"
              :items="editInfo.items"
              :disabled="loginUser.role === roleGroup.administrator ? false : true"
            />
          </v-col>
          <v-col cols="12" md="6">
            <NormalLabel label="権限" />
            <Select
              :field="role"
              :items="Object.values(roleGroup)"
              :disabled="loginUser.role === roleGroup.administrator ? false : true"
            />
          </v-col>
          <v-col cols="12" md="6">
            <NormalLabel label="加入年月日" />
            <TextField
              :field="joinDate"
              :disabled="loginUser.role === roleGroup.administrator ? false : true"
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
        v-if="message || errorMessage"
        :color="message ? 'primary' : 'red'"
        :text="message ? message : errorMessage"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const loginUser = ref({});
const searchMessage = ref(''); // 郵便番号検索時のメッセージ
const message = ref('');
const errorMessage = ref('');

const props = defineProps({
  authUID: String,
  dbData: Object
});

// components
import Alert from '@/components/Alert.vue';
import TextField from '@/components/inputs/TextField.vue';
import Select from '@/components/inputs/Select.vue';
import NormalLabel from '@/components/inputs/helpers/NormalLabel.vue';

// utils
import { role as roleGroup } from '@/utils/category'; // 権限
import { states, eightAreas, setEightArea } from '@/utils/states'; // 都道府県,八区分
import { fetchAddress } from '@/utils/address'; // 住所取得
import { formatDateWithSlash } from '@/utils/formatData'; // 年月日を変換




// 入力された日付に/を入れる
const formatDate = (value) => {
  if (value && value.length === 8) {
    const formattedDate = formatDateWithSlash(value);
    birthday.value.value = formattedDate;
  }
};

// 郵便番号から住所検索
const searchAddress = async () => {
  try {
    const res = await fetchAddress(zipCode.value.value);

    if (res === 200) {
      searchMessage.value = '郵便番号が見つかりませんでした。';
    } else if (typeof res === 'object') {
      state.value.value = res.data.pref;
      eightArea.value.value = setEightArea(res.data.pref);
      addressFields[0].field.value.value = res.data.address;
    }
  } catch (error) {
    console.error('郵便番号検索エラー:', error);
    errorMessage.value = '郵便番号検索中にエラーが発生しました';
  }
};

// validation
import { useField, useForm } from 'vee-validate';
import { profileSchema } from '@/validate/validate';
import {
  textInputItems,
  addressInputItems,
  categoryInputItems
} from '@/validate/field';

const { handleSubmit } = useForm({
  validationSchema: profileSchema,
});

// 編集専用
const excludeKeys = ['capital', 'email']; // 表示したくない値

const textFields = textInputItems
  .filter(fieldInfo => !excludeKeys.includes(fieldInfo.key))
  .map(fieldInfo => {
    return { ...fieldInfo, field: useField(fieldInfo.key) };
  });

const categoryFields = categoryInputItems.map(fieldInfo => {
  return { ...fieldInfo, field: useField(fieldInfo.key) };
});

const addressFields = addressInputItems.map(fieldInfo => {
  return { ...fieldInfo, field: useField(fieldInfo.key) };
});

const birthday = useField('birthday');
const zipCode = useField('zipCode');
const state = useField('state');
const role = useField('role');
const joinDate = useField('joinDate');
const eightArea = useField('eightArea');

// firebase
import {
  getOneLevelSingleData,
  updateOneLevelSingleData
} from '@/firebase/v1/firestore';
import { getCurrentUser } from '@/firebase/v1/auth';

onMounted(async () => {
  try {
    // ログイン中ユーザー取得
    const user = await getCurrentUser();
    loginUser.value = await getOneLevelSingleData(user.uid, "members");

    // 編集textデータ
    textFields.forEach((editInfo) => {
      editInfo.field.value.value = props.dbData[editInfo.key];
    });
    // 編集selectデータ
    categoryFields.forEach((editInfo) => {
      editInfo.field.value.value = props.dbData[editInfo.key];
    });
    // 編集selectデータ
    addressFields.forEach((editInfo) => {
      editInfo.field.value.value = props.dbData[editInfo.key];
    });

    birthday.value.value = props.dbData.birthday;
    zipCode.value.value = props.dbData.zipCode;
    state.value.value = props.dbData.state;
    role.value.value = props.dbData.role;
    joinDate.value.value = props.dbData.joinDate;
    eightArea.value.value = props.dbData.eightArea;

  } catch (error) {
    errorMessage.value = error;
    console.error('ユーザー情報を読み込みできませんでした', error);
  }
});

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

