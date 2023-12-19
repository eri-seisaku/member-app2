<template>
  <v-container>
    <v-row align="center">
      <v-col cols="12" md="5" class="d-flex align-center flex-md-row flex-column">
        <v-avatar
          color="grey"
          size="130"
          class="ma-4"
        >
          <v-img
            cover
            :src="readData.profileIcon"
            aspect-ratio="1/1"
          ></v-img>
        </v-avatar>
        <div class="text-center text-md-left">
          <a
            class="d-block text-grey-lighten-1 mx-2 custom-hover"
            :href="readData.website ? readData.website : null"
            target="_blank"
            rel="noopener"
          >{{ readData.officeName }}</a>
          <h3 class="text-h4 my-2">{{ readData.name }}</h3>
        </div>

      </v-col>

      <v-col cols="12" md="7">
        <v-list lines="one">
          <v-list-item
            v-for="list in lists"
            :key="list.title"
            :title="list.title"
            :subtitle="list.value"
          ></v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-row>
      <Accordion
        :userID="route.params.userID"
      />
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const lists = ref([]);
const readData = ref({});

// router
import { useRoute } from "vue-router";
const route = useRoute();

// console.log(route.params.userID); // userId取得確認用

// components
import Accordion from '@/views/site/child_detail/Accordion.vue';

// firebase
import { getOneLevelSingleData } from '@/firebase/v1/firestore';


onMounted(async () => {
  try {
    readData.value = await getOneLevelSingleData(route.params.userID, "members");

    lists.value = [
      {
        title: 'SPECIALTY',
        value: readData.value.specialty
      },
      {
        title: 'INDUSTRY',
        value: readData.value.industry
      },
      {
        title: 'JOB',
        value: 'サンプルテキスト'
      },
    ];

  } catch (error) {
    console.error('ユーザーデータ取得エラー', error);
  }
});

</script>

