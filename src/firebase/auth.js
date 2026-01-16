import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from './config';
import { ref, set, get } from 'firebase/database';

const getFirebaseErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/user-not-found': 'User not found. Please check your email.',
    'auth/wrong-password': 'Invalid password. Please try again.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/weak-password': 'Password is too weak. Minimum 6 characters.',
    'auth/invalid-email': 'Invalid email format.',
    'auth/operation-not-allowed': 'Registration is temporarily disabled.',
    'auth/invalid-credential': 'Invalid email or password.',
  };
  
  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};

export const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await set(ref(db, 'users/' + user.uid), {
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    const errorMessage = getFirebaseErrorMessage(error.code);
    return { success: false, error: errorMessage };
  }
};

export const loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    const errorMessage = getFirebaseErrorMessage(error.code);
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    const errorMessage = getFirebaseErrorMessage(error.code);
    return { success: false, error: errorMessage };
  }
};

export const getUserData = async (userId) => {
  try {
    const userRef = ref(db, 'users/' + userId);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return { success: true, data: snapshot.val() };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const userData = await getUserData(user.uid);
      
      if (userData.success && userData.data) {
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