<template>
  <v-container class="fill-height" fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <v-sheet class="pa-6" rounded>
          <form @submit.prevent="submit">
            <!-- title -->
            <v-text-field
              v-model="title"
              label="TITLE"
              required
              variant="outlined"
            ></v-text-field>
            <!-- web site -->
            <v-text-field
              v-model="website"
              label="WEB SITE"
              variant="outlined"
            ></v-text-field>
            <!-- FILE -->
            <v-file-input
              label="FILE"
              variant="outlined"
              @change="uploadFile"
             ></v-file-input>
            <!-- comment -->
            <v-textarea
              v-model="comment"
              label="COMMENT"
              variant="outlined"
              ></v-textarea>
              <v-btn
                type="submit"
                variant="outlined"
              >
                SUBMIT
              </v-btn>
              <p>{{ message }}</p>
              <p>{{ errorMessage }}</p>
          </form>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from "vue";
// 初期値
const title = ref('');
const website = ref('');
const fileData = ref('');
const comment = ref('');

const message = ref('');
const errorMessage = ref('');

const user = ref('');

const uploadFile = (e) => {
  fileData.value = e.target.files[0]
};

// firebase
import { upload } from '@/firebase/v1/storage';
import { getCurrentUser } from '@/firebase/v1/auth';
import { addOneLevelData, addTwoLevelData } from '@/firebase/v1/firestore';

// 取得
onMounted(async () => {
  try {
    user.value = await getCurrentUser();
  } catch (error) {
    console.error('データ取得エラー', error);
    errorMessage.value = error;
  }
});

const submit = async () => {
  if (!title.value || !website.value || !comment.value) {
    alert ('すべて入力してください。')
    return
  }
  try {
    // storageに保存
    const url = await upload("portfolio", fileData.value, user.value.uid);

    // firestoreに保存
    const postData = {
      title: title.value,
      website: website.value,
      comment: comment.value,
      filePath: url,
      date: new Date(),
    }

    const secondDocID = await addTwoLevelData(user.value.uid, postData, "portfolios", "portfolio");

    const log = {
      date: new Date(),
      log: 'ポートフォリオが申請されました。',
      memberID: user.value.uid,
      portfolioID: secondDocID
    }

    await addOneLevelData("logs", log);

    message.value = 'ポートフォリオの申請に成功しました。';

  } catch (error) {
    console.error(error);
    errorMessage.value = 'ポートフォリオの申請に失敗しました。';
  }
};


</script>
