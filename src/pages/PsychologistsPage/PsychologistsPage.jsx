import { useState, useEffect, useCallback } from 'react';
import './PsychologistsPage.css';
import PsychologistCard from '../../components/PsychologistCard/PsychologistCard';
import Filters from '../../components/Filters/Filters';
import { ref, query, orderByKey, limitToFirst, startAfter, get } from 'firebase/database';
import { db } from '../../firebase/config';
import { getFavoritesStatus, addToFavorites, removeFromFavorites } from '../../firebase/favorites';

const PsychologistsPage = ({ user, onOpenAuthRequired }) => {
  // ============================================
  // 1. СОСТОЯНИЯ КОМПОНЕНТА (State Variables)
  // ============================================
  
  const [psychologists, setPsychologists] = useState([]); // Список всех загруженных психологов
  const [sortOption, setSortOption] = useState('show-all'); // Какой фильтр выбран
  const [isLoading, setIsLoading] = useState(true); // Идет ли загрузка данных?
  const [favoritesStatus, setFavoritesStatus] = useState({}); // Какие психологи в избранном
  const [lastLoadedKey, setLastLoadedKey] = useState(null); // ID последнего загруженного психолога
  const [hasMore, setHasMore] = useState(true); // Есть ли еще данные для загрузки?
  const PAGE_SIZE = 3; // Константа: сколько психологов загружать за раз

  // ============================================
  // 2. ФУНКЦИЯ: loadInitialData - ЗАГРУЗКА ПЕРВЫХ 3 ПСИХОЛОГОВ
  // ============================================
  
  // useCallback - мемоизируем функцию, чтобы она не создавалась заново при каждом рендере
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // А. Создаем ссылку на коллекцию psychologists в Firebase
      const psychologistsRef = ref(db, 'psychologists');
      
      // Б. Создаем запрос: "Дай мне первые 3 записи, отсортированные по ID"
      const psychologistQuery = query(
        psychologistsRef,
        orderByKey(),        // Сортировка по ключу (ID)
        limitToFirst(PAGE_SIZE) // Берем только первые 3 записи
      );
      
      // В. Выполняем запрос к Firebase
      const snapshot = await get(psychologistQuery);
      
      if (snapshot.exists()) {
        // Г. Данные приходят в формате объекта { id1: data1, id2: data2 }
        const data = snapshot.val();
        
        // Д. Преобразуем объект в массив для удобной работы
        const psychologistsArray = Object.keys(data).map(key => ({
          id: key,           // Сохраняем ID
          ...data[key]       // Распаковываем остальные данные
        }));
        
        // Е. Проверяем: если загрузили меньше 3 - значит больше данных нет
        if (psychologistsArray.length < PAGE_SIZE) {
          setHasMore(false);
        }
        
        // Ж. Сохраняем ID последнего психолога (нужно для следующей загрузки)
        if (psychologistsArray.length > 0) {
          const lastKey = psychologistsArray[psychologistsArray.length - 1].id;
          setLastLoadedKey(lastKey);
        }
        
        // З. Сохраняем психологов в состояние компонента (ЗАМЕНЯЕМ, а не добавляем)
        setPsychologists(psychologistsArray);
        
        // И. Проверяем какие психологи уже в избранном у пользователя
        const psychologistIds = psychologistsArray.map(p => p.id);
        const statusResult = await getFavoritesStatus(user?.uid, psychologistIds);
        
        if (statusResult.success) {
          // Сохраняем статусы: { "id1": true, "id2": false }
          setFavoritesStatus(statusResult.statuses);
        }
      } else {
        // К. Если данных нет вообще
        setHasMore(false);
        setPsychologists([]);
      }
      
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setHasMore(false);
    } finally {
      // Л. Выключаем индикатор загрузки в любом случае
      setIsLoading(false);
    }
  }, [user?.uid]); // Зависимости функции: если изменится user - нужно пересоздать функцию

  // ============================================
  // 3. useEffect - КОГДА КОМПОНЕНТ ЗАГРУЖАЕТСЯ ИЛИ МЕНЯЕТСЯ ПОЛЬЗОВАТЕЛЬ
  // ============================================
  
  useEffect(() => {
    // Сбрасываем состояние при смене пользователя
    setPsychologists([]);
    setLastLoadedKey(null);
    setHasMore(true);
    setFavoritesStatus({});
    
    // Загружаем первые 3 психолога
    loadInitialData();
  }, [loadInitialData]); // Запускаем когда меняется loadInitialData

  // ============================================
  // 4. ФУНКЦИЯ: handleLoadMore - ЗАГРУЗКА СЛЕДУЮЩИХ 3 ПСИХОЛОГОВ
  // ============================================
  
  // Эта функция вызывается при клике на кнопку "Load more"
  const handleLoadMore = async () => {
    // Если уже все загрузили - не делаем ничего
    if (!hasMore) return;
    
    try {
      setIsLoading(true);
      
      // А. Создаем ссылку на коллекцию psychologists
      const psychologistsRef = ref(db, 'psychologists');
      
      // Б. Создаем запрос: 
      // "Дай мне 3 записи, которые идут ПОСЛЕ lastLoadedKey"
      const psychologistQuery = query(
        psychologistsRef,
        orderByKey(),              // Сортировка по ID
        startAfter(lastLoadedKey), // Начинаем с ID который последний загрузили
        limitToFirst(PAGE_SIZE)    // Берем только 3 записи
      );
      
      // В. Выполняем запрос
      const snapshot = await get(psychologistQuery);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const psychologistsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        // Г. Проверяем конец данных
        if (psychologistsArray.length < PAGE_SIZE) {
          setHasMore(false);
        }
        
        // Д. Обновляем последний загруженный ID
        if (psychologistsArray.length > 0) {
          const lastKey = psychologistsArray[psychologistsArray.length - 1].id;
          setLastLoadedKey(lastKey);
        }
        
        // Е. Добавляем новых психологов к существующим
        setPsychologists(prev => [...prev, ...psychologistsArray]);
        
        // Ж. Проверяем избранное для новых психологов
        const psychologistIds = psychologistsArray.map(p => p.id);
        const statusResult = await getFavoritesStatus(user?.uid, psychologistIds);
        
        if (statusResult.success) {
          // Добавляем новые статусы к существующим
          setFavoritesStatus(prev => ({
            ...prev,
            ...statusResult.statuses
          }));
        }
      } else {
        setHasMore(false);
      }
      
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // 5. ФУНКЦИЯ: handleFavoriteToggle - ИЗБРАННОЕ
  // ============================================
  
  // Эта функция вызывается когда пользователь кликает на сердечко
  const handleFavoriteToggle = async (psychologistId, psychologistData) => {
    // А. Проверяем авторизован ли пользователь
    if (!user) {
      if (onOpenAuthRequired) {
        onOpenAuthRequired(); // Показываем сообщение "Войдите в аккаунт"
      }
      return; // Выходим из функции
    }
    
    // Б. Смотрим текущий статус: true = в избранном, false = не в избранном
    const currentStatus = favoritesStatus[psychologistId];
    
    try {
      if (currentStatus) {
        // В. Если уже в избранном - УДАЛЯЕМ
        const result = await removeFromFavorites(user.uid, psychologistId);
        if (result.success) {
          // Г. Обновляем статус в нашем состоянии
          setFavoritesStatus(prev => ({
            ...prev,
            [psychologistId]: false
          }));
        }
      } else {
        // Д. Если не в избранном - ДОБАВЛЯЕМ
        const result = await addToFavorites(user.uid, psychologistId, psychologistData);
        if (result.success) {
          // Е. Обновляем статус в нашем состоянии
          setFavoritesStatus(prev => ({
            ...prev,
            [psychologistId]: true
          }));
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  // ============================================
  // 6. ФУНКЦИЯ: sortPsychologists - СОРТИРОВКА
  // ============================================
  
  // Эта функция сортирует список психологов по выбранному фильтру
  const sortPsychologists = (psychologistsList) => {
    // Создаем копию массива (чтобы не менять оригинал)
    const sorted = [...psychologistsList];
    
    // Выбираем способ сортировки
    switch (sortOption) {
      case 'a-to-z':
        // Сортировка по имени от A до Z
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      
      case 'z-to-a':
        // Сортировка по имени от Z до A
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      
      case 'less-to-greater':
        // Сортировка по цене от дешевых к дорогим
        return sorted.sort((a, b) => a.price_per_hour - b.price_per_hour);
      
      case 'greater-to-less':
        // Сортировка по цене от дорогих к дешевым
        return sorted.sort((a, b) => b.price_per_hour - a.price_per_hour);
      
      case 'popular':
        // Сортировка по рейтингу от высокого к низкому
        return sorted.sort((a, b) => b.rating - a.rating);
      
      case 'not-popular':
        // Сортировка по рейтингу от низкого к высокому
        return sorted.sort((a, b) => a.rating - b.rating);
      
      default:
        // Без сортировки
        return sorted;
    }
  };

  // ============================================
  // 7. РЕНДЕРИНГ - ОТОБРАЖЕНИЕ НА ЭКРАНЕ
  // ============================================
  
  // Сортируем психологов по выбранному фильтру
  const sortedPsychologists = sortPsychologists(psychologists);

  return (
    <div className="psychologists-page">
      <main className="psychologists-main">
        <div className="container">
          
          {/* КОМПОНЕНТ ФИЛЬТРОВ */}
          <Filters 
            sortOption={sortOption} 
            setSortOption={setSortOption} 
          />
          
          {/* ИНДИКАТОР ЗАГРУЗКИ (показываем только если еще нет данных) */}
          {isLoading && psychologists.length === 0 ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading psychologists...</p>
            </div>
          ) : (
            <>
              {/* СЕТКА С КАРТОЧКАМИ ПСИХОЛОГОВ */}
              <div className="psychologists-grid">
                {sortedPsychologists.map(psychologist => (
                  <PsychologistCard 
                    key={psychologist.id} // Уникальный ключ для React
                    psychologist={psychologist} // Данные психолога
                    isFavorite={favoritesStatus[psychologist.id] || false} // В избранном?
                    onFavoriteToggle={() => handleFavoriteToggle(psychologist.id, psychologist)}
                    user={user} // Информация о пользователе
                    onOpenAuthRequired={onOpenAuthRequired} // Функция для показа модалки
                  />
                ))}
              </div>
              
              {/* КНОПКА "LOAD MORE" (показываем только если есть что грузить) */}
              {hasMore && !isLoading && (
                <div className="load-more-container">
                  <button 
                    className="load-more-btn"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
          
        </div>
      </main>
    </div>
  );
};

export default PsychologistsPage;