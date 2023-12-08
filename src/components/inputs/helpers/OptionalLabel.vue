<template>
  <NormalLabel :label="label">
    <template v-slot:mark>
      <span class="bg-blue-grey-lighten-1 rounded text-subtitle-2 pa-1 ml-3">任意</span>
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
