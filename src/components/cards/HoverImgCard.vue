<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <v-card
        v-bind="props"
        :href="url"
        :color="isHovering ? 'blue-grey-lighten-5' : undefined"
        variant="flat"
      >
      <v-img
        cover
        :src="src"
      ></v-img>

      </v-card>
    </template>
  </v-hover>
</template>

<script setup>
// 親から子へ
const props = defineProps({
  url: String,
  src: String,
});
</script>


