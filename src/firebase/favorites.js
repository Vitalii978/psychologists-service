import { ref, set, get, remove } from 'firebase/database';
import { db } from './config';

export const addToFavorites = async (
  userId,
  psychologistId,
  psychologistData
) => {
  try {
    const favoriteRef = ref(db, `favorites/${userId}/${psychologistId}`);

    await set(favoriteRef, {
      ...psychologistData,
      addedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const removeFromFavorites = async (userId, psychologistId) => {
  try {
    const favoriteRef = ref(db, `favorites/${userId}/${psychologistId}`);
    await remove(favoriteRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserFavorites = async userId => {
  try {
    const favoritesRef = ref(db, `favorites/${userId}`);
    const snapshot = await get(favoritesRef);

    if (snapshot.exists()) {
      const favoritesObject = snapshot.val();

      const favoritesArray = Object.keys(favoritesObject).map(key => ({
        id: key,
        ...favoritesObject[key],
      }));

      return { success: true, favorites: favoritesArray };
    } else {
      return { success: true, favorites: [] };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const isPsychologistFavorite = async (userId, psychologistId) => {
  try {
    const favoriteRef = ref(db, `favorites/${userId}/${psychologistId}`);
    const snapshot = await get(favoriteRef);
    return { success: true, isFavorite: snapshot.exists() };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getFavoritesStatus = async (userId, psychologistIds) => {
  try {
    if (!userId) {

      const statuses = {};
      psychologistIds.forEach(id => {
        statuses[id] = false;
      });
      return { success: true, statuses };
    }

    const favoritesRef = ref(db, `favorites/${userId}`);
    const snapshot = await get(favoritesRef);

    const statuses = {};
    if (snapshot.exists()) {
      const favoritesObject = snapshot.val();
      const favoriteIds = Object.keys(favoritesObject);

      psychologistIds.forEach(id => {
        statuses[id] = favoriteIds.includes(id);
      });
    } else {
      psychologistIds.forEach(id => {
        statuses[id] = false;
      });
    }

    return { success: true, statuses };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
