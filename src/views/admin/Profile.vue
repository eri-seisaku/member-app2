<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="errorMessage">
        <Alert
          color="red"
          :text="errorMessage"
        />
      </v-col>
      <v-col cols="12">
        <v-tabs
          v-model="tab"
          show-arrows
        >
          <v-tab
            value="info"
            class="custom-tab"
            hide-slider
            selected-class="bg-white"
          >登録情報</v-tab>

          <v-tab
            value="resume"
            class="custom-tab"
            hide-slider
            selected-class="bg-white"
          >職務経歴</v-tab>

          <v-tab
            value="account"
            class="custom-tab"
            hide-slider
            selected-class="bg-white"
          >アカウント</v-tab>

        </v-tabs>

        <v-card-text class="bg-white custom-radius">
          <v-window v-model="tab">
            <v-window-item value="info">
              <ProfileInfo
                v-if="isReady"
                :authUID="user.uid"
                :dbData="userDoc"
              />
            </v-window-item>

            <v-window-item value="resume">
              <Resume
                v-if="isReady"
                :authUID="user.uid"
                :dbData="userDoc"
              />
            </v-window-item>

            <v-window-item value="account">
              <Account
                v-if="isReady"
                :authData="user"
              />
            </v-window-item>

          </v-window>
        </v-card-text>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const tab = ref(null);
const user = ref({});
const userDoc= ref({});
const errorMessage = ref('');
const isReady = ref(false);

// components
import Alert from '@/components/Alert.vue';
import ProfileInfo from '@/views/admin/child_profile/ProfileInfo.vue';
import Resume from '@/views/admin/child_profile/Resume.vue';
import Account from '@/views/admin/child_profile/Account.vue';

// firebase
import { getCurrentUser } from '@/firebase/v1/auth';
import { getOneLevelData } from '@/firebase/v1/firestore';

onMounted(async () => {
  try {
    user.value = await getCurrentUser();

    userDoc.value = await getOneLevelData(user.value.uid, "members");

    isReady.value = true;

  } catch (error) {
    errorMessage.value = error;
    console.error('ユーザー情報を取得出来ませんでした', error);
  }
});

</script>
<style>
.custom-tab {
  border-radius: 5px 5px 0 0!important;
  border-top: 1px solid #000;
  border-left: 1px solid #000;
  border-right: 1px solid #000;
}
.custom-radius {
  border-radius: 0 5px 5px 5px!important;
}
</style>
