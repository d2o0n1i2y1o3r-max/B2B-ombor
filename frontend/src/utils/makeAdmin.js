// Bu skriptni brauzer konsolida ishga tushiring
// Foydalanuvchi ro'yxatdan o'tgandan keyin, uning UID ni oling va quyidagicha ishlating

import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

async function makeUserAdmin(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: 'admin' });
    console.log('Foydalanuvchi admin qilindi!');
  } catch (error) {
    console.error('Xatolik:', error);
  }
}

// Foydalanish:
// 1. Tizimga kiring
// 2. Firebase Console → Firestore Database → users collection → foydalanuvchini toping → UID nusxalang
// 3. Konsolda quyidagini yozing:
// makeUserAdmin('USER_UID_HERE')
