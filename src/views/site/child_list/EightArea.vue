<template>
  <v-row no-gutters>
    <v-col cols="1" v-for="index in 144">
      <div
        :class="[
          getDynamicClass(index),
          { opacity: selectedArea !== null && !selectedArea.numbers.includes(index) }
        ]"
        @click="getNumber(index)"
      >
        <!-- {{ index }} -->
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
const selectedArea = ref(null);

const areas = [
  { numbers: [10, 11, 12, 22, 23, 24, 34], className: 'hokkaido', areaName: '北海道' },
  { numbers: [58, 59, 60, 70, 71, 72, 83, 84, 95, 96], className: 'tohoku', areaName: '東北' },
  { numbers: [82, 92, 93, 94, 104, 105, 116, 117, 128], className: 'chubu', areaName: '中部' },
  { numbers: [106, 107, 108, 118, 119, 120], className: 'kanto', areaName: '関東' },
  { numbers: [90, 91, 102, 103, 114, 115, 127], className: 'kinki', areaName: '近畿' },
  { numbers: [88, 89, 100, 101], className: 'chugoku', areaName: '中国' },
  { numbers: [112, 113, 124, 125], className: 'shikoku', areaName: '四国' },
  { numbers: [98, 99, 110, 111, 122, 123, 133], className: 'kyushu_okinawa', areaName: '九州沖縄' }
];

const getDynamicClass = (index) => {
  const numberClass = {
    area: true,
    // white: true, // trueにするとwhiteクラスが全番号に付与
    // opacity: true
  };
  const area = areas.find(area => area.numbers.includes(index));
  if (area) {
    numberClass[area.className] = true;
  }

  return numberClass;
};

// 子から親へ
const emit = defineEmits([
  'selected',
  'reset'
]);

const getNumber = (index) => {
  const area = areas.find(area => area.numbers.includes(index));
  if (area) {
    emit('selected', area.areaName); // エリア名を親コンポーネントに渡す
    selectedArea.value = area; // 選択したエリアを保持

  } else {
    selectedArea.value = null;
    emit('reset');
  }
};


</script>
<style>
.opacity {
  opacity: 0.6;
}
/* セルの高さ */
.area {
  height: 2em;
}
.hokkaido {
  background: #7ab7f0;
  border-style: none;
  cursor: pointer;
}
.tohoku {
  background: #8be1f9;
  border-style: none;
  cursor: pointer;
}
.chubu {
  background: #fffb90;
  border-style: none;
  cursor: pointer;
}
.kanto {
  background: #a5cd7c;
  border-style: none;
  cursor: pointer;
}
.kinki {
  background: #f8b87b;
  border-style: none;
  cursor: pointer;
}
.chugoku {
  background: #f7968e;
  border-style: none;
  cursor: pointer;
}
.shikoku {
  background: #fab3eb;
  border-style: none;
  cursor: pointer;
}
.kyushu_okinawa {
  background: #c7adf7;
  border-style: none;
  cursor: pointer;
}
</style>
