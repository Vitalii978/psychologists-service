import { useState, useEffect, useCallback } from 'react';
import './PsychologistsPage.css';
import PsychologistCard from '../../components/PsychologistCard/PsychologistCard';
import Filters from '../../components/Filters/Filters';
import {
  ref,
  query,
  orderByKey,
  limitToFirst,
  startAfter,
  get,
} from 'firebase/database';
import { db } from '../../firebase/config';
import {
  getFavoritesStatus,
  addToFavorites,
  removeFromFavorites,
} from '../../firebase/favorites';
import svg from '../../assets/images/icons.svg'; 

const PsychologistsPage = ({ user, onOpenAuthRequired }) => {

  const [psychologists, setPsychologists] = useState([]); 
  const [sortOption, setSortOption] = useState('show-all'); 
  const [isLoading, setIsLoading] = useState(true); 
  const [favoritesStatus, setFavoritesStatus] = useState({}); 
  const [lastLoadedKey, setLastLoadedKey] = useState(null); 
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 3; 
  const [showBackToTop, setShowBackToTop] = useState(false);

  
  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', checkScroll);

    checkScroll();

    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);

      const psychologistsRef = ref(db, 'psychologists');
      const psychologistQuery = query(
        psychologistsRef,
        orderByKey(), 
        limitToFirst(PAGE_SIZE)
      );
      
      const snapshot = await get(psychologistQuery);
      if (snapshot.exists()) {
        const data = snapshot.val();

        const psychologistsArray = Object.keys(data).map(key => ({
          id: key, 
          ...data[key], 
        }));

        if (psychologistsArray.length < PAGE_SIZE) {
          setHasMore(false);
        }

        if (psychologistsArray.length > 0) {
          const lastKey = psychologistsArray[psychologistsArray.length - 1].id;
          setLastLoadedKey(lastKey);
        }

        setPsychologists(psychologistsArray);

        const psychologistIds = psychologistsArray.map(p => p.id);
        const statusResult = await getFavoritesStatus(
          user?.uid,
          psychologistIds
        );

        if (statusResult.success) {

          setFavoritesStatus(statusResult.statuses);
        }
      } else {
        setHasMore(false);
        setPsychologists([]);
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]); 

  useEffect(() => {
    setPsychologists([]);
    setLastLoadedKey(null);
    setHasMore(true);
    setFavoritesStatus({});

    loadInitialData();
  }, [loadInitialData]); 


  const handleLoadMore = async () => {
    if (!hasMore) return;
    try {
      setIsLoading(true);

      const psychologistsRef = ref(db, 'psychologists');

      const psychologistQuery = query(
        psychologistsRef,
        orderByKey(), 
        startAfter(lastLoadedKey), 
        limitToFirst(PAGE_SIZE) 
      );

      const snapshot = await get(psychologistQuery);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const psychologistsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));

        if (psychologistsArray.length < PAGE_SIZE) {
          setHasMore(false);
        }

        if (psychologistsArray.length > 0) {
          const lastKey = psychologistsArray[psychologistsArray.length - 1].id;
          setLastLoadedKey(lastKey);
        }

        setPsychologists(prev => [...prev, ...psychologistsArray]);

        const psychologistIds = psychologistsArray.map(p => p.id);
        const statusResult = await getFavoritesStatus(
          user?.uid,
          psychologistIds
        );

        if (statusResult.success) {
          setFavoritesStatus(prev => ({
            ...prev,
            ...statusResult.statuses,
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
            [psychologistId]: false,
          }));
        }
      } else {

        const result = await addToFavorites(
          user.uid,
          psychologistId,
          psychologistData
        );
        if (result.success) {
          setFavoritesStatus(prev => ({
            ...prev,
            [psychologistId]: true,
          }));
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const sortPsychologists = psychologistsList => {

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

  const sortedPsychologists = sortPsychologists(psychologists);

  return (
    <div className="psychologists-page">
      
      <a id="psychologists-top" className="page-anchor"></a>
      <main className="psychologists-main">
        <div className="container">
          
          <Filters sortOption={sortOption} setSortOption={setSortOption} />

          {isLoading && psychologists.length === 0 ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading psychologists...</p>
            </div>
          ) : (
            <>

              <div className="psychologists-grid">
                {sortedPsychologists.map(psychologist => (
                  <PsychologistCard
                    key={psychologist.id} 
                    psychologist={psychologist} 
                    isFavorite={favoritesStatus[psychologist.id] || false}
                    onFavoriteToggle={() =>
                      handleFavoriteToggle(psychologist.id, psychologist)
                    }
                    user={user} 
                    onOpenAuthRequired={onOpenAuthRequired}
                  />
                ))}
              </div>

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
              {showBackToTop && (
                <a
                  href="#psychologists-top"
                  className="back-to-top-button"
                  aria-label="Back to top"
                >
                  <svg className="back-to-top-icon">
                    <use href={`${svg}#icon-up`}></use>
                  </svg>
                </a>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PsychologistsPage;
