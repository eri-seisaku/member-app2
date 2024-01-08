<template>
  <v-row class="justify-center">
    <v-col cols="12">
      <h2 class="text-h5">加入のお申し込みについて</h2>
    </v-col>
  </v-row>
  <v-row class="custom-color justify-center">
    <!-- align-self="center"をつけると高さがそろわない -->
    <!-- <v-col cols="12" md="3" align-self="center"> -->
    <v-col cols="12" md="3">
      <RequiredLabel label="種別" />
    </v-col>
    <v-col cols="12" md="8">
      <v-radio-group
        v-model="userType.value.value"
        :error-messages="userType.errorMessage.value"
        inline
      >
        <v-radio label="個人" value="個人"></v-radio>
        <v-radio label="法人" value="法人"></v-radio>
      </v-radio-group>
    </v-col>
  </v-row>
  <!-- textFields -->
  <v-row v-for="fieldInfo in textFields" :key="fieldInfo.key" class="custom-color justify-center">
    <v-col cols="12" md="3" v-if="fieldInfo.type !== 'optional'">
      <RequiredLabel :label="fieldInfo.label" />
    </v-col>
    <v-col cols="12" md="3" v-else>
      <OptionalLabel :label="fieldInfo.label" />
    </v-col>
    <v-col cols="12" md="8" class="d-flex align-center">
      <TextField
        :field="fieldInfo.field"
        :hint="fieldInfo.hint"
        :placeholder="fieldInfo.placeholder"
      />
      <template v-if="fieldInfo.key === 'capital'">
        <p class="mb-5 px-4">万円</p>
      </template>
    </v-col>
  </v-row>
  <!-- /textFields -->
  <!-- dateFields -->
  <v-row v-for="fieldInfo in dateFields" :key="fieldInfo.key" class="custom-color justify-center">
    <v-col cols="12" md="3">
      <RequiredLabel :label="fieldInfo.label" />
    </v-col>
    <v-col cols="12" md="8" class="d-flex align-center">
      <TextField
        :field="fieldInfo.field"
        :hint="fieldInfo.hint"
        :placeholder="fieldInfo.placeholder"
        @blur="formatDate(fieldInfo.field.value.value, fieldInfo)"
      />
    </v-col>
  </v-row>
  <!-- /dateFields -->
  <!-- password -->
  <v-row class="custom-color justify-center">
    <v-col cols="12" md="3">
      <RequiredLabel label="パスワード" />
    </v-col>
    <v-col cols="12" md="8">
      <PasswordFieldWithChip :field="password" />
    </v-col>
  </v-row>
  <!-- /password -->
  <!-- address -->
  <v-row class="custom-color justify-center">
    <v-col cols="12" md="3">
      <RequiredLabel label="郵便番号" />
    </v-col>
    <v-col cols="12" md="8" class="d-flex">
      <TextField
        :field="zipCode"
        hint="ハイフンなし数字のみ"
      />
      <v-btn
        variant="outlined"
        class="ml-6"
        min-height="40"
        :disabled="!!zipCode.errorMessage.value || !zipCode.value.value"
        @click="searchAddress"
      >
        住所検索
      </v-btn>
    </v-col>
    <v-col v-if="message" class="mt-3">
      <p class="text-red-lighten-1 text-subtitle-2">{{ message }}</p>
    </v-col>
  </v-row>
  <v-row class="custom-color justify-center">
    <v-col cols="12" md="3">
      <RequiredLabel label="都道府県" />
    </v-col>
    <v-col cols="12" md="8">
      <Select
        :field="state"
        :items="states"
      />
    </v-col>
  </v-row>
  <v-row v-for="fieldInfo in addressFields" :key="fieldInfo.key" class="custom-color justify-center">
    <v-col cols="12" md="3" v-if="fieldInfo.type !== 'optional'">
      <RequiredLabel :label="fieldInfo.label" />
    </v-col>
    <v-col cols="12" md="3" v-else>
      <OptionalLabel :label="fieldInfo.label" />
    </v-col>
    <v-col cols="12" md="8">
      <TextField
        :field="fieldInfo.field"
        :hint="fieldInfo.hint"
        :placeholder="fieldInfo.placeholder"
      />
    </v-col>
  </v-row>
  <!-- /address -->
  <!-- category -->
  <v-row v-for="fieldInfo in categoryFields" :key="fieldInfo.key" class="custom-color justify-center">
    <v-col cols="12" md="3">
      <RequiredLabel :label="fieldInfo.label" />
    </v-col>
    <v-col cols="12" md="8">
      <Select
        :field="fieldInfo.field"
        :items="fieldInfo.items"
      />
    </v-col>
  </v-row>
  <!-- /category -->
  <!-- checkbox -->
  <v-row class="custom-color justify-center">
    <v-col cols="12" md="3">
      <RequiredLabel label="利用規約" />
    </v-col>
    <v-col cols="12" md="8">
      <CheckBox
        :field="checkbox"
        value="1"
        label="利用規約に同意します"
      />
    </v-col>
  </v-row>
  <!-- /checkbox -->
</template>

<script setup>
import { ref } from 'vue';
const message = ref(''); // 郵便番号検索時のメッセージ

// components
import TextField from '@/components/inputs/TextField.vue';
import Select from '@/components/inputs/Select.vue';
import PasswordFieldWithChip from '@/components/inputs/PasswordFieldWithChip.vue';
import CheckBox from '@/components/inputs/CheckBox.vue';
import RequiredLabel from '@/components/inputs/helpers/RequiredLabel.vue';
import OptionalLabel from '@/components/inputs/helpers/OptionalLabel.vue';

// utils
import { states } from '@/utils/states'; // 都道府県,八区分
import { fetchAddress } from '@/utils/address'; // 住所取得
import { formatDateWithSlash } from '@/utils/formatData'; // 年月日を変換

// validation
import { useField } from 'vee-validate';
import {
  textInputItems,
  dateInputItems,
  addressInputItems,
  categoryInputItems
} from '@/validate/field';

const textFields = textInputItems.map(fieldInfo => {
  return { ...fieldInfo, field: useField(fieldInfo.key) };
});
const dateFields = dateInputItems.map(fieldInfo => {
  return { ...fieldInfo, field: useField(fieldInfo.key) };
});
const addressFields = addressInputItems.map(fieldInfo => {
  return { ...fieldInfo, field: useField(fieldInfo.key) };
});
const categoryFields = categoryInputItems.map(fieldInfo => {
  return { ...fieldInfo, field: useField(fieldInfo.key) };
});
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
.custom-color > div {
  border: 2px solid white;
}
/* 1番目の子要素の色 */
.custom-color > div:first-child {
  background-color: #E0E0E0;
}

/* 2番目の子要素の色 */
.custom-color > div:nth-child(2) {
  background-color: #F5F5F5;
}
</style>
