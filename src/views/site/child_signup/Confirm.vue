<template>
  <div>
    <v-row>
      <v-col cols="12">
        <p class="mt-8 mb-8">問題がなければ送信を押してください。内容を変更したい場合は戻るを押してください。</p>
      </v-col>
    </v-row>
    <v-row
      class="confirm"
      v-for="(item, key) in transformedData"
      :key="key"
    >
      <v-col cols="12" md="3">
        <div>{{ key }}</div>
      </v-col>
      <v-col cols="12" md="9">
        <div class="d-inline">
          {{ item }}
          <template v-if="key === '資本金'">
            <span>万円</span>
          </template>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" class="d-flex justify-space-evenly">
        <v-btn
          @click="back"
          variant="outlined"
          size="large"
          min-width="100"
        >
          戻る
        </v-btn>
        <v-btn
          @click="submit"
          color="primary"
          variant="flat"
          size="large"
          min-width="100"
        >
          送信
        </v-btn>
      </v-col>
      </v-row>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: Object,
});

const transformedData = computed(() => {
  const data = {};
  const transformed = {};

  // フィルタリング関数
  const filterEmptyValues = (value) => value !== undefined && value !== "";

  for (const key in props.value) {
    data[key] = filterEmptyValues(props.value[key]) ? props.value[key] : "";
  }

  // キー名を変更して新しいオブジェクトを生成
  transformed['種別'] = data['userType'];
  transformed['代表者名'] = data['name'];
  transformed['代表者名(フリガナ)'] = data['nameKana'];
  transformed['事務所名'] = data['officeName']; // 個人は任意
  transformed['事務所名(フリガナ)'] = data['officeNameKana']; // 個人は任意
  transformed['設立年月日'] = data['incorporationDate']; // 個人は任意
  transformed['資本金'] = data['capital']; // 個人は任意
  transformed['生年月日'] = data['birthday'];
  transformed['メールアドレス'] = data['email'];
  transformed['電話番号'] = data['phone'];
  transformed['携帯番号'] = data['mobile'];
  transformed['FAX番号'] = data['fax'];
  transformed['ホームページ'] = data['website'];
  transformed['パスワード'] = '**********';
  transformed['郵便番号'] = data['zipCode'];
  transformed['都道府県'] = data['state'];
  transformed['住所'] = data['addressLine1'];
  transformed['建物名'] = data['addressLine2'];
  transformed['業種'] = data['industry'];
  transformed['専門デザイン分野'] = data['specialty'];
  transformed['利用規約'] = data['checkbox'] === '1' ? '同意します' : '';

  // 不要なプロパティを除外
  const filteredTransformed = Object.fromEntries(
    Object.entries(transformed).filter(([_, value]) => filterEmptyValues(value))
  );

  return filteredTransformed;
});

// 子から親のイベントを発火
const emit = defineEmits([
  'submit',
  'back',
  'errorMessage'
]);

// 送信
const submit = () => {
  emit('submit');
}
// 戻る
const back = () => {
  emit('back');
}

</script>

<style>
.confirm {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.confirm:last-of-type {
  margin-bottom: 40px;
}
</style>
