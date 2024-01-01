<template>
  <v-container class="fill-height">
    <v-row class="d-flex align-center justify-center">
      <v-col cols="12">
        <form @submit.prevent="submit">
          <v-text-field
            v-model="name"
            label="name"
          ></v-text-field>
          <v-text-field
            v-model="email"
            label="email"
          ></v-text-field>
          <v-text-field
            v-model="content"
            label="content"
          ></v-text-field>
          <v-btn
            type="submit"
          >
            送信
          </v-btn>
        </form>
        <p class="my-4">{{ message }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
const name = ref('');
const email = ref('');
const content = ref('');
const message = ref('');

const resetForm = () => {
  name.value = "";
  email.value = "";
  content.value = "";
}

import { sendMail } from "@/firebase/firebase";
import { setOneLevelSingleData } from '@/firebase/v1/firestore';

const submit = async () => {
  if (!name.value && !email.value && !content.value) {
    message.value = '入力してください';
    return;
  }
  try {
    const sendData = {
      name: name.value,
      email: email.value,
      content: content.value
    };

    console.log(sendData);

    await setOneLevelSingleData('id', "members", sendData);
    await sendMail(sendData);

    message.value = '送信が完了しました';
    resetForm();

  } catch (error) {
    console.log('送信失敗しました', error)
    message.value = '送信失敗しました', error;
  }
}
</script>
