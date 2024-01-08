<template>
  <div>
    <v-file-input
      density="compact"
      variant="outlined"
      prepend-icon=""
      ref="fileInput"
      bg-color="white"
    >
      <template v-slot:append>
        <v-btn
          variant="outlined"
          class="bg-white"
          min-height="40"
          @click="fileInput.click()"
        >画像を選択</v-btn>
      </template>
    </v-file-input>
  </div>
</template>


<script setup>
import { ref } from 'vue';
const fileInput = ref(null);

// validation
import { useField, useForm } from 'vee-validate';


</script>
<style>

</style>

