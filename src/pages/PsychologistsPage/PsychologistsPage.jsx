import { useState, useEffect } from 'react';
import './PsychologistsPage.css';
import PsychologistCard from '../../components/PsychologistCard/PsychologistCard';
import Filters from '../../components/Filters/Filters';
import { ref, get } from 'firebase/database';
import { db } from '../../firebase/config'; // путь проверь


const PsychologistsPage = () => {
  const [sortOption, setSortOption] = useState('show-all');
  const [visibleCount, setVisibleCount] = useState(3);
  const [psychologists, setPsychologists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

   useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Загружаем психологов из Firebase...');
        
        // 1. Загружаем психологов из Firebase
        const psychologistsRef = ref(db, 'psychologists');
        const snapshot = await get(psychologistsRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('✅ Данные получены, психологов:', Object.keys(data).length);
          
          // Преобразуем объект в массив
          const psychologistsArray = Object.keys(data).map(key => ({
            id: key, // это "0", "1", "2", ... "31"
            ...data[key]
          }));
          
          setPsychologists(psychologistsArray);
          console.log('✅ Психологи установлены в состояние:', psychologistsArray.length);
        } else {
          console.log('❌ В базе нет психологов');
          setPsychologists([]);
        }
        
        // 2. Загружаем избранных из localStorage
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
        
      } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        // Можно показать сообщение об ошибке
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Функция для добавления/удаления из избранного
  const handleFavoriteToggle = (psychologistId) => {
    setFavorites(prevFavorites => {
      let updatedFavorites;
      
      if (prevFavorites.includes(psychologistId)) {
        // Удаляем из избранного
        updatedFavorites = prevFavorites.filter(id => id !== psychologistId);
      } else {
        // Добавляем в избранное
        updatedFavorites = [...prevFavorites, psychologistId];
      }
      
      // Сохраняем в localStorage
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const sortPsychologists = (psychologistsList) => {
    const sorted = [...psychologistsList];
    
    switch (sortOption) {
      case 'a-to-z':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'z-to-a':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'less-to-greater':
        return sorted.sort((a, b) => a.price_per_hour - b.price_per_hour);
      case 'greater-to-less':
        return sorted.sort((a, b) => b.price_per_hour - a.price_per_hour);
      case 'popular':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'not-popular':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'show-all':
      default:
        return sorted;
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const sortedPsychologists = sortPsychologists(psychologists);
  const visiblePsychologists = sortedPsychologists.slice(0, visibleCount);

  return (
  <div className="psychologists-page">
    <main className="psychologists-main">
      <div className="container">
        
        <Filters sortOption={sortOption} setSortOption={setSortOption} />
        
        {/* Показываем спиннер загрузки */}
        {isLoading && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            padding: '50px 0'
          }}>
            <div className="loading-spinner"></div>
            <p>Загружаем психологов из базы...</p>
          </div>
        )}
        
        {/* Показываем психологов когда загрузилось */}
        {!isLoading && (
          <>
            <div className="psychologists-grid">
              {visiblePsychologists.map(psychologist => (
                <PsychologistCard 
                  key={psychologist.id}
                  psychologist={psychologist}
                  isFavorite={favorites.includes(psychologist.id)}
                  onFavoriteToggle={() => handleFavoriteToggle(psychologist.id)}
                />
              ))}
            </div>
            
            {visibleCount < psychologists.length && (
              <div className="load-more-container">
                <button 
                  className="load-more-btn"
                  onClick={handleLoadMore}
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