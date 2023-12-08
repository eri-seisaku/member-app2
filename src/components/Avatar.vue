<template>
  <v-avatar
    color="grey"
    :size="size"
  >
    <v-img
      cover
      :src="imageSrc"
      :width="size"
      aspect-ratio="1/1"
    ></v-img>
  </v-avatar>
</template>


<script setup>
// 親から子へ
const props = defineProps({
  // userName: String,
  imageSrc: String,
  size: Number
});

</script>
