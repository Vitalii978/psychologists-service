// ============================================
// ФАЙЛ: src/firebase/favorites.js
// ФУНКЦИИ ДЛЯ РАБОТЫ С ИЗБРАННЫМИ В FIREBASE
// ============================================

import { ref, set, get, remove } from 'firebase/database';
import { db } from './config';

// 1. ДОБАВИТЬ В ИЗБРАННОЕ
export const addToFavorites = async (
  userId,
  psychologistId,
  psychologistData
) => {
  try {
    // Создаем путь: favorites/userId/psychologistId
    const favoriteRef = ref(db, `favorites/${userId}/${psychologistId}`);

    // Сохраняем данные психолога
    await set(favoriteRef, {
      ...psychologistData,
      addedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 2. УДАЛИТЬ ИЗ ИЗБРАННОГО
export const removeFromFavorites = async (userId, psychologistId) => {
  try {
    const favoriteRef = ref(db, `favorites/${userId}/${psychologistId}`);
    await remove(favoriteRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 3. ПОЛУЧИТЬ ВСЕ ИЗБРАННЫЕ ПОЛЬЗОВАТЕЛЯ
export const getUserFavorites = async userId => {
  try {
    const favoritesRef = ref(db, `favorites/${userId}`);
    const snapshot = await get(favoritesRef);

    if (snapshot.exists()) {
      const favoritesObject = snapshot.val();
      // Преобразуем объект в массив
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

// 4. ПРОВЕРИТЬ ЕСТЬ ЛИ В ИЗБРАННОМ
export const isPsychologistFavorite = async (userId, psychologistId) => {
  try {
    const favoriteRef = ref(db, `favorites/${userId}/${psychologistId}`);
    const snapshot = await get(favoriteRef);
    return { success: true, isFavorite: snapshot.exists() };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 5. ПОЛУЧИТЬ СТАТУСЫ ИЗБРАННОГО ДЛЯ СПИСКА
export const getFavoritesStatus = async (userId, psychologistIds) => {
  try {
    if (!userId) {
      // Если нет пользователя - все false
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
