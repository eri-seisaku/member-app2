<template>
  <v-row class="pa-12">
    <v-col cols="12" sm="8">
      <form @submit.prevent="submit" id="postForm">
        <div class="custom-form-box pa-4" v-for="(item, index) in formItems" :key="item.key">
          <h3 class="box-title text-subtitle-1">ポートフォリオ {{ index + 1 }}</h3>
          <v-row>
            <v-col cols="12">
              <NormalLabel label="画像" />
              <!-- <DropFileInput
                :schema="portfolioSchemaV2.fields[`portfolioImage${index + 1}`]"
                v-model:error="item.portfolioImage.errorMessage.value"
                @update:fileData="handleFileData"
                @update:deleteFileData="handleDeleteFileData"
              /> -->
              <DropFileInput
                :schema="portfolioSchemaV2.fields[`portfolioImage${index + 1}`]"
                v-model:error="item.portfolioImage.errorMessage.value"
                @update:fileData="file => handleFileData(file, item.portfolioImage)"
                @update:deleteFileData="() => handleDeleteFileData(item.portfolioImage)"
              />

              <NormalLabel label="タイトル" />
              <TextField
                :field="item.title"
              />
              <NormalLabel label="詳細URL" />
              <TextField
                :field="item.portfolioURL"
                placeholder="https://sample.com"
              />
              <NormalLabel label="分野" />
              <TextArea
                :field="item.genre"
                hint="最大100文字まで"
                :rows="2"
              />
              <NormalLabel label="コメント" />
              <TextArea
                :field="item.comment"
                hint="最大500文字まで"
                :rows="4"
              />
              <v-checkbox
                v-model="item.state.value.value"
                :true-value="'request'"
                :false-value="'save'"
                label="このポートフォリオを申請する"
                persistent-hint
                hint="申請する場合は全ての項目が入力必須です"
              ></v-checkbox>
            </v-col>
          </v-row>
        </div>
      </form>
    </v-col>
    <v-col cols="12" sm="4" class="d-none d-sm-block">
      <div class="sticky">
        <v-sheet class="pa-2 pa-sm-3 pa-md-6" rounded>
          <div class="d-flex justify-end mt-6">
            <v-btn
              variant="flat"
              color="member"
              type="submit"
              form="postForm"
            >
              保存
            </v-btn>
          </div>
        </v-sheet>
      </div>
    </v-col>
  </v-row>
  <div class="d-flex d-sm-none custom-bottom-content">
    <v-btn
      variant="flat"
      color="member"
      type="submit"
      form="postForm"
      min-width="150"
    >
      保存
    </v-btn>
  </div>
</template>

<script setup>

// components
import NormalLabel from '@/components/inputs/helpers/NormalLabel.vue';
import TextField from '@/components/inputs/TextField.vue';
import TextArea from '@/components/inputs/TextArea.vue';
import DropFileInput from '@/components/inputs/DropFileInput.vue';

// validation
import { useField, useForm } from 'vee-validate';
import { portfolioSchemaV2 } from '@/validate/validate';

const { handleSubmit } = useForm({
  validationSchema: portfolioSchemaV2,
});

// useFieldと紐づけ
const formItems = [];
const fields = ['state', 'title', 'comment', 'state', 'genre', 'portfolioImage', 'portfolioURL'];

for (let i = 1; i <= 5; i++) {
  const item = {};
  for (let field of fields) {
    const key = field + i;
    item[field] = useField(key);
  }
  formItems.push(item);
}

// 画像処理
const handleFileData = (file, field) => {
  console.log(file)
  if (file) {
    field.value.value = file;
  } else {
    field.errorMessage.value = "アップロードするファイルがありません。";
  }
}
const handleDeleteFileData = (field) => {
  field.value.value = [];
}

// 送信処理
const submit = handleSubmit(async (values) => {
  console.log(values);
});

</script>
<style>
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 64px;
}
.custom-bottom-content {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  height: 56px;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -4px 6px -6px #999;
  z-index: 1005; /* footerより重ね順を上に */
}
.custom-form-box {
  position: relative;
  margin: 2em 0;
  padding: 0.5em 1em;
  background: #fff;
  border-radius: 0 5px 5px 5px;
  margin: 0 0 96px 0;
}
.custom-form-box .box-title {
  position: absolute;
  display: inline-block;
  top: -48px;
  left: 0px;
  padding: 0 16px;
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  background: #fff;
  border-radius: 5px 5px 0 0;
}
</style>

