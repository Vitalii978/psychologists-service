import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from './config';
import { ref, set, get } from 'firebase/database';

// 1. Регистрация
export const registerUser = async (email, password, name) => {
  try {
    // Создаем пользователя в Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Сохраняем имя в Firebase Database
    await set(ref(db, 'users/' + user.uid), {
      name: name,
      email: email
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 2. Логин
export const loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 3. Логаут
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 4. Получение данных пользователя
export const getUserData = async (userId) => {
  try {
    const userRef = ref(db, 'users/' + userId);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return { success: true, data: snapshot.val() };
    }
    return { success: false };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 5. Следим за авторизацией
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Получаем имя из Database
      const userData = await getUserData(user.uid);
      if (userData.success) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: userData.data.name
        });
      } else {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.email.split('@')[0]
        });
      }
    } else {
      callback(null);
    }
  });
};