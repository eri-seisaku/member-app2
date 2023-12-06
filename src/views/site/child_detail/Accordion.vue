<template>
  <v-col cols="12">
    <v-expansion-panels
      variant="accordion"
      color="white"
      class="my-8 custom-accordion"
    >
      <v-expansion-panel>
        <v-expansion-panel-title>TITLE 01</v-expansion-panel-title>
        <v-expansion-panel-text class="pa-4">
          サンプルテキスト。サンプルテキスト。サンプルテキスト。サンプルテキスト。サンプルテキスト。
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>TITLE 02</v-expansion-panel-title>
        <v-expansion-panel-text class="pa-4">
          サンプルテキスト。サンプルテキスト。サンプルテキスト。サンプルテキスト。サンプルテキスト。
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>PORTFOLIO</v-expansion-panel-title>
        <v-expansion-panel-text class="pa-4">
          <DialogCard
            :userID="props.userID"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-col>
</template>

<script setup>
// component
import DialogCard from '@/views/site/child_detail/DialogCard.vue';

const props = defineProps({
  userID: String,
});
// console.log(props.userID);

</script>

<style>
/* vuetifyのアコーディオンの見た目を修正 */
.custom-accordion .v-expansion-panel__shadow {
  box-shadow: none;
}
/* プラス */
.custom-accordion .mdi-chevron-down::before {
  content: "\F0415";
}
/* マイナス */
.custom-accordion .mdi-chevron-up::before {
  content: "\F0374";
}
.v-expansion-panel > button {
  margin-bottom: 1em;
  border-left: 10px solid;
  border-bottom: 2px solid;
  border-radius: 0!important;
}
.v-expansion-panel::after {
  border-style: none!important;
}
</style>
