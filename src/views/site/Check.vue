<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5">CHECK</h2>
        <p class="mt-8">
          加入申請をされる前に、以下の加入資格を全て満たしているか、必ずご確認下さい。<br>
          下記の3項目の全てにチェックをつけられた方のみ、加入申請が出来ます。
        </p>
        <v-checkbox
          v-for="(item, index) in checkboxItems" :key="index"
          v-model="item.value"
          :label="item.label"
        ></v-checkbox>
        <v-btn
          type="submit"
          variant="outlined"
          @click="redirectToSignup"
          :disabled="!isAllChecked"
        >
          登録フォームへ
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';

// router
import { useRouter } from 'vue-router';
const router = useRouter();

const checkboxItems = ref([
  { label: '税務署に確定申告書を提出している', value: false },
  { label: '確定申告書の職業欄に当協会に加入出来る職業名が記載されている', value: false },
  { label: '業務として制作された作品のプリントコピーを添付出来る', value: false },
]);

const isAllChecked = computed(() => {
  return checkboxItems.value.every(item => item.value); // 全てチェックされたか
});

const redirectToSignup = () => {
  if (isAllChecked.value) {
    router.push({ name: 'SignUp' }); // 保守性がある書き方
    // router.push('/signup'); // 理解しやすい書き方
  }
};

</script>
