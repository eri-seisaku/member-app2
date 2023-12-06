<template>
  <v-sheet border color="grey-lighten-5" rounded class="pa-4">
    <form @submit.prevent="submit">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="formData.keyword"
            append-inner-icon="mdi-magnify"
            variant="outlined"
            single-line
            hide-details
            class="my-4"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="5" align-self="center" class="mb-3">
          <label class="text-subtitle-1 text-medium-emphasis">
            都道府県
          </label>
        </v-col>
        <v-col cols="12" md="7">
          <v-select
            v-model="formData.state"
            :items="states"
            variant="outlined"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="5" align-self="center" class="mb-3">
          <label class="text-subtitle-1 text-medium-emphasis">
            専門デザイン分野
          </label>
        </v-col>
        <v-col cols="12" md="7">
          <v-select
            v-model="formData.specialty"
            :items="specialties"
            variant="outlined"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" md="6">
          <v-btn variant="outlined" block @click="reset">
            リセット
          </v-btn>
        </v-col>
        <v-col cols="6" md="6">
          <v-btn color="primary" block type="submit">
            この条件で検索
          </v-btn>
        </v-col>
      </v-row>
    </form>
  </v-sheet>
</template>
<script setup>
import { ref } from 'vue';

const formData = ref({
    keyword: '',
    state: '',
    specialty: '',
});
// console.log(formData.value.keyword);

// utils
import { specialties } from '@/utils/category'; // 専門カテゴリ
import { states } from '@/utils/states'; // 都道府県

// 子から親へ
const emit = defineEmits([
  'searched',
  'reset'
]);

const reset = () => {
  formData.value.keyword = '';
  formData.value.state = '';
  formData.value.specialty = '';
  emit('reset'); // 追加
}

const submit = () => {
  // console.log(formData.value);
  emit('searched', formData.value);
}
</script>
