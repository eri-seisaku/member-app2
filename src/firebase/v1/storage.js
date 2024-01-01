import { storage } from '@/firebase/firebase';
import {
  ref,
  getDownloadURL,
  getMetadata, // メタデータ取得
  uploadBytesResumable
} from "firebase/storage";


export async function upload(directoryName, fileData, userID) {
  try {
    // ファイルを保存するパス
    const filePath = `${directoryName}/${userID}/${fileData.name}`;

    const storageRef = ref(storage, filePath); // Storageの参照を作成

    const metadata = {
      contentType: fileData.type,
    }

    const snapshot = await uploadBytesResumable(storageRef, fileData, metadata);
    const url = await getDownloadURL(snapshot.ref);

    // メタデータを取得
    const meta = await getMetadata(snapshot.ref);
    // console.log(meta.contentType); // ファイルタイプを表示

    return [url, {name: fileData.name, type: meta.contentType}];

  } catch (error) {
    console.error("Storageへのデータ保存エラーby Storage:", error);
    throw error; // throw: 呼び出し元に例外処理を投げる
  }
}

// // カスタムファイル名を生成
// const timestamp = new Date().getTime();
// const customFileName = `portfolio_${userID}_${articleID}_${timestamp}.jpg`;
// // ファイルを保存するパス
// const filePath = `images/portfolio/${customFileName}`;

