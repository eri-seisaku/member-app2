<template>
  <download-csv :data="csvData">
    <v-btn variant="outlined">
      <v-icon start icon="mdi-file-export-outline"></v-icon>
      EXPORT
    </v-btn>
  </download-csv>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const csvData = ref([]);
const errorMessage = ref('');

// 子から親へ
const emit = defineEmits([
  'update:errorMessage' // エラーメッセージ
]);

// firebase
import { getOneLevelAllData } from '@/firebase/v1/firestore';

onMounted(async () => {
  try {
    const allDoc = await getOneLevelAllData("members");

    csvData.value = allDoc.map((doc) => ({
      role: doc.role,
      memberID: doc.memberID,
      zipCode: doc.zipCode,
      state: doc.state,
      addressLine1: doc.addressLine1,
      addressLine2: doc.addressLine2,
      eightArea: doc.eightArea,
      name: doc.name,
      nameKana: doc.nameKana,
      officeName: doc.officeName,
      officeNameKana: doc.officeNameKana,
      phone: doc.phone,
      email: doc.email,
      specialty: doc.specialty,
      joinDate: doc.joinDate,
    }));

  } catch (error) {
    errorMessage.value = error;
    emit('update:errorMessage', errorMessage.value); // 子から親へ
    console.error('ユーザーデータ取得エラー', error);
  }
});

</script>
