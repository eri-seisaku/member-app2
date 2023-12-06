<template>
  <v-container class="fill-height" fluid>
    <v-row no-gutters>
      <v-col cols="12" md="4">
        <v-sheet class="pa-6 ma-6" rounded align="center">
          <v-row>
            <v-col cols="12">
              <Avatar :imageSrc="imageSrc" />
            </v-col>
            <v-col cols="12">
              <v-btn
                size="large"
                variant="outlined"
                @click="imageDialog = true"
              >
                画像を変更
              </v-btn>
            </v-col>
          </v-row>
          <ImageDialog
            v-model:dialog="imageDialog"
            @update:profileIconUrl="handleChangeProfileIcon"
            :authData="user"
          />
        </v-sheet>
      </v-col>
      <v-col cols="12" md="8">
        <v-sheet class="pa-6 ma-6" rounded>
          <v-row>
            <v-col cols="12" md="6" v-for="editInfo in editData">
              <label class="text-subtitle-1 text-medium-emphasis">
                {{ editInfo.label }}
              </label>
              <TextField
                :field="editInfo.field"
                :hint="editInfo.hint"
              />
              <!-- <v-text-field
                v-model="editInfo.field.value.value"
                :error-messages="editInfo.field.errorMessage.value"
                density="compact"
                variant="outlined"
                form="profileForm"
              ></v-text-field> -->
            </v-col>
            <v-col cols="12" md="6" v-for="readInfo in readData">
              <label class="text-subtitle-1 text-medium-emphasis">
                {{ readInfo.label }}
              </label>

              <v-text-field
                v-model="readInfo.value.value"
                density="compact"
                variant="outlined"
                :disabled="true"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-subtitle-1 text-medium-emphasis">
                パスワード
              </div>
              <v-btn
                block
                class="mb-8"
                size="large"
                variant="outlined"
                @click="passwordDialog = true"
              >
                新しいパスワードを設定
              </v-btn>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-subtitle-1 text-medium-emphasis">
                メールアドレス
              </div>
              <v-btn
                block
                class="mb-8"
                size="large"
                variant="outlined"
                @click="mailDialog = true"
              >
                新しいメールアドレスを設定
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="d-flex justify-end">
              <form @submit.prevent="submit" id="profileForm">
                <v-btn
                  variant="outlined"
                  type="submit"
                  form="profileForm"
                >
                  SUBMIT
                </v-btn>
              </form>
            </v-col>
          </v-row>
          <v-row v-if="message || errorMessage">
            <v-col cols="12">
              <Alert
                :color="message ? 'primary' : 'red'"
                :text="message ? message: errorMessage"
              />
            </v-col>
          </v-row>
          <PasswordDialog
            v-model:dialog="passwordDialog"
          />
          <MailDialog
            v-model:dialog="mailDialog"
            :authData="user"
          />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const passwordDialog = ref(false);
const mailDialog = ref(false);
const imageDialog = ref(false);

const user = ref({});
const imageSrc = ref('');

const message = ref('');
const errorMessage = ref('');

// validation
import { useField, useForm } from 'vee-validate';
import { profileSchema } from '@/validate/validate';

const { handleSubmit } = useForm({
  validationSchema: profileSchema,
});

// components
import PasswordDialog from '@/views/admin/child_profile/PasswordDialog.vue';
import MailDialog from '@/views/admin/child_profile/MailDialog.vue';
import ImageDialog from '@/views/admin/child_profile/ImageDialog.vue';
import Alert from '@/components/Alert.vue';
import Avatar from '@/components/Avatar.vue';
import TextField from '@/components/inputs/TextField.vue';
import PasswordField from '@/components/inputs/PasswordField.vue';

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

// firebase
import { getCurrentUser } from '@/firebase/v1/auth';
import { getOneLevelData, updateOneLevelData } from '@/firebase/v1/firestore';

onMounted(async () => {
  try {
    user.value = await getCurrentUser(); // user情報

    const userDoc = await getOneLevelData(user.value.uid, "members"); // 全データ

    console.log(userDoc);

    // dbから取得したデータを各フィールドに設定
    editData.forEach((editInfo) => {
      // console.log(userDoc[editInfo.key]);
      editInfo.field.value.value = userDoc[editInfo.key];
    });

    imageSrc.value = userDoc.profileIcon;

    readData.forEach((readInfo) => {
      readInfo.value.value = userDoc[readInfo.key];
    });

  } catch (error) {
    errorMessage.value = error;
    console.error('ユーザーデータ取得エラー', error);
  }
});


// 送信処理
const submit = handleSubmit(async (values) => {
  try {
    console.log(values);
    // ユーザー情報を更新
    await updateOneLevelData(user.value.uid, "members", values);
    message.value = 'ユーザー情報の更新に成功しました。';
  } catch (error) {
    console.error('ユーザーデータ更新エラー', error);
    errorMessage.value = 'ユーザー情報の更新に失敗しました。';
  }
});

const handleChangeProfileIcon = async (filePath) => {
  // console.log(filePath);
  imageSrc.value = filePath;
}
</script>

