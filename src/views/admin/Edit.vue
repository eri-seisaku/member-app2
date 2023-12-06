<template>
  <v-container class="fill-height" fluid>
    <v-row no-gutters>
      <v-col cols="6">
        <v-sheet class="pa-6" rounded>

          <!-- 確認用 -->
          <!-- <p>{{ $route.params.portfolioID }}</p>
          <pre>{{ portfolioData }}</pre> -->
          <p>まだ保存はできません制作中です。</p>
          <form @submit.prevent="submit">
            <v-text-field
              v-model="portfolioData.title"
              label="TITLE"
              required
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-model="portfolioData.website"
              label="WEB SITE"
              variant="outlined"
            ></v-text-field>
            <!-- 悩み中 -->
            <v-textarea
              v-model="portfolioData.comment"
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
import { ref, onMounted } from 'vue';
const user = ref({});
const portfolioData = ref({});

const message = ref('');
const errorMessage = ref('');


// route
import { useRoute } from 'vue-router';
const route = useRoute();

// console.log(route.params.portfolioID); // routerで渡されたID確認用

// firebase
import { getCurrentUser } from '@/firebase/v1/auth';
import { getTwoLevelData } from '@/firebase/v1/firestore';

// utils
import { formatDateForTimestamp } from '@/utils/formatData';

onMounted(async () => {
  try {
    user.value = await getCurrentUser(); // user情報

    const profileDoc = await getTwoLevelData(user.value.uid, route.params.portfolioID, "portfolios", "portfolio");

    // const formattedDate = await formatDateForTimestamp(profileDoc.date); // 日付変換

    // console.log(profileDoc);
    portfolioData.value = profileDoc;


  } catch (error) {
    errorMessage.value = error;
    console.error('ユーザーデータ取得エラー', error);
  }
});

</script>
