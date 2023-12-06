import axios from 'axios';
import axiosJsonpAdapter from 'axios-jsonp'

// 郵便番号から住所検索
export const fetchAddress = async (zipCode) => {
  try {
    const res = await axios.get(`https://api.zipaddress.net/?zipcode=${zipCode}`, { adapter: axiosJsonpAdapter });

    // デバック
    // console.log(res); // 全て
    // console.log(res.data.message); // エラーメッセージ
    // console.log(res.data.code); // 404
    // console.log(res.status); // 200
    // console.log(res.data.pref); // 都道府県
    // console.log(res.data.address); // 町名まで
    // console.log(res.data.city); // ○○群○○
    // console.log(res.data.town); // 町名のみ

    if (res.status === 200) {
      if (res.data.code !== 404) {
        return res; // レスポンスを返す
      } else {
        return 200; // 200を返す（エラーコードの代わり）
      }
    } else {
      return false; // エラーを示す値を返す
    }
  } catch (error) {
    console.error('郵便番号検索エラー:', error);
    throw error; // エラーをスローすることで呼び出し元にエラーを伝える
  }
};
