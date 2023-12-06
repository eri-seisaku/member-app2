import { ref } from 'vue';

export const chips = [
  { key: 'uppercase', text: '大文字', value: ref(false)},
  { key: 'lowercase', text: '小文字', value: ref(false)},
  { key: 'numbers', text: '数字', value: ref(false)},
  { key: 'specialSymbols', text: '特殊記号', value: ref(false)},
  { key: 'count', text: '8文字以上', value: ref(false)},
];

export const updateChips = (newVal, chips) => {
  const uppercaseArr = chips.find(chip => chip.key === 'uppercase');
  const lowercaseArr = chips.find(chip => chip.key === 'lowercase');
  const numbersArr = chips.find(chip => chip.key === 'numbers');
  const specialSymbolsArr = chips.find(chip => chip.key === 'specialSymbols');
  const countArr = chips.find(chip => chip.key === 'count');
  uppercaseArr.value.value = /[A-Z]/.test(newVal);
  lowercaseArr.value.value = /[a-z]/.test(newVal);
  numbersArr.value.value = /\d/.test(newVal);
  specialSymbolsArr.value.value = /[@$!%*?&]/.test(newVal);
  countArr.value.value = /^.{8,64}$/.test(newVal);
};
