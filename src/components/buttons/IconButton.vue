<template>
  <v-btn
    color="member"
    type="submit"
    :class="class"
  >
    <v-icon
      start
      :icon="iconName"
    ></v-icon>
    {{ buttonText }}
  </v-btn>
</template>

<script setup>
const props = defineProps({
  class: String,
  iconName: String,
  buttonText: String
});
</script>
