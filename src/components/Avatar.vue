<template>
  <!-- <v-sheet class="pa-6 ma-6" rounded align="center"> -->
    <v-avatar
      color="grey"
      size="150"
    >
      <v-img
        cover
        :src="imageSrc"
        :width="150"
        aspect-ratio="1/1"
      ></v-img>
    </v-avatar>
    <!-- <h4 class="mt-2 text-subtitle-1">{{ userName }}</h4> -->
  <!-- </v-sheet> -->
</template>


<script setup>
// 親から子へ
const props = defineProps({
  // userName: String,
  imageSrc: String
});

</script>
