// Импортируем необходимые хуки и библиотеки
import { useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form'; // Добавили Controller
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './AppointmentModal.css';
import svg from '../../assets/images/icons.svg';
import TimeSelect from './TimeSelect'; // Импортируем наш компонент выбора времени

// Схема валидации с помощью Yup
const appointmentSchema = yup.object({
  // Поле "Name" - обязательное, минимум 2 символа
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
    
  // Поле "Email" - обязательное, должен быть валидный email
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email'),
    
  // Поле "Phone" - обязательное, должен начинаться с +380 и иметь 9 цифр после
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\+380\d{9}$/, 'Phone number must start with +380 and have 9 digits after'),
  
  // Поле "Meeting time" - обязательное, формат ЧЧ:ММ
  meetingTime: yup
    .string()
    .required('Meeting time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)'),
    
  // Поле "Comment" - обязательное, минимум 10 символов
  comment: yup
    .string()
    .required('Comment is required')
    .min(10, 'Comment must be at least 10 characters'),
});

const AppointmentModal = ({ isOpen, onClose, psychologist }) => {
  // Используем хук useForm для управления формой
  const {
    register,           // Функция для регистрации полей ввода
    handleSubmit,       // Функция для обработки отправки формы
    control,            // Контроллер для управления кастомными полями (добавили)
    setValue,           // Функция для установки значений полей (добавили)
    formState: { errors }, // Объект с ошибками валидации
    reset,              // Функция для сброса формы
  } = useForm({
    // Подключаем схему валидации Yup
    resolver: yupResolver(appointmentSchema),
    // Начальные значения полей
    defaultValues: {
      name: '',
      email: '',
      phone: '+380',      // Начинается с +380
      meetingTime: '00:00', // По умолчанию 00:00
      comment: '',
    }
  });

  // Мемоизируем функцию закрытия с useCallback
  const handleClose = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  // Функция отправки формы
  const onSubmit = (data) => {
    console.log('Form data:', data);
    console.log('Psychologist:', psychologist?.name);
    
    // Здесь будет отправка на сервер
    handleClose();
  };

  // Эффект для обработки клавиши Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27 && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  // Если окно не открыто - не рендерим ничего
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Заголовок с кнопкой закрытия */}
        <div className="modal-header">
          <h2 className="modal-title">
            Make an appointment with a psychologists
          </h2>
          
          {/* Кнопка закрытия с SVG иконкой */}
          <button className="close-btn" onClick={handleClose}>
            <svg>
              <use href={`${svg}#icon-close`}></use>
            </svg>
          </button>
        </div>
        
        {/* Описание под заголовком */}
        <div className="modal-description">
          <p className="description-text">
            You are on the verge of changing your life for the better. Fill out the short form below to book your personal appointment with a professional psychologist. We guarantee confidentiality and respect for your privacy.
          </p>
        </div>
        
        {/* Информация о психологе с фото */}
        <div className="psychologist-info-with-photo">
          {/* Фото психолога */}
          <div className="psychologist-photo">
            {psychologist?.avatar_url ? (
              <img 
                src={psychologist.avatar_url} 
                alt={psychologist.name}
                className="psychologist-avatar"
              />
            ) : (
              <div className="psychologist-avatar-placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            )}
          </div>
          
          {/* Имя психолога */}
          <div className="psychologist-details">
            <p className="psychologist-title">
              Your psychologist
            </p>
            <p className="psychologist-name-label">
              {psychologist?.name || 'Dr. Sarah Davis'}
            </p>
          </div>
        </div>
        
        {/* Форма для записи */}
        <form className="appointment-form" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Поле Name */}
          <div className="form-group">
            <input
              type="text"
              id="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              {...register('name')}
              placeholder="Name"
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </div>
          
          {/* Поле Email */}
          <div className="form-group">
            <input
              type="email"
              id="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              {...register('email')}
              placeholder="Email"
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>
          
          {/* Поля Phone и Meeting Time в одной строке */}
          <div className="form-row">
            {/* Поле Phone с Controller для кастомной логики */}
            <div className="form-group form-group-half">
              <Controller
                name="phone"
                control={control}
                defaultValue="+380"
                render={({ field }) => (
                  <input
                    type="tel"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Разрешаем только +380 в начале
                      if (value.startsWith('+380')) {
                        field.onChange(value);
                      } else {
                        field.onChange('+380');
                      }
                    }}
                    placeholder="+380"
                  />
                )}
              />
              {errors.phone && (
                <span className="error-message">{errors.phone.message}</span>
              )}
            </div>
            
            {/* Поле Meeting Time с кастомным TimeSelect компонентом */}
            <div className="form-group form-group-half">
              <Controller
                name="meetingTime"
                control={control}
                defaultValue="00:00"
                render={({ field }) => (
                  <TimeSelect field={field} form={{ setValue }} />
                )}
              />
              {errors.meetingTime && (
                <span className="error-message">{errors.meetingTime.message}</span>
              )}
            </div>
          </div>
          
          {/* Поле Comment */}
          <div className="form-group">
            <textarea
              id="comment"
              className={`form-textarea ${errors.comment ? 'error' : ''}`}
              {...register('comment')}
              placeholder="Comment"
              rows="4"
            />
            {errors.comment && (
              <span className="error-message">{errors.comment.message}</span>
            )}
          </div>
          
          {/* Кнопка Send на всю ширину */}
          <div className="form-buttons">
            <button
              type="submit"
              className="submit-btn-full"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;