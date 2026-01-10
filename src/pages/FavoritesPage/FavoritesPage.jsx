import { useState, useEffect } from 'react';
import './FavoritesPage.css';
import PsychologistCard from '../../components/PsychologistCard/PsychologistCard';
import Filters from '../../components/Filters/Filters';
import { getUserFavorites, removeFromFavorites } from '../../firebase/favorites';

const FavoritesPage = ({ user, onOpenAuthRequired }) => { // ДОБАВЛЯЕМ onOpenAuthRequired
  const [sortOption, setSortOption] = useState('show-all');
  const [visibleCount, setVisibleCount] = useState(3);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        
        if (!user) {
          setFavorites([]);
          setIsLoading(false);
          return;
        }
        
        const result = await getUserFavorites(user.uid);
        
        if (result.success) {
          setFavorites(result.favorites);
        } else {
          console.error('Error:', result.error);
          setFavorites([]);
        }
        
      } catch (error) {
        console.error('Error:', error);
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFavorites();
  }, [user]);

  const handleRemoveFavorite = async (psychologistId) => {
    if (!user) return;
    
    try {
      const result = await removeFromFavorites(user.uid, psychologistId);
      
      if (result.success) {
        setFavorites(prev => 
          prev.filter(psych => psych.id !== psychologistId)
        );
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sortFavorites = (favoritesList) => {
    const sorted = [...favoritesList];
    
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

  const sortedFavorites = sortFavorites(favorites);
  const visibleFavorites = sortedFavorites.slice(0, visibleCount);
  const isEmpty = favorites.length === 0;

  return (
    <div className="favorites-page">
      <main className="favorites-main">
        <div className="container">
          
          <Filters sortOption={sortOption} setSortOption={setSortOption} />
          
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading your favorites...</p>
            </div>
          ) : (
            isEmpty ? (
              <div className="empty-favorites">
                <div className="empty-icon">❤️</div>
                <h2 className="empty-title">No favorites yet</h2>
                <p className="empty-message">
                  You haven't added any psychologists to your favorites list.
                  Browse psychologists and click the heart icon to add them here.
                </p>
                <button 
                  className="browse-btn"
                  onClick={() => window.location.href = '/psychologists'}
                >
                  Browse Psychologists
                </button>
              </div>
            ) : (
              <>
                <div className="favorites-grid">
                  {visibleFavorites.map(psychologist => (
                    <PsychologistCard 
                      key={psychologist.id}
                      psychologist={psychologist}
                      isFavorite={true}
                      onRemoveFavorite={() => handleRemoveFavorite(psychologist.id)}
                      user={user}
                      onOpenAuthRequired={onOpenAuthRequired} // ПЕРЕДАЕМ ФУНКЦИЮ
                    />
                  ))}
                </div>
                
                {visibleCount < favorites.length && (
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
            )
          )}
          
        </div>
      </main>
    </div>
  );
};

export default FavoritesPage;