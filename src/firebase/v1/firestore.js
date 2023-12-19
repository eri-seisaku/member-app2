import { db } from '@/firebase/firebase';
import {
  collection,
  doc,
  setDoc, // 登録(上書き)
  addDoc, // 登録(追加)
  getDoc, // 取得
  getDocs, // 全て取得
  updateDoc, // 更新
  deleteDoc,
  writeBatch, // バッチ処理(複数の書き込み)
  // arrayUnion // 配列内の一意の値を追加
} from "firebase/firestore";

// 更新 - 1階層 - ユーザーの単数データ
export async function updateOneLevelSingleData(userID, collectionName, arrayData) {
  try {
    const docRef = doc(db, collectionName, userID);

    await updateDoc(docRef, arrayData);
  } catch (error) {
    console.error("更新エラーby Firestore:", error);
    throw error;
  }
}

// 更新 - 2階層 - ユーザーの単数データ
export async function updateTwoLevelSingleData(userID, firstCollectionName, secondCollectionName, docID, arrayData) {
  try {
    const firstDocRef = doc(db, firstCollectionName, userID);
    const secondDocRef = doc(firstDocRef, secondCollectionName, docID);

    await updateDoc(secondDocRef, arrayData);
  } catch (error) {
    console.error("更新エラーby Firestore:", error);
    throw error;
  }
}

// 更新 - 2階層 - ユーザーの複数
export async function updateTwoLevelMultipleData(userID, firstCollectionName, secondCollectionName, docIDs, arrayData) {
  try {
    const firstDocRef = doc(db, firstCollectionName, userID);
    const batch = writeBatch(db);

    for (const id of docIDs) {
      const secondDocRef = doc(firstDocRef, secondCollectionName, id);
      batch.update(secondDocRef, arrayData);
    }

    await batch.commit();
  } catch (error) {
    console.error("更新エラーby Firestore:", error);
    throw error;
  }
}

// 上書き - 1階層 - 単数(SignUp用)
export async function setOneLevelSingleData(userID, collectionName, arrayData) {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = doc(collectionRef, userID);

    await setDoc(docRef, arrayData);

  } catch (error) {
    console.error("保存エラーby Firestore:", error);
    throw error; // throw: 呼び出し元に例外処理を投げる
  }
}

// 上書き - 1階層 - 複数(ExportImport用)
export async function setOneLevelMultipleData(collectionName, multipleArrayData) {
  try {
    const batch = writeBatch(db);

    multipleArrayData.forEach((userData) => {
      const docRef = doc(db, collectionName, userData.memberID);
      batch.set(docRef, userData, {merge: true});
    });

    await batch.commit();
  } catch (error) {
    console.error("更新エラーby Firestore:", error);
    throw error;
  }
}

// ---------------------------------------
// 修正中
// 上書き - 2階層 - 複数(ExportImport用)
export async function setTwoLevelMultipleData(collectionName, secondCollectionName, multipleArrayData) {
  try {
    const batch = writeBatch(db);

    multipleArrayData.forEach((userData) => {
      const docRef = doc(db, collectionName, userData.memberID);
      batch.set(docRef, userData, {merge: true});
    });

    await batch.commit();
  } catch (error) {
    console.error("更新エラーby Firestore:", error);
    throw error;
  }
}
// ---------------------------------------


// 追加 - 1階層 - ドキュメントIDを指定しない1つだけ(ログ記録に使用)
export async function addOneLevelSingleData(collectionName, arrayData) {
  try {
    const collectionRef = collection(db, collectionName);

    await addDoc(collectionRef, arrayData);
  } catch (error) {
    console.error("保存エラーby Firestore:", error);
    throw error;
  }
}

// 追加 - 2階層 - 特定
export async function addTwoLevelSingleData(userID, arrayData, firstCollectionName, secondCollectionName) {
  try {
    const docRef = doc(db, firstCollectionName, userID);
    const collectionRef = collection(docRef, secondCollectionName);

    // 2階層目のドキュメントIDを返す
    const secondDocRef = await addDoc(collectionRef, arrayData);
    return secondDocRef.id;

  } catch (error) {
    console.error("保存エラーby Firestore:", error);
    throw error;
  }
}

// 取得 - 1つだけ - 1階層
export async function getOneLevelSingleData(userID, collectionName) {
  try {
    const docRef = doc(db, collectionName, userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("データが見つかりません");
    }
  } catch (error) {
    console.error('取得エラーby Firestore', error);
    throw error;
  }
}

// 取得 - 1つだけ - 2階層
export async function getTwoLevelSingleData(userID, docID, firstCollectionName, secondCollectionName) {
  try {
    const firstDocRef = doc(db, firstCollectionName, userID);
    const collectionRef = collection(firstDocRef, secondCollectionName);

    const secondDocRef = doc(collectionRef, docID);
    const docSnap = await getDoc(secondDocRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("データが見つかりません");
    }
  } catch (error) {
    console.error('取得エラーby Firestore', error);
    throw error;
  }
}

// 取得 - 特定ID複数 - 2階層
export async function getTwoLevelUserData(userID, firstCollectionName, secondCollectionName) {
  try {
    const docRef = doc(db, firstCollectionName, userID);
    const collectionRef = collection(docRef, secondCollectionName);

    const querySnapshot = await getDocs(collectionRef);
    const allData = [];

    querySnapshot.forEach((doc) => {
      allData.push({ id: doc.id, ...doc.data() }); // IDも一緒に
      // allData.push(doc.data()); // IDなし
    });

    return allData;
  } catch (error) {
    console.error('取得エラーby Firestore:', error);
    throw error;
  }
}

// 取得 - 全 - 1階層
export async function getOneLevelAllData(collectionName) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const allData = [];

    querySnapshot.forEach((doc) => {
      allData.push(doc.data())
    });

    return allData;
  } catch (error) {
    console.error('取得エラーby Firestore:', error);
    throw error;
  }
}

// 取得 - 全 - 2階層
export async function getTwoLevelAllData(firstCollectionName, secondCollectionName) {
  try {
    const firstCollectionRef = collection(db, firstCollectionName);

    const firstSnapshot = await getDocs(firstCollectionRef);
    const allData = [];

    // デバック
    // firstSnapshot.forEach((doc) => {
    //   console.log(doc.id);
    // });

    // const userIds = firstSnapshot.docs.map(doc => doc.id);
    // console.log(userIds);  // ユーザーIDの配列を表示

    for (const userDoc of firstSnapshot.docs) {
      const userID = userDoc.id;
      const secondCollectionRef = collection(userDoc.ref, secondCollectionName);
      const secondSnapshot = await getDocs(secondCollectionRef);

      secondSnapshot.forEach((postDoc) => {
        allData.push({ userID, postID: postDoc.id, ...postDoc.data() });
      });
    }

    return allData;
  } catch (error) {
    console.error('取得エラーby Firestore:', error);
    throw error;
  }
}

// ログに記録
export async function recordLog(userID, docID, logMassage) {
  // docIDが配列であるかどうかをチェック
  const isDocIDArray = Array.isArray(docID);

  if (isDocIDArray) {
    // docIDが配列である場合、各IDに対してログを記録
    for (const id of docID) {
      const log = {
        date: new Date(),
        log: logMassage,
        memberID: userID,
        portfolioID: id
      }
      await addOneLevelSingleData("logs", log);
    }
  } else {
    // docIDが単一のIDである場合、そのIDに対してログを記録
    const log = {
      date: new Date(),
      log: logMassage,
      memberID: userID,
      portfolioID: docID
    }
    await addOneLevelSingleData("logs", log);
  }
}


// export async function deleteTwoLevelData(userID, docIDs, firstCollectionName, secondCollectionName) {
//   try {
//     const firstDocRef = doc(db, firstCollectionName, userID);
//     const collectionRef = collection(firstDocRef, secondCollectionName);

//     for (const id of docIDs) {
//       const secondDocRef = doc(collectionRef, id);
//       await deleteDoc(secondDocRef);
//     }
//   } catch (error) {
//     console.error('削除エラーby Firestore', error);
//     throw error;
//   }
// }

// 削除
export async function deleteTwoLevelData(userID, firstCollectionName, secondCollectionName, docIDs) {
  try {
    const firstDocRef = doc(db, firstCollectionName, userID);
    const batch = writeBatch(db);

    for (const id of docIDs) {
      const secondDocRef = doc(firstDocRef, secondCollectionName, id);
      batch.delete(secondDocRef);
    }

    await batch.commit();
  } catch (error) {
    console.error("削除エラーby Firestore:", error);
    throw error;
  }
}

