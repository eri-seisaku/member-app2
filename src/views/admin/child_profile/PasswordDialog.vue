<template>
  <Dialog v-model:dialog="dialog" :size="450">
    <template v-slot:content>
      <v-row>
        <v-col cols="12" v-if="message || errorMessage">
          <Alert
            :color="message ? 'primary' : 'red'"
            :text="message ? message : errorMessage"
          />
        </v-col>
        <v-col cols="12" v-if="changePasswordMode">
          <form @submit.prevent="submit" id="passwordForm">
            <v-row no-gutters class="mb-7">
              <v-col cols="12">
                <label class="text-subtitle-1 text-medium-emphasis">
                  現在のパスワード
                </label>
                <PasswordField
                  :field="currentPassword"
                  hint=""
                />
              </v-col>
            </v-row>
            <v-row no-gutters class="mb-7">
              <v-col cols="12">
                <label class="text-subtitle-1 text-medium-emphasis">
                  新しいパスワード
                </label>
                <PasswordField
                  :field="newPassword"
                  hint="大文字、小文字、数字、特殊文字(@、$、!、%、*、?、&)の8文字以上"
                />
                <v-chip
                  v-for="chip in chips"
                  :key="chip.key"
                  class="ma-2"
                  size="small"
                  :color="chip.value.value ? 'success' : 'gray'"
                  :prepend-icon="chip.value.value ? 'mdi-checkbox-marked-circle' : 'mdi-check-circle-outline'"
                >
                  {{ chip.text }}
                </v-chip>
              </v-col>
            </v-row>
            <v-row no-gutters class="mb-7">
              <v-col cols="12">
                <label class="text-subtitle-1 text-medium-emphasis">
                  新しいパスワード(確認用)
                </label>
                <PasswordField
                  :field="confirmPassword"
                  hint=""
                />
              </v-col>
            </v-row>
            <v-row no-gutters align-content="end">
              <v-col cols="12" align="end">
                <v-btn
                  variant="outlined"
                  type="submit"
                  size="large"
                  min-width="100"
                >
                  SUBMIT
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </v-col>
      </v-row>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
const dialog = ref(false);
const changePasswordMode = ref(true);
const message = ref('');
const errorMessage = ref('');

// components
import Dialog from '@/components/Dialog.vue';
import Alert from '@/components/Alert.vue';
import PasswordField from '@/components/inputs/PasswordField.vue';

// firebase
import { updatePasswordByAuth } from '@/firebase/v1/auth';

// utils
import { chips, updateChips } from '@/utils/formHelper';

// validation
import { useField, useForm } from 'vee-validate';
import { passwordSchema } from '@/validate/validate';

const { handleSubmit } = useForm({
  validationSchema: passwordSchema,
});

const currentPassword = useField('currentPassword');
const newPassword = useField('newPassword');
const confirmPassword = useField('confirmPassword');

// watchでpassword入力の状態を監視
watch(() => newPassword.value.value, (newVal) => {
  updateChips(newVal, chips);
});

const submit = handleSubmit(async (values) => {
  try {
    if (values.newPassword !== values.confirmPassword) {
      errorMessage.value = '確認用パスワードが一致しません。';
      return;
    }
    await updatePasswordByAuth(values.currentPassword, values.newPassword);

    changePasswordMode.value = false;

    errorMessage.value = '';
    message.value = 'パスワードの更新に成功しました。';

  } catch (error) {
    console.error(error);
    errorMessage.value = 'パスワードの変更に失敗しました。';
  }
});
</script>
