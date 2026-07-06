// Brauzer konsolida ishga tushiring
// Foydalanuvchi ro'yxatdan o'tgandan keyin, uning email orqali admin qiling

import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

async function makeUserAdminByEmail(email) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('Foydalanuvchi topilmadi');
      return;
    }
    
    const userDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, 'users', userDoc.id), { role: 'admin' });
    console.log('Foydalanuvchi admin qilindi!', userDoc.id);
  } catch (error) {
    console.error('Xatolik:', error);
  }
}

// Foydalanish:
// Konsolda quyidagini yozing:
// makeUserAdminByEmail('doniyor@gmail.com')
