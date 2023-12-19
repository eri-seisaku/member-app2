<template>
  <v-row class="pa-12">
    <v-col cols="12">
      <v-sheet class="pa-6" rounded>
        <form @submit.prevent="submit">
          <v-row>
            <v-col cols="12" md="6">
              <div class="box27">
                  <span class="box-title">コンテンツ①</span>
                  <DropFileInput
                  >
                  </DropFileInput>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-row no-gutters>
                <v-col cols="12">
                  <NormalLabel label="タイトル" />
                  <TextField
                    :field="title"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="詳細URL" />
                  <TextField
                    :field="portfolioURL"
                    placeholder="https://sample.com"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="分野" />
                  <TextArea
                    :field="field"
                    hint="最大50文字まで"
                    :rows="2"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="コメント" />
                  <TextArea
                    :field="comment"
                    hint="最大200文字まで"
                    :rows="4"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-divider
            :thickness="2"
            class="border-opacity-100 my-12"
            color="member"
          ></v-divider>

          <v-row>
            <v-col cols="12" md="6">
              <div class="box27">
                  <span class="box-title">コンテンツ②</span>
                  <DropFileInput
                  >
                  </DropFileInput>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-row no-gutters>
                <v-col cols="12">
                  <NormalLabel label="タイトル" />
                  <TextField
                    :field="title"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="詳細URL" />
                  <TextField
                    :field="portfolioURL"
                    placeholder="https://sample.com"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="分野" />
                  <TextArea
                    :field="field"
                    hint="最大50文字まで"
                    :rows="2"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="コメント" />
                  <TextArea
                    :field="comment"
                    hint="最大200文字まで"
                    :rows="4"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-divider
            :thickness="2"
            class="border-opacity-100 my-12"
            color="member"
          ></v-divider>

          <v-row>
            <v-col cols="12" md="6">
              <div class="box27">
                  <span class="box-title">コンテンツ③</span>
                  <DropFileInput
                  >
                  </DropFileInput>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-row no-gutters>
                <v-col cols="12">
                  <NormalLabel label="タイトル" />
                  <TextField
                    :field="title"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="詳細URL" />
                  <TextField
                    :field="portfolioURL"
                    placeholder="https://sample.com"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="分野" />
                  <TextArea
                    :field="field"
                    hint="最大50文字まで"
                    :rows="2"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="コメント" />
                  <TextArea
                    :field="comment"
                    hint="最大200文字まで"
                    :rows="4"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-divider
            :thickness="2"
            class="border-opacity-100 my-12"
            color="member"
          ></v-divider>

          <v-row>
            <v-col cols="12" md="6">
              <div class="box27">
                  <span class="box-title">コンテンツ④</span>
                  <DropFileInput
                  >
                  </DropFileInput>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-row no-gutters>
                <v-col cols="12">
                  <NormalLabel label="タイトル" />
                  <TextField
                    :field="title"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="詳細URL" />
                  <TextField
                    :field="portfolioURL"
                    placeholder="https://sample.com"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="分野" />
                  <TextArea
                    :field="field"
                    hint="最大50文字まで"
                    :rows="2"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="コメント" />
                  <TextArea
                    :field="comment"
                    hint="最大200文字まで"
                    :rows="4"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-divider
            :thickness="2"
            class="border-opacity-100 my-12"
            color="member"
          ></v-divider>

          <v-row>
            <v-col cols="12" md="6">
              <div class="box27">
                  <span class="box-title">コンテンツ⑤</span>
                  <DropFileInput
                  >
                  </DropFileInput>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-row no-gutters>
                <v-col cols="12">
                  <NormalLabel label="タイトル" />
                  <TextField
                    :field="title"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="詳細URL" />
                  <TextField
                    :field="portfolioURL"
                    placeholder="https://sample.com"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="分野" />
                  <TextArea
                    :field="field"
                    hint="最大50文字まで"
                    :rows="2"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="コメント" />
                  <TextArea
                    :field="comment"
                    hint="最大200文字まで"
                    :rows="4"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-divider
            :thickness="2"
            class="border-opacity-100 my-12"
            color="member"
          ></v-divider>

          <v-row>
            <v-col cols="12" md="6">
              <div class="box27">
                  <span class="box-title">コンテンツ⑥</span>
                  <DropFileInput
                  >
                  </DropFileInput>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-row no-gutters>
                <v-col cols="12">
                  <NormalLabel label="タイトル" />
                  <TextField
                    :field="title"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="詳細URL" />
                  <TextField
                    :field="portfolioURL"
                    placeholder="https://sample.com"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="分野" />
                  <TextArea
                    :field="field"
                    hint="最大50文字まで"
                    :rows="2"
                  />
                </v-col>
                <v-col cols="12">
                  <NormalLabel label="コメント" />
                  <TextArea
                    :field="comment"
                    hint="最大200文字まで"
                    :rows="4"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </form>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, watch } from "vue";

// components
import NormalLabel from '@/components/inputs/helpers/NormalLabel.vue';
import TextField from '@/components/inputs/TextField.vue';
import TextArea from '@/components/inputs/TextArea.vue';
import DropFileInput from '@/components/inputs/DropFileInput.vue';

// validation
import { useField, useForm } from 'vee-validate';
import { portfolioSchema } from '@/validate/validate';

const { handleSubmit } = useForm({
  validationSchema: portfolioSchema,
});

const title = useField('title')
const comment = useField('comment')
const field = useField('field')
const portfolioImage = useField('portfolioImage')
const portfolioURL = useField('portfolioURL')


</script>
<style>
.box27 {
  position: relative;
  margin: 2em 0;
  padding: 0.5em 1em;
  border: solid 3px #600f18;
  border-radius: 0 5px 5px 5px;
}
.box27 .box-title {
  position: absolute;
  display: inline-block;
  top: -27px;
  left: -3px;
  padding: 0 9px;
  height: 25px;
  line-height: 25px;
  font-size: 17px;
  background: #600f18;
  color: #ffffff;
  font-weight: bold;
  border-radius: 5px 5px 0 0;
}
.box27 p {
  margin: 0;
  padding: 0;
}
</style>
