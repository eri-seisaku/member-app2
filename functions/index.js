// Dependencies for callable functions.
// const {onRequest} = require("firebase-functions/v2/https");
const {onRequest, onCall, HttpsError, config} = require("firebase-functions/v2/https");

// ログ
const {logger} = require("firebase-functions/v2");

// regionの設定
const {setGlobalOptions} = require("firebase-functions/v2");
setGlobalOptions({ region: "asia-northeast2" });

// Dependencies for the addMessage function.
// const {getDatabase} = require("firebase-admin/database");

const {adminMailBody, thanksMailBody} = require('./lib/mailBody');


const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();


exports.sendMail = onCall(async (request) => {
  // メール送信の処理
  const data = request.data;
  const { name, email, content } = data;
  if (!email) {
    throw new HttpsError(
      "invalid-argument","email is required"
    );
  }

  const adminMailData = {
    // to: config().mail.admin_address, // 設定できない
    to: "dobo611@ichigo.me",
    message: {
      subject: "会員申込",
      text: adminMailBody({ name, email, content }),
    },
  };

  const thanksMailData = {
    to: email,
    message: {
      subject: "お申し込みありがとうございます",
      text: thanksMailBody({ name, email, content }),
    },
  };

  await db.collection("mail").add(adminMailData);
  await db.collection("mail").add(thanksMailData);

  // 関数の返り値（成功した場合は 'Success' など）
  return 'Success';
});
