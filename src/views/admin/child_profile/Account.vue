<template>
  <v-row>
    <v-col cols="12" class="pa-4">
      <v-row no-gutters>
        <v-col cols="10" md="6">
          <NormalLabel label="ユーザID" />
          <v-text-field
            :model-value="props.authData.uid"
            disabled
            density="compact"
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="10" md="6">
          <NormalLabel label="メールアドレス" />
          <v-text-field
            :model-value="props.authData.email"
            disabled
            density="compact"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="2" align-self="center">
          <v-btn
            variant="text"
            @click="mailDialog = true"
          ><v-icon> mdi-pencil </v-icon>編集</v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="10" md="6">
          <NormalLabel label="パスワード" />
          <v-text-field
            model-value="********"
            disabled
            density="compact"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="2" align-self="center">
          <v-btn
            variant="text"
            @click="passwordDialog = true"
          ><v-icon> mdi-pencil </v-icon>編集</v-btn>
        </v-col>
      </v-row>
      <!-- 制作中 -->
      <v-row no-gutters>
        <v-col cols="12" md="6">
          <v-btn
            variant="outlined"
            @click="deleteDialog = true"
          >退会する</v-btn>
        </v-col>
      </v-row>
      <!-- /制作中 -->
      <PasswordDialog
        v-model:dialog="passwordDialog"
      />
      <MailDialog
        v-model:dialog="mailDialog"
        :authData="props.authData"
      />
      <DeleteDialog
        v-model:dialog="deleteDialog"
        :authData="props.authData"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
const passwordDialog = ref(false);
const mailDialog = ref(false);
const deleteDialog = ref(false);

const props = defineProps({
  authData: Object,
});

// components
import NormalLabel from '@/components/inputs/helpers/NormalLabel.vue';
import PasswordDialog from '@/views/admin/child_profile/PasswordDialog.vue';
import MailDialog from '@/views/admin/child_profile/MailDialog.vue';
import DeleteDialog from '@/views/admin/child_profile/DeleteDialog.vue';

</script>

