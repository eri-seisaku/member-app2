<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-img
          class="mx-auto my-6"
          max-width="228"
          src="@/assets/logo-vuetify.svg"
        ></v-img>
        <Alert
          color="primary"
          :text="sendMailMode ? 'メールアドレスを入力してください。パスワードのリセット手順が記されたメールが送信されます。' : 'メールの確認リンクをクリックし、ログインページを訪問してください。'"
        />
        <Alert
          v-if="errorMessage"
          color="red"
          :text="errorMessage"
        />
        <Card max-width="448" v-if="sendMailMode">
          <template v-slot:content>
            <form @submit.prevent="submit">
              <label class="text-subtitle-1 text-medium-emphasis">メールアドレス</label>

              <v-text-field
                required
                type="email"
                density="compact"
                variant="outlined"
                v-model="email"
              ></v-text-field>

              <v-btn
                block
                size="large"
                color="primary"
                type="submit"
              >
                メールを送信
              </v-btn>
            </form>
          </template>
        </Card>
        <a
          class="text-blue text-decoration-none d-flex justify-center ma-4"
          href="/login"
          rel="noopener noreferrer"
        >
          ログインへ <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
const email = ref('');
const errorMessage = ref('');
const sendMailMode = ref(true);

// components
import Card from '@/components/cards/Card.vue';
import Alert from '@/components/Alert.vue';

// firebase
import { reissuePassword } from '@/firebase/v1/auth';

// ログイン処理
const submit = async () => {
  try {
    await reissuePassword(email.value);
    // フォームを非表示
    sendMailMode.value = false;
    errorMessage.value = '';

  } catch (error) {
    errorMessage.value = error.message;
  }
};

</script>
