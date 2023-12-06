<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <v-card
        v-bind="props"
        :href="to"
        :color="isHovering ? 'blue-grey-lighten-5' : undefined"
        variant="flat"
        class="py-5 px-6 text-center mx-auto"
      >
        <v-icon
          class="mb-2"
          :icon="icon"
          color="grey-lighten-1"
          size="40"
        ></v-icon>
        <p class="text-subtitle-1">{{ title }}</p>
      </v-card>
    </template>
  </v-hover>
</template>

<script setup>
// 親から子へ
const props = defineProps({
  to: String,
  icon: String,
  title: String
});
</script>


