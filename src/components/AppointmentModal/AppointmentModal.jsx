import { useEffect } from 'react';
import './AppointmentModal.css';
import svg from '../../assets/images/icons.svg';

const AppointmentModal = ({ isOpen, onClose, psychologist }) => {
  // Обработчик Esc для закрытия модального окна
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Обработчик клика на backdrop для закрытия модального окна
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="appointment-modal-overlay" 
      onClick={handleBackdropClick}
    >
      <div className="appointment-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="appointment-modal-header">
          <h3 className="appointment-modal-title">
            Make an appointment with {psychologist.name}
          </h3>
          <button 
            className="appointment-modal-close-btn"
            onClick={onClose}
          >
            <svg>
              <use href={`${svg}#icon-close`} />
            </svg>
          </button>
        </div>
        
        <div className="appointment-modal-body">
          <p>Form will be here with react-hook-form & yup validation</p>
        </div>
        
        <div className="appointment-modal-footer">
          <button 
            className="appointment-btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="appointment-btn-primary"
            onClick={onClose}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;