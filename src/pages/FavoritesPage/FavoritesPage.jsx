import { useState, useEffect } from 'react';
import './FavoritesPage.css';
import PsychologistCard from '../../components/PsychologistCard/PsychologistCard';
import Filters from '../../components/Filters/Filters';

const mockFavorites = [
  {
    id: 1,
    name: "Dr. Sarah Davis",
    avatar_url: "",
    experience: "12 years",
    reviews: [
      { reviewer: "Michael Brown", comment: "Dr. Davis has been a great help in managing my depression. Her insights have been valuable.", rating: 4.5 },
      { reviewer: "Linda Johnson", comment: "I'm very satisfied with Dr. Davis's therapy. She's understanding and empathetic.", rating: 5 }
    ],
    price_per_hour: 120,
    rating: 4.75,
    license: "Licensed Psychologist (License #67890)",
    specialization: "Depression and Mood Disorders",
    initial_consultation: "Free 45-minute initial consultation",
    about: "Dr. Sarah Davis is a highly experienced and licensed psychologist specializing in Depression and Mood Disorders. With 12 years of practice, she has helped numerous individuals overcome their depression and regain control of their lives. Dr. Davis is known for her empathetic and understanding approach to therapy, making her clients feel comfortable and supported throughout their journey to better mental health."
  },
  {
    id: 3,
    name: "Dr. Emily Wilson",
    avatar_url: "",
    experience: "10 years",
    reviews: [
      { reviewer: "John D.", comment: "Excellent family therapist.", rating: 4.9 },
      { reviewer: "Maria S.", comment: "Great with relationship issues.", rating: 4.8 }
    ],
    price_per_hour: 110,
    rating: 4.9,
    license: "Licensed Psychologist (License #54321)",
    specialization: "Family Therapy, Relationships",
    initial_consultation: "Free 40-minute consultation",
    about: "Family and relationship therapist with 10 years of experience."
  },
  {
    id: 4,
    name: "Dr. Robert Johnson",
    avatar_url: "",
    experience: "15 years",
    reviews: [
      { reviewer: "Tom B.", comment: "Very experienced therapist.", rating: 4.7 },
      { reviewer: "Emma W.", comment: "Professional approach.", rating: 4.6 }
    ],
    price_per_hour: 130,
    rating: 4.7,
    license: "Licensed Psychologist (License #98765)",
    specialization: "Trauma, PTSD",
    initial_consultation: "Free 50-minute consultation",
    about: "Specializes in trauma and PTSD therapy with 15 years of experience."
  }
];

const FavoritesPage = () => {
  const [sortOption, setSortOption] = useState('show-all');
  const [visibleCount, setVisibleCount] = useState(3);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Загружаем избранных из localStorage
      const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      
      if (storedFavorites.length > 0) {
        // Фильтруем mockFavorites по ID из localStorage
        const filteredFavorites = mockFavorites.filter(psych => 
          storedFavorites.includes(psych.id)
        );
        setFavorites(filteredFavorites);
      } else {
        setFavorites([]);
      }
      
      setIsLoading(false);
    };
    
    loadFavorites();
  }, []);

  // Функция для удаления психолога из избранного
  const handleRemoveFavorite = (psychologistId) => {
    // 1. Обновляем состояние
    setFavorites(prevFavorites => 
      prevFavorites.filter(psych => psych.id !== psychologistId)
    );
    
    // 2. Обновляем localStorage
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const updatedFavorites = storedFavorites.filter(id => id !== psychologistId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
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
      case 'show-all':
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
          
          {/* Используем тот же компонент Filters */}
          <Filters sortOption={sortOption} setSortOption={setSortOption} />
          
          {/* Пока идет загрузка - показываем спиннер/сообщение */}
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading your favorites...</p>
            </div>
          ) : (
            // Если загрузка завершена, проверяем: есть ли избранные?
            isEmpty ? (
              // Если список пустой - показываем сообщение
              <div className="empty-favorites">
                <div className="empty-icon">❤️</div>
                <h2 className="empty-title">No favorites yet</h2>
                <p className="empty-message">
                  You haven't added any psychologists to your favorites list.
                  Browse psychologists and click the heart icon to add them here.
                </p>
                {/* Кнопка для перехода к психологам */}
                <button 
                  className="browse-btn"
                  onClick={() => window.location.href = '/psychologists'}
                >
                  Browse Psychologists
                </button>
              </div>
            ) : (
              // Если есть избранные - показываем список
              <>
                <div className="favorites-grid">
                  {visibleFavorites.map(psychologist => (
                    <PsychologistCard 
                      key={psychologist.id}
                      psychologist={psychologist}
                      isFavorite={true} // Всегда красное сердечко на странице избранного
                      onRemoveFavorite={handleRemoveFavorite} // Функция для удаления
                    />
                  ))}
                </div>
                
                {/* Кнопка Load More если есть еще карточки */}
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