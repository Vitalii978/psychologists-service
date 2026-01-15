import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from './config';
import { ref, set, get } from 'firebase/database';

// Функция для перевода ошибок Firebase в понятные сообщения
const getFirebaseErrorMessage = (errorCode) => {
  const errorMessages = {
    // Общие ошибки
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    
    // Ошибки логина
    'auth/user-not-found': 'User not found. Please check your email.',
    'auth/wrong-password': 'Invalid password. Please try again.',
    'auth/user-disabled': 'This account has been disabled.',
    
    // Ошибки регистрации
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/weak-password': 'Password is too weak. Minimum 6 characters.',
    'auth/invalid-email': 'Invalid email format.',
    'auth/operation-not-allowed': 'Registration is temporarily disabled.',
    
    // Другие ошибки
    'auth/invalid-credential': 'Invalid email or password.',
  };
  
  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};

// 1. Регистрация
export const registerUser = async (email, password, name) => {
  try {
    // Создаем пользователя в Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Сохраняем имя в Firebase Database
    await set(ref(db, 'users/' + user.uid), {
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    // Преобразуем ошибку Firebase в понятное сообщение
    const errorMessage = getFirebaseErrorMessage(error.code);
    return { success: false, error: errorMessage };
  }
};

// 2. Логин
export const loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    // Преобразуем ошибку Firebase в понятное сообщение
    const errorMessage = getFirebaseErrorMessage(error.code);
    return { success: false, error: errorMessage };
  }
};

// 3. Логаут
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    const errorMessage = getFirebaseErrorMessage(error.code);
    return { success: false, error: errorMessage };
  }
};

// 4. Получение данных пользователя - ВОЗВРАЩАЕМ К ПРЕЖНЕЙ ЛОГИКЕ
export const getUserData = async (userId) => {
  try {
    const userRef = ref(db, 'users/' + userId);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return { success: true, data: snapshot.val() };
    }
    // ВОЗВРАЩАЕМ success: false БЕЗ ОШИБКИ, если данных нет
    return { success: false };
  } catch (error) {
    console.error('Error getting user data:', error);
    return { success: false };
  }
};

// 5. Следим за авторизацией - ИСПРАВЛЯЕМ ЛОГИКУ
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Получаем имя из Database
      const userData = await getUserData(user.uid);
      
      if (userData.success && userData.data) {
        // Есть данные в Database - используем сохраненное имя
        callback({
          uid: user.uid,
          email: user.email,
          displayName: userData.data.name
        });
      } else {
        // Нет данных в Database - используем часть email как имя
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.email.split('@')[0] // Берем часть до @
        });
      }
    } else {
      callback(null);
    }
  });
};