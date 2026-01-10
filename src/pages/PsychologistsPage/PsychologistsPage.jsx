import { useState, useEffect } from 'react';
import './PsychologistsPage.css';
import PsychologistCard from '../../components/PsychologistCard/PsychologistCard';
import Filters from '../../components/Filters/Filters';
import { ref, get } from 'firebase/database';
import { db } from '../../firebase/config';
import { getFavoritesStatus, addToFavorites, removeFromFavorites } from '../../firebase/favorites';

const PsychologistsPage = ({ user, onOpenAuthRequired }) => {
  const [sortOption, setSortOption] = useState('show-all');
  const [visibleCount, setVisibleCount] = useState(3);
  const [psychologists, setPsychologists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoritesStatus, setFavoritesStatus] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const psychologistsRef = ref(db, 'psychologists');
        const snapshot = await get(psychologistsRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          const psychologistsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          
          setPsychologists(psychologistsArray);
          
          const psychologistIds = psychologistsArray.map(p => p.id);
          const statusResult = await getFavoritesStatus(user?.uid, psychologistIds);
          
          if (statusResult.success) {
            setFavoritesStatus(statusResult.statuses);
          }
        } else {
          setPsychologists([]);
        }
        
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  const handleFavoriteToggle = async (psychologistId, psychologistData) => {
    if (!user) {
      if (onOpenAuthRequired) {
        onOpenAuthRequired();
      }
      return;
    }
    
    const currentStatus = favoritesStatus[psychologistId];
    
    try {
      if (currentStatus) {
        const result = await removeFromFavorites(user.uid, psychologistId);
        if (result.success) {
          setFavoritesStatus(prev => ({
            ...prev,
            [psychologistId]: false
          }));
        }
      } else {
        const result = await addToFavorites(user.uid, psychologistId, psychologistData);
        if (result.success) {
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
          
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading psychologists...</p>
            </div>
          ) : (
            <>
              <div className="psychologists-grid">
                {visiblePsychologists.map(psychologist => (
                  <PsychologistCard 
                    key={psychologist.id}
                    psychologist={psychologist}
                    isFavorite={favoritesStatus[psychologist.id] || false}
                    onFavoriteToggle={() => handleFavoriteToggle(psychologist.id, psychologist)}
                    user={user}
                    onOpenAuthRequired={onOpenAuthRequired} // ПЕРЕДАЕМ ФУНКЦИЮ
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