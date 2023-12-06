import { states } from '@/utils/states'; // 都道府県,八区分
import { specialties, industries } from '@/utils/category'; // 専門カテゴリ,業種

export const textInputItems = [
  { key: 'name', label: '代表者名', placeholder: '山田　花子', hint: '姓と名の間にスペースを入力してください' },
  { key: 'nameKana', label: '代表者名(フリガナ)', placeholder: 'ヤマダ　ハナコ', hint: '姓と名の間にスペースを入力してください' },
  { key: 'officeName', label: '事務所名', placeholder: '事務所名', hint: '' },
  { key: 'officeNameKana', label: '事務所名(フリガナ)', placeholder: 'ジムショメイ', hint: '' },
  { key: 'capital', label: '資本金', placeholder: '1000', hint: '半角数字ででご記入ください', type: 'optional' },
  { key: 'email', label: 'メールアドレス', placeholder: 'sample@mail.com', hint: '' },
  { key: 'phone', label: '電話番号', placeholder: '0312345678', hint: 'ハイフンは入れずに半角数字でご記入ください (携帯のみの方はこちらにご記入ください)' },
  { key: 'mobile', label: '携帯番号', placeholder: '09012345678', hint: 'ハイフンは入れずに半角数字でご記入ください', type: 'optional' },
  { key: 'fax', label: 'FAX番号', placeholder: '09012345678', hint: 'ハイフンは入れずに半角数字でご記入ください', type: 'optional' },
  { key: 'website', label: 'ホームページ', placeholder: 'https://sample.com', hint: '', type: 'optional' },
];

export const dateInputItems = [
  { key: 'incorporationDate', label: '設立年月日', placeholder: '19900101', hint: '半角数字でYYYYMMDD形式でご記入ください' },
  { key: 'birthday', label: '生年月日', placeholder: '19900101', hint: '半角数字でYYYYMMDD形式でご記入ください' },
];

export const addressInputItems = [
  { key: 'addressLine1', label: '住所', placeholder: '千代田区一番町', hint: '' },
  { key: 'addressLine2', label: '建物名', placeholder: '東京ビル', hint: '', type: 'optional' },
];

export const categoryInputItems = [
  { key: 'industry', label: '業種', items: industries },
  { key: 'specialty', label: '専門デザイン分野', items: specialties },
];
