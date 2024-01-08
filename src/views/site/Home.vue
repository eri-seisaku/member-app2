<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5">ホーム</h2>
        <p class="mt-8">
          リストページの検索方法は下記をご確認ください。
          近畿エリアを選択しているのに都道府県は東京を条件にしたりすると永遠にユーザーが見つからないので地図の状態を見てください。クリックしたところ以外は少し薄くなっています。
        </p>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-img
            src="@/assets/howto/howto1.png"
            max-height="300"
            class="bg-grey-lighten-2"
          ></v-img>
          <v-card-title class="text-h6">
            地図で探す
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-img
            src="@/assets/howto/howto2.png"
            max-height="300"
            class="bg-grey-lighten-2"
          ></v-img>
          <v-card-title class="text-h6">
            検索フォームで探す
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-img
            src="@/assets/howto/howto3.png"
            max-height="300"
            class="bg-grey-lighten-2"
          ></v-img>
          <v-card-title class="text-h6">
            地図と検索フォームで探す
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
</script>
