<template>
  <div
    class="moving-arrow"
    :style="arrowStyle"
  ></div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  moveY: Number,
});

const arrowStyle = computed(() => {
  return {
    transform: `translate3d(0px, ${props.moveY}px, 0px)`,
  };
});

console.log(props);
</script>

<style>
.moving-arrow {
  border-right: 17px solid #FAFAFA;
  border-top: 17px solid transparent;
  border-bottom: 17px solid transparent;
  display: inline-block;
  position: absolute;
  left: 243px;
  top: 170px;
  transition: all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1);
}

@media (max-width: 992px) {
  .moving-arrow {
    display: none;
  }
}
</style>
