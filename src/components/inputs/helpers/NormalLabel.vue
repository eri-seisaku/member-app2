<template>
  <label class="text-subtitle-1 text-medium-emphasis">
    {{ label }}
    <slot name="mark"></slot>
  </label>
</template>
<script setup>
const props = defineProps({
  label: String,
});

</script>

<style>

</style>
