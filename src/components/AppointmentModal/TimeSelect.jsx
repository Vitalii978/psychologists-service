import { useState } from 'react';
import './TimeSelect.css';
import svg from '../../assets/images/icons.svg'; // Импортируем SVG спрайт

// Массив всех возможных времен (каждые 30 минут от 00:00 до 23:30)
const timeOptions = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', 
];

// Компонент для выбора времени
const TimeSelect = ({ field, form }) => {
  // Состояние для открытия/закрытия выпадающего списка
  const [isOpen, setIsOpen] = useState(false);

  // Функция выбора времени
  const handleTimeSelect = (time) => {
    // Обновляем значение в форме
    field.onChange(time);
    form.setValue('meetingTime', time);
    // Закрываем список
    setIsOpen(false);
  };

  // Функция закрытия при клике вне компонента
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="time-select-container">
      {/* Обертка для выбранного времени и кнопки */}
      <div className="time-selected-wrapper">
      
        {/* Отображение выбранного времени или плейсхолдера */}
        <div 
          className="time-selected-display"
          onClick={() => setIsOpen(!isOpen)}
        >
          {field.value ? (
            <span className="time-selected-value">{field.value}</span>
          ) : (
            <span className="time-placeholder">Meeting time</span>
          )}
        </div>
        
        {/* Кнопка для раскрытия списка */}
        <button 
          type="button"
          className="time-dropdown-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
            <svg className="dropdown-clock-icon">
                <use href={`${svg}#icon-clock`}></use>
            </svg>

        </button>
      </div>

      {/* Выпадающий список (показывается только если isOpen = true) */}
      {isOpen && (
        <>
          {/* Затемнение фона при открытом списке */}
          <div className="time-dropback" onClick={handleClose}></div>
          
          <div className="time-dropdown">
            {/* Заголовок выпадающего списка */}
            <div className="time-dropdown-header">
                <span>Meeting time</span>
            </div>
            
            {/* Список вариантов времени */}
            <div className="time-options-list">
              {timeOptions.map((time) => (
                <div
                  key={time}
                  className={`time-option ${field.value === time ? 'selected' : ''}`}
                  onClick={() => handleTimeSelect(time)}
                >
                  <span className="time-option-value">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TimeSelect;