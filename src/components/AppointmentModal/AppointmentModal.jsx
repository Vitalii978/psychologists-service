// ============================================
// ФАЙЛ: src/components/AppointmentModal/AppointmentModal.jsx
// ОБНОВЛЕННАЯ ВЕРСИЯ С СОХРАНЕНИЕМ В FIREBASE
// ============================================

import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './AppointmentModal.css';
import svg from '../../assets/images/icons.svg';
import TimeSelect from './TimeSelect';
import { saveAppointment } from '../../firebase/appointments';

// Схема валидации
const appointmentSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^\+380\d{9}$/,
      'Phone number must start with +380 and have 9 digits after'
    ),
  meetingTime: yup
    .string()
    .required('Meeting time is required')
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Please enter a valid time (HH:MM)'
    ),
  comment: yup
    .string()
    .required('Comment is required')
    .min(10, 'Comment must be at least 10 characters'),
});

const AppointmentModal = ({ isOpen, onClose, psychologist, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(appointmentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '+380',
      meetingTime: '09:00',
      comment: '',
    },
  });

  // Функция закрытия с очисткой состояний
  const handleClose = useCallback(() => {
    onClose();
    reset();
    setSubmitError('');
    setSubmitSuccess(false);
  }, [onClose, reset]);

  // Функция отправки формы с сохранением в Firebase
  const onSubmit = async data => {
    if (!psychologist) {
      setSubmitError('Psychologist information is missing');
      return;
    }

    setIsLoading(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const result = await saveAppointment(data, psychologist.id, user?.uid);

      if (result.success) {
        setSubmitSuccess(true);

        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setSubmitError(result.error || 'Failed to save appointment');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred');
      console.error('Appointment submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик Escape
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  // Закрытие по клику на backdrop
  const handleBackdropClick = useCallback(
    e => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div
        className="modal-content-appointment"
        onClick={e => e.stopPropagation()}
      >
        {/* Заголовок с кнопкой закрытия */}
        <div className="modal-header-appointment">
          <h2 className="modal-title">
            Make an appointment with a psychologist
          </h2>
          <button className="close-btn-appointment" onClick={handleClose}>
            <svg>
              <use href={`${svg}#icon-close`}></use>
            </svg>
          </button>
        </div>

        {/* Описание */}
        <div className="modal-description">
          <p className="description-text">
            You are on the verge of changing your life for the better. Fill out
            the short form below to book your personal appointment with a
            professional psychologist. We guarantee confidentiality and respect
            for your privacy.
          </p>
        </div>

        {/* Информация о психологе */}
        <div className="psychologist-info-with-photo">
          <div className="psychologist-photo">
            {psychologist?.avatar_url ? (
              <img
                src={psychologist.avatar_url}
                alt={psychologist.name}
                className="psychologist-avatar-appointment"
              />
            ) : (
              <div className="psychologist-avatar-placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>
          <div className="psychologist-details">
            <p className="psychologist-title">Your psychologist</p>
            <p className="psychologist-name-label">
              {psychologist?.name || 'Psychologist'}
            </p>
          </div>
        </div>

        {/* Сообщения об ошибке и успехе */}
        {submitError && <div className="form-error-message">{submitError}</div>}

        {submitSuccess && (
          <div className="form-success-message">
            ✅ Appointment request sent successfully! The window will close
            automatically.
          </div>
        )}

        {/* Форма */}
        <form className="appointment-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Поле Name */}
          <div className="form-group">
            <input
              type="text"
              id="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              {...register('name')}
              placeholder="Name"
              disabled={isLoading || submitSuccess}
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
              disabled={isLoading || submitSuccess}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          {/* Поля Phone и Meeting Time */}
          <div className="form-row">
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
                    onChange={e => {
                      const value = e.target.value;
                      if (value.startsWith('+380')) {
                        field.onChange(value);
                      } else {
                        field.onChange('+380');
                      }
                    }}
                    placeholder="+380"
                    disabled={isLoading || submitSuccess}
                  />
                )}
              />
              {errors.phone && (
                <span className="error-message">{errors.phone.message}</span>
              )}
            </div>

            <div className="form-group form-group-half">
              <Controller
                name="meetingTime"
                control={control}
                defaultValue="09:00"
                render={({ field }) => (
                  <TimeSelect
                    field={field}
                    form={{ setValue }}
                    disabled={isLoading || submitSuccess}
                  />
                )}
              />
              {errors.meetingTime && (
                <span className="error-message">
                  {errors.meetingTime.message}
                </span>
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
              disabled={isLoading || submitSuccess}
            />
            {errors.comment && (
              <span className="error-message">{errors.comment.message}</span>
            )}
          </div>

          {/* Кнопка Send */}
          <div className="form-buttons">
            <button
              type="submit"
              className="submit-btn-full"
              disabled={isLoading || submitSuccess}
            >
              {isLoading ? 'Sending...' : submitSuccess ? 'Sent!' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
