<template>
  <label class="text-subtitle-1 text-medium-emphasis">
    {{ label }}
    <span class="bg-blue-grey-lighten-1 rounded text-subtitle-2 pa-1 ml-3">任意</span>
  </label>
</template>
<script setup>
const props = defineProps({
  label: String,
});

</script>

<style>

</style>
