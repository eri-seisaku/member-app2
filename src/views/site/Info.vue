<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="text-h5">加入のお申し込みについて</h2>
        <!-- 目次 -->
        <div class="bg-grey-lighten-3 pa-4 my-8">
          <h4 class="mb-4">目次</h4>
          <ol class="pl-4">
            <li><a class="cursor text-decoration-underline" @click="scrollTo('section1')">加入手続きの流れ</a></li>
            <li class="py-4"><a class="cursor text-decoration-underline" @click="scrollTo('section2')">加入資格について</a></li>
            <li><a class="cursor text-decoration-underline" @click="scrollTo('section3')">加入費用について</a></li>
          </ol>
        </div>

        <!-- メインコンテンツ -->
        <section id="section1" class="mb-8">
          <h3>1. 加入手続きの流れ</h3>
          <p>ここはセクション1の内容です。</p>
        </section>
        <section id="section2" class="mb-8">
          <h3>2. 加入資格について</h3>
          <p>ここはセクション2の内容です。</p>
        </section>
        <section id="section3" class="mb-8">
          <h3>3. 加入費用について</h3>
          <p>ここはセクション3の内容です。</p>
        </section>

      </v-col>
      <v-col cols="12" class="d-flex justify-center">

        <v-btn
          variant="flat"
          size="large"
          color="primary"
          @click="$router.push({ name: 'Check' })"
        >
          仮登録フォームに進む（加入資格の確認）
          <template v-slot:append>
            <v-icon color="white">mdi-chevron-right</v-icon>
          </template>
        </v-btn>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';

const scrollTo = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

</script>
<style>
.custom-width {
  max-width: 200px;

}
</style>
