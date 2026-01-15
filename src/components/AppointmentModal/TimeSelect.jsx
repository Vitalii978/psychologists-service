import { useState } from 'react';
import './TimeSelect.css';
import svg from '../../assets/images/icons.svg';

const timeOptions = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
];

const TimeSelect = ({ field, form, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTimeSelect = time => {
    field.onChange(time);
    form.setValue('meetingTime', time);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="time-select-container">
      <div className="time-selected-wrapper">
        <div
          className={`time-selected-display ${disabled ? 'disabled' : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          {field.value ? (
            <span className="time-selected-value">{field.value}</span>
          ) : (
            <span className="time-placeholder">Meeting time</span>
          )}
        </div>

        <button
          type="button"
          className={`time-dropdown-btn ${disabled ? 'disabled' : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <svg className="dropdown-clock-icon">
            <use href={`${svg}#icon-clock`}></use>
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          <div className="time-dropback" onClick={handleClose}></div>

          <div className="time-dropdown">
            <div className="time-dropdown-header">
              <span>Meeting time</span>
            </div>

            <div className="time-options-list">
              {timeOptions.map(time => (
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
