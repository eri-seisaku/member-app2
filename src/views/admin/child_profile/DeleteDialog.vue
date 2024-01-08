<template>
  <Dialog v-model:dialog="dialog" :size="600">
    <template v-slot:content>
      <v-row no-gutters>
        <v-col cols="12">
          <v-stepper
            flat
            v-model="step"
            :items="stepItems"
            next-text="次へ"
            prev-text="戻る"
          >
            <template v-slot:item.1>
              <h4 class="mb-4">退会申請内容を入力し、注意事項をご確認ください</h4>
              <form @submit.prevent="submit">
                <v-row>
                  <v-col cols="12">
                    <RequiredLabel label="退会希望日" />
                  </v-col>
                  <v-col cols="12" sm="6" class="d-flex align-center">
                    <TextField :field="cancellationYear" />
                    <p class="mb-5 px-4">年</p>
                  </v-col>
                  <v-col cols="12" sm="6" class="d-flex align-center">
                    <Select
                      :field="cancellationMonth"
                      :items="selectMonth"
                    />
                    <p class="mb-5 px-4">月 末日</p>
                  </v-col>
                  <v-col cols="12">
                    <OptionalLabel label="退会理由" />
                    <div class="my-2">
                      <TextArea
                        :field="cancellationReason"
                        :rows="2"
                        placeholder="退会理由をお聞かせください"
                      />
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <h4 class="mb-4">退会時のご注意</h4>
                    <v-alert
                      type="info"
                      variant="outlined"
                    >
                      退会手続きをされますと全てのサービスがご利用できなくなります。
                    </v-alert>
                  </v-col>
                </v-row>
              </form>
            </template>

            <template v-slot:item.2>
              <h4 class="mb-8">内容をご確認の上、「退会申請」を押してください</h4>
              <v-row no-gutters class="custom-border">
                <v-col cols="12" md="3" class="pa-4 bg-blue-grey-lighten-5">
                  退会希望日
                </v-col>
                <v-col cols="12" md="9" class="pa-4">
                  {{ cancellationDate }}
                </v-col>
                <v-col cols="12" md="3" class="pa-4 bg-blue-grey-lighten-5">
                  退会理由
                </v-col>
                <v-col cols="12" md="9" class="pa-4">
                  {{ cancellationReason.value.value }}
                </v-col>

              </v-row>
            </template>

            <template v-slot:item.3>
              <p class="my-8">「退会申請受付のお知らせ」メールをお送りしましたので、ご確認ください。<br>
                なお、現時点では退会手続きは完了しておりません。<br>退会手続きが完了しましたら、別途「退会手続き完了のお知らせ」メールにてご連絡いたします</p>
                <div class="d-flex justify-center">
                  <v-btn
                    color="primary"
                    variant="flat"
                  >
                    会員サイトトップページへ
                  </v-btn>
                </div>
            </template>

            <template v-slot:next>
              <v-btn
                v-if="step !== 3"
                @click="submit"
                color="primary"
                variant="flat"
              >
                {{ step >= 2 ? '退会申請' : '確認画面へ' }}
              </v-btn>
            </template>

            <template v-slot:prev>
              <v-btn
                v-if="step !== 3"
                @click="prev"
                variant="text"
              >
                戻る
              </v-btn>
            </template>

          </v-stepper>
          <!-- / -->
          <Alert
            v-if="message"
            color="primary"
            :text="message"
          />
          <Alert
            v-if="errorMessage"
            color="red"
            :text="errorMessage"
          />
        </v-col>
      </v-row>
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue';
const dialog = ref(false);
const message = ref('');
const errorMessage = ref('');
const cancellationDate = ref('');
const selectMonth = Array.from({length: 12}, (_, i) => i + 1);
const step = ref(1);
const stepItems = ['入力', '確認', '完了'];

const prev = () => {
  step.value--;
}

// 親から子へ
const props = defineProps({
  authData: Object
});

// components
import TextField from '@/components/inputs/TextField.vue';
import Select from '@/components/inputs/Select.vue';
import TextArea from '@/components/inputs/TextArea.vue';
import Dialog from '@/components/Dialog.vue';
import Alert from '@/components/Alert.vue';
import RequiredLabel from '@/components/inputs/helpers/RequiredLabel.vue';
import OptionalLabel from '@/components/inputs/helpers/OptionalLabel.vue';

// validation
import { useField, useForm } from 'vee-validate';
import { deleteSchema } from '@/validate/validate';

const { handleSubmit } = useForm({
  validationSchema: deleteSchema,
});

const cancellationYear = useField('cancellationYear');
const cancellationMonth = useField('cancellationMonth');
const cancellationReason = useField('cancellationReason');

// utils
import { role } from '@/utils/category'; // 権限

// firebase
import { updateOneLevelSingleData } from '@/firebase/v1/firestore';

const calculateLastDay = (year, month) => {
  const date = new Date(year, month, 0);
  const lastDay = date.getDate();
  return  `${year}/${month}/${lastDay}`;
}

const submit = handleSubmit(async (values) => {
  try {
    if (step.value === 1) {
      cancellationDate.value = calculateLastDay(values.cancellationYear, values.cancellationMonth);
      step.value++;
    } else if (step.value >= 2) {
      if (cancellationDate.value) {
        const saveData = {
          cancellationDate: cancellationDate.value,
          role: role.cancellationApplicant
        };
        await updateOneLevelSingleData(props.authData.uid, "members", saveData);
        step.value++;
        message.value = '退会申請のお手続きが完了しました。';
      }
    }

  } catch (error) {
    console.error(error);
    errorMessage.value = 'メールアドレスの変更に失敗しました。';
  }
});
</script>
<style>
.v-stepper-header {
  box-shadow: none!important;
}
.custom-border > div {
  border: 1px solid rgba(0,0,0,0.12);
}
</style>
