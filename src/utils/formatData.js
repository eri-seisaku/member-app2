// timestampの形式を変換
export function formatDateForTimestamp(timestamp) {
  const date = timestamp.toDate();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}

// 数字にスラッシュを入れる
export function formatDateWithSlash(intValue) {
  const year = intValue.substring(0, 4);
  const month = intValue.substring(4, 6);
  const day = intValue.substring(6, 8);

  return `${year}/${month}/${day}`;
}

// undefinedの値を空白に
export function formatFormValues(values) {
  const formattedValues = {};
  for (const key in values) {
    const trimmedAndFormattedValue = values[key] !== undefined ? values[key].trim() : "";
    const replacedFormattedValue = trimmedAndFormattedValue.replace(/[\u3000\s]/g, " ");
    formattedValues[key] = replacedFormattedValue;
  }
  return formattedValues;
}



