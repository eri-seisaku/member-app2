export function parseCSVToJSON(csvData) {
  const lines = csvData.split('\n');
  const data = [];

  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim(); // 前後の空白を削除

    // 空行を無視
    if (line === '') {
      continue; // スキップ
    }

    const values = line.split(',');

    // 列数がヘッダーと一致しない場合は無視する
    if (values.length !== headers.length) {
      console.warn(`行 ${i + 1} は無視されました。列数が一致しません。`);
      continue;
    }

    const row = {}; // 行
    for (let j = 0; j < headers.length; j++) {
      const fieldName = headers[j].trim(); // 余分なスペースを削除
      row[fieldName] = values[j];
    }

    data.push(row);
  }
  console.log(data); // csvのデータが正しく変換できたか確認用

  return data;
}
