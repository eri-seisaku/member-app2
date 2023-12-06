<template>
  <div>
    <v-dialog
      v-model="parentDialog"
      activator="parent"
      :max-width="size"
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between">
        <!-- <v-card-title class="d-flex justify-end"> -->
          <v-img
            class="mt-4"
            max-width="120"
            src="@/assets/logo-vuetify.svg"
          ></v-img>
          <v-btn
            icon
            variant="text"
            @click="parentDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mb-4">
          <slot name="content"></slot>
        </v-card-text>
        <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <slot name="actions"></slot>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// 親から子へ
const props = defineProps({
  dialog: Boolean,
  size: [String, Number]
});

// 子から親へ
const emit = defineEmits([
  'update:dialog'
]);

// 直接v-modelにバインドしないように
const parentDialog = computed({
  get: () => props.dialog,
  set: (val) => emit('update:dialog', val),
});

// ダイアログを閉じるメソッド
// const closeDialog = () => {
//   parentDialog.value = false;
// };
</script>

