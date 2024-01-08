<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5">加入資格の確認について</h2>
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
          variant="flat"
          size="large"
          color="primary"
          @click="redirectToSignup"
          :disabled="!isAllChecked"
        >
          登録フォームへ
          <template v-slot:append>
            <v-icon color="white">mdi-chevron-right</v-icon>
          </template>
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
  { label: '加入前の確認事項01を満たしている', value: false },
  { label: '加入前の確認事項02を満たしている', value: false },
  { label: '加入前の確認事項03を満たしている', value: false },
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
