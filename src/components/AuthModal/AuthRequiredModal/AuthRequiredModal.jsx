import { useEffect } from 'react';
import './AuthRequiredModal.css';
import svg from '../../../assets/images/icons.svg';

const AuthRequiredModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content auth-required-modal">
        {/* Крестик как декоративный элемент */}
        <div className="decorative-close">
          <svg width="24" height="24">
            <use href={`${svg}#icon-close`}></use>
          </svg>
        </div>
        
        <div className="auth-required-content">
          <div className="auth-required-icon">!</div>
          
          <p className="auth-required-message">
            This feature is available only for registered users. Please log in.
          </p>
          
          <button 
            className="auth-required-btn"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredModal;