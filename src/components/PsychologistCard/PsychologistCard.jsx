// ============================================
// ФАЙЛ: src/components/PsychologistCard/PsychologistCard.jsx
// ВЕРСИЯ: Возвращаем как было, только логика Firebase
// ============================================

import { useState } from 'react';
import './PsychologistCard.css';
import svg from '../../assets/images/icons.svg';
import AppointmentModal from '../AppointmentModal/AppointmentModal';

const PsychologistCard = ({ 
  psychologist, 
  isFavorite = false, 
  onRemoveFavorite = null,
  onFavoriteToggle = null 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const handleFavoriteClick = () => {
    if (onRemoveFavorite) {
      // На странице Favorites: удаляем карточку через Firebase
      onRemoveFavorite(psychologist.id);
    } else if (onFavoriteToggle) {
      // На странице Psychologists: переключаем состояние через Firebase
      onFavoriteToggle();
    }
  };

  const handleReadMore = () => {
    setShowDetails(!showDetails);
  };

  const handleAppointmentClick = () => {
    setShowAppointmentModal(true);
  };

  const handleCloseModal = () => {
    setShowAppointmentModal(false);
  };

  return (
    <>
      <div className="psychologist-card">
        <div className="card-left">
          <div className="psychologist-avatar">
            {psychologist.avatar_url ? (
              <img 
                src={psychologist.avatar_url} 
                alt={psychologist.name}
                className="avatar-image"
              />
            ) : (
              <div className="avatar-placeholder">
                <svg>
                  <use href={`${svg}#icon-user`} />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        <div className="card-right">
          <div className="card-top-row">
            <div className="title-section">
              <div className="psychologist-title">Psychologist</div>
              <h3 className="psychologist-name">{psychologist.name}</h3>
            </div>
            
            <div className="rating-price-favorite">
              <div className="rating-price-container">
                 <div className="rating-block">
                   <svg className="star-icon">
                     <use href={`${svg}#icon-star`} />
                   </svg>
                   
                   <span className="rating-label">Rating:</span>
                   <span className="rating-value">{psychologist.rating}</span>
                   
                   <span className="rating-separator">|</span>
                 </div>
                 <div className="price-block">
                   <span className="price-label">Price / 1 hour:</span>
                   <span className="price-value">{psychologist.price_per_hour}$</span>
                 </div>
              </div>
              
              {/* Кнопка сердечка - оставляем как было */}
              <button 
                className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                onClick={handleFavoriteClick}
              >
                <svg>
                  <use href={`${svg}#icon-heart`} />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="info-blocks-container">
            <div className="info-block experience-block">
              <span className="info-label">Experience:</span>
              <span className="info-value">{psychologist.experience}</span>
            </div>
            
            <div className="info-block license-block">
              <span className="info-label">License:</span>
              <span className="info-value">{psychologist.license}</span>
            </div>
            
            <div className="info-block specialization-block">
              <span className="info-label">Specialization:</span>
              <span className="info-value">{psychologist.specialization}</span>
            </div>
            
            <div className="info-block consultation-block">
              <span className="info-label">Initial consultation:</span>
              <span className="info-value">{psychologist.initial_consultation}</span>
            </div>
          </div>
          
          <div className="description-section">
            <p className="about-text">
              {psychologist.about}
            </p>
            
            <button 
              className="read-more-btn"
              onClick={handleReadMore}
            >
              {showDetails ? 'Show less' : 'Read more'}
            </button>
          </div>
          
          {showDetails && (
            <div className="detailed-info">
              <div className="reviews-section">
                <div className="reviews-list">
                  {psychologist.reviews.map((review, index) => (
                    <div key={index} className="review-item">
                      <div className="reviewer-header">
                        <div className="reviewer-avatar">
                          {review.reviewer.charAt(0)}
                        </div>
                        <div className="reviewer-info">
                          <span className="reviewer-name">{review.reviewer}</span>
                          <div className="review-rating">
                            <span className="rating-number">{review.rating}</span>
                            <svg>
                              <use href={`${svg}#icon-star`} />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="appointment-section">
                <button 
                  className="appointment-btn"
                  onClick={handleAppointmentClick}
                >
                  Make an appointment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AppointmentModal 
        isOpen={showAppointmentModal}
        onClose={handleCloseModal}
        psychologist={psychologist}
      />
    </>
  );
};

export default PsychologistCard;