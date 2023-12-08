<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-sheet class="pa-6 mx-2" rounded align="center">
        <v-row class="border">
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
  </v-row>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const imageDialog = ref(false);

const user = ref({});
const imageSrc = ref('');

const message = ref('');
const errorMessage = ref('');

// components
import ImageDialog from '@/components/notuse/ImageDialog.vue';
import Avatar from '@/components/Avatar.vue';

// firebase
import { getCurrentUser } from '@/firebase/v1/auth';
import { getOneLevelData } from '@/firebase/v1/firestore';

onMounted(async () => {
  try {
    user.value = await getCurrentUser();
    const userDoc = await getOneLevelData(user.value.uid, "members");
    imageSrc.value = userDoc.profileIcon;

  } catch (error) {
    errorMessage.value = error;
    console.error('ユーザーデータ取得エラー', error);
  }
});

const handleChangeProfileIcon = async (filePath) => {
  // console.log(filePath);
  imageSrc.value = filePath;
}
</script>

