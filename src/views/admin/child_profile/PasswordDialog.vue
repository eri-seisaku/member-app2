<template>
  <Dialog v-model:dialog="dialog" :size="450">
    <template v-slot:content>
      <form @submit.prevent="submit">
        <v-row>
          <v-col cols="12">
            <NormalLabel label="現在のパスワード" />
            <PasswordField :field="currentPassword" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <NormalLabel label="新しいパスワード" />
            <PasswordFieldWithChip :field="newPassword" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <NormalLabel label="新しいパスワード(確認用)" />
            <PasswordField :field="confirmPassword" />
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
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue';
const dialog = ref(false);
const message = ref('');
const errorMessage = ref('');
const form = ref(null);

// components
import Dialog from '@/components/Dialog.vue';
import Alert from '@/components/Alert.vue';
import PasswordField from '@/components/inputs/PasswordField.vue';
import PasswordFieldWithChip from '@/components/inputs/PasswordFieldWithChip.vue';
import NormalLabel from '@/components/inputs/helpers/NormalLabel.vue';

// validation
import { useField, useForm } from 'vee-validate';
import { passwordSchema } from '@/validate/validate';

const { handleSubmit, handleReset } = useForm({
  validationSchema: passwordSchema,
});

const currentPassword = useField('currentPassword');
const newPassword = useField('newPassword');
const confirmPassword = useField('confirmPassword');

// firebase
import { updatePasswordByAuth } from '@/firebase/v1/auth';

// v-formを使ったリセット
const reset = () => {
  form.value.resetValidation();
  form.value.reset();
};

// 送信処理
const submit = handleSubmit(async (values) => {
  try {
    if (values.newPassword !== values.confirmPassword) {
      errorMessage.value = '確認用パスワードが一致しません。';
      return;
    }
    await updatePasswordByAuth(values.currentPassword, values.newPassword);
    // reset();
    handleReset();
    errorMessage.value = '';
    message.value = 'パスワードの更新に成功しました。';

  } catch (error) {
    console.error(error);
    errorMessage.value = 'パスワードの変更に失敗しました。', error;
  }
});
</script>
