<template>
  <Dialog v-model:dialog="dialog" :size="450">
    <template v-slot:content>
      <v-row>
        <v-col cols="12">
          <p class="text-subtitle-1 text-medium-emphasis">確認のため新しいメールアドレスにメールを送信します。</p>
        </v-col>
        <v-col cols="12" v-if="message || errorMessage">
          <Alert
            :color="message ? 'primary' : 'red'"
            :text="message ? message : errorMessage"
          />
        </v-col>
        <v-col cols="12" v-if="changeMailMode">
          <label class="text-subtitle-1 text-medium-emphasis">
            旧メールアドレス
          </label>
          <v-text-field
            :model-value="authData.email"
            density="compact"
            variant="outlined"
            disabled
          ></v-text-field>
          <form @submit.prevent="submit" id="authFrom">
            <label class="text-subtitle-1 text-medium-emphasis">
              新メールアドレス
            </label>
            <v-text-field
              v-model="email.value.value"
              :error-messages="email.errorMessage.value"
              density="compact"
              variant="outlined"
            ></v-text-field>
            <label class="text-subtitle-1 text-medium-emphasis">
              パスワード
            </label>
            <v-text-field
              v-model="password.value.value"
              :error-messages="password.errorMessage.value"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              @click:append-inner="visible = !visible"
              density="compact"
              variant="outlined"
            ></v-text-field>
            <div class="d-flex justify-end mt-4">
              <v-btn
                variant="outlined"
                type="submit"
                class="mb-4"
              >
                SUBMIT
              </v-btn>
            </div>
          </form>
        </v-col>
      </v-row>
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue';
const dialog = ref(false);
const visible = ref(false);
const changeMailMode = ref(true);

const message = ref('');
const errorMessage = ref('');

// 親から子へ
const props = defineProps({
  authData: Object
});

// console.log(props.authData);

// validation
import { useField, useForm } from 'vee-validate';
import { authSchema } from '@/validate/validate';

const { handleSubmit } = useForm({
  validationSchema: authSchema,
});

const email = useField('email');
const password = useField('password');

// components
import Dialog from '@/components/Dialog.vue';
import Alert from '@/components/Alert.vue';

// firebase
import { updateEmailByAuth } from '@/firebase/v1/auth';
import { updateOneLevelData } from '@/firebase/v1/firestore';

const submit = handleSubmit(async (values) => {
  try {
    // console.log(values.email, props.authData.uid);

    // authentication更新
    await updateEmailByAuth(values.password, values.email);

    // 登録前にデータを加工
    const userData = {
      email: values.email
    };

    // console.log(userData);

    // firestore更新
    await updateOneLevelData(props.authData.uid, "members", userData);

    changeMailMode.value = false;

    errorMessage.value = '';
    message.value = 'ユーザー情報の更新に成功しました。';

  } catch (error) {
    console.error(error);
    errorMessage.value = 'ユーザー情報の変更に失敗しました。';
  }
});
</script>
