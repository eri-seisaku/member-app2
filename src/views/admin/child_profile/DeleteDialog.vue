<template>
  <Dialog v-model:dialog="dialog" :size="450">
    <template v-slot:content>
      <v-row no-gutters>
        <v-col cols="12">
          <p class="mb-4">退会前の説明など制作中</p>
          <!-- <NormalLabel label="現在のメールアドレス" />
          <v-text-field
            :model-value="props.authData.email"
            disabled
            density="compact"
            variant="outlined"
          ></v-text-field> -->
          <!-- <form @submit.prevent="submit">
            <v-row no-gutters>
              <v-col cols="12">
                <NormalLabel label="新しいメールアドレス" />
                <TextField :field="email" />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12">
                <NormalLabel label="パスワード" />
                <PasswordField :field="password" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn
                  variant="outlined"
                  type="submit"
                >
                  変更内容を保存
                </v-btn>
              </v-col>
            </v-row>
          </form> -->
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
  </Dialog>
</template>

<script setup>
import { ref } from 'vue';
const dialog = ref(false);
const message = ref('');
const errorMessage = ref('');
const form = ref(null);

// 親から子へ
const props = defineProps({
  authData: Object
});

// components
import TextField from '@/components/inputs/TextField.vue';
import PasswordField from '@/components/inputs/PasswordField.vue';
import Dialog from '@/components/Dialog.vue';
import Alert from '@/components/Alert.vue';
import NormalLabel from '@/components/inputs/helpers/NormalLabel.vue';

// validation
import { useField, useForm } from 'vee-validate';
import { authSchema } from '@/validate/validate';

const { handleSubmit, handleReset } = useForm({
  validationSchema: authSchema,
});

const email = useField('email');
const password = useField('password');

// firebase
import { updateEmailByAuth } from '@/firebase/v1/auth';
import { updateOneLevelSingleData } from '@/firebase/v1/firestore';

const submit = handleSubmit(async (values) => {
  try {

    await updateEmailByAuth(values.password, values.email);

    // 登録前にデータを加工
    const userData = {
      email: values.email
    };

    await updateOneLevelSingleData(props.authData.uid, "members", userData);

    handleReset();

    errorMessage.value = '';
    message.value = 'メールアドレスの更新に成功しました。';

  } catch (error) {
    console.error(error);
    errorMessage.value = 'メールアドレスの変更に失敗しました。';
  }
});
</script>
