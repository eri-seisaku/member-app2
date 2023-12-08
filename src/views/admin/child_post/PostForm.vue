<template>
  <v-row>
    <v-col cols="12">
      <RequiredLabel label="タイトル" />
      <TextField
        :field="zipCode"
        hint="ハイフンなし数字のみ"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
// components
import TextField from '@/components/inputs/TextField.vue';
import RequiredLabel from '@/components/inputs/helpers/RequiredLabel.vue';
import OptionalLabel from '@/components/inputs/helpers/OptionalLabel.vue';

// validation
import { useField } from 'vee-validate';

const userType = useField('userType'); // 種別
const password = useField('password');
const checkbox = useField('checkbox');
const zipCode = useField('zipCode');
const state = useField('state');

// 入力された日付に/を入れる
const formatDate = (value, dateField) => {
  if (value && value.length === 8) {
    const formattedDate = formatDateWithSlash(value);
    dateField.field.value.value = formattedDate;
  }
};

// 郵便番号から住所検索
const searchAddress = async () => {
  try {
    const res = await fetchAddress(zipCode.value.value);

    if (res === 200) {
      message.value = '郵便番号が見つかりませんでした。';
    } else if (typeof res === 'object') {
      state.value.value = res.data.pref;
      addressFields[0].field.value.value = res.data.address;
    }
  } catch (error) {
    console.error('郵便番号検索エラー:', error);
    message.value = '郵便番号検索中にエラーが発生しました';
  }
};

</script>
<style>

</style>
