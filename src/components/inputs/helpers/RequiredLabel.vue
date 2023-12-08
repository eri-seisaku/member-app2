<template>
  <!-- <label class="text-subtitle-1 text-medium-emphasis">
    {{ label }}
    <span class="bg-red-accent-3 rounded text-subtitle-2 pa-1 ml-3">必須</span>
  </label> -->
  <NormalLabel :label="label">
    <template v-slot:mark>
      <span class="bg-red-accent-3 rounded text-subtitle-2 pa-1 ml-3">必須</span>
    </template>
  </NormalLabel>
</template>
<script setup>
import NormalLabel from '@/components/inputs/helpers/NormalLabel.vue';
const props = defineProps({
  label: String,
});

</script>

<style>

</style>
