<template>
  <a
    :href="link"
    rel="nofollow noopener noreferrer"
    target="_blank"
    class="text-grey-lighten-1 mx-2 custom-hover"
  >
    <v-icon>
      {{ icon }}
    </v-icon>
  </a>
</template>
<script setup>
const props = defineProps({
  link: String,
  icon: String
});

</script>

<style>
a.custom-hover {
  text-decoration: none;
}
a.custom-hover:hover {
  color: rgb(0, 0, 0)!important;
  text-decoration: underline;
}
</style>
