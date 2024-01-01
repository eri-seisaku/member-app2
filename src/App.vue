<template>
  <router-view />
</template>

<script setup>

</script>
<style>
/* 初期設定 */
html {
  scroll-padding-top: 64px; /* ヘッダーの高さ */
}
ul {
  list-style: none;
}
.cursor {
  cursor: pointer;
}
/* scrollbarの装飾 */
::-webkit-scrollbar{
  width: 10px;
}
::-webkit-scrollbar-track{
  background: #fff;
  border: none;
  border-radius: 10px;
  box-shadow: inset 0 0 1px #777;
}
::-webkit-scrollbar-thumb{
  background: #bdbdbd;
  border-radius: 10px;
  box-shadow: none;
}
/* 描画の準備が整うまで要素を非表示 */
[v-cloak] {
  display: none;
}
</style>
