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
            <div v-for="fieldInfo in fields" :key="fieldInfo.key" class="mb-2">
              <label class="text-subtitle-1 text-medium-emphasis">
                {{ fieldInfo.label }}
              </label>
              <v-text-field
                v-model="fieldInfo.field.value.value"
                :error-messages="fieldInfo.field.errorMessage.value"
                density="compact"
                variant="outlined"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                @click:append-inner="visible = !visible"
                persistent-hint
                :hint="fieldInfo.hint"
              ></v-text-field>
              <template v-if="fieldInfo.key === 'newPassword'">
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
              </template>
            </div>
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
import { ref, watch } from 'vue';
const dialog = ref(false);
const visible = ref(false);
const changePasswordMode = ref(true);

const message = ref('');
const errorMessage = ref('');

// components
import Dialog from '@/components/Dialog.vue';
import Alert from '@/components/Alert.vue';


// utils
import { updateChips } from '@/utils/formHelper'; // password入力ヘルパー

// validation
import { useField, useForm } from 'vee-validate';
import { passwordSchema } from '@/validate/validate';

const { handleSubmit } = useForm({
  validationSchema: passwordSchema,
});

const fields = [
  { key: 'currentPassword', field: useField('currentPassword'), label: '現在のパスワード', hint: '' },
  { key: 'newPassword', field: useField('newPassword'), label: '新しいパスワード', hint: '大文字、小文字、数字、特殊文字(@、$、!、%、*、?、&)の8文字以上' },
  { key: 'confirmPassword', field: useField('confirmPassword'), label: '新しいパスワード(確認用)', hint: '' },
];

const chips = [
  { key: 'uppercase', text: '大文字', value: ref(false)},
  { key: 'lowercase', text: '小文字', value: ref(false)},
  { key: 'specialSymbols', text: '特殊記号', value: ref(false)},
  { key: 'count', text: '8文字以上', value: ref(false)},
];


// firebase
import { updatePasswordByAuth } from '@/firebase/v1/auth';

const submit = handleSubmit(async (values) => {
  try {
    // 新しいパスワードが確認用と一致するか確認
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


// chipの色を変更
const updateChips = (newVal) => {
  const uppercaseArr = chips.find(chip => chip.key === 'uppercase');
  const lowercaseArr = chips.find(chip => chip.key === 'lowercase');
  const specialSymbolsArr = chips.find(chip => chip.key === 'specialSymbols');
  const countArr = chips.find(chip => chip.key === 'count');
  uppercaseArr.value.value = /[A-Z]/.test(newVal);
  lowercaseArr.value.value = /[a-z]/.test(newVal);
  specialSymbolsArr.value.value = /[@$!%*?&]/.test(newVal);
  countArr.value.value = /^.{8,64}$/.test(newVal);
};

// watchで入力の状態を監視
fields.forEach(fieldInfo => {
  watch(() => fieldInfo.field.value.value, (newVal) => {
    updateChips(newVal);
  });
});

</script>
