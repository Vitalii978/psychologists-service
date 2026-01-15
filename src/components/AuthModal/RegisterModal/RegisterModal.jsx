import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { registerUser } from '../../../firebase/auth';
import './RegisterModal.css';
import svg from '../../../assets/images/icons.svg';

// Схема валидации
const schema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Minimum 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string().required('Password is required').min(6, 'Minimum 6 characters'),
});

function RegisterModal({ isOpen, onClose }) {
  // Состояния компонента
  const [error, setError] = useState(''); // Для ошибок Firebase
  const [loading, setLoading] = useState(false); // Индикатор загрузки
  const [showPassword, setShowPassword] = useState(false); // Показать/скрыть пароль

  // Настройка react-hook-form
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Функция закрытия модалки
  const handleClose = useCallback(() => {
    onClose();
    reset();
    setError('');
    setShowPassword(false);
  }, [onClose, reset]);

  // Обработка отправки формы
  const onSubmit = async (data) => {
    setError(''); // Очищаем предыдущие ошибки
    setLoading(true); // Включаем загрузку
    
    try {
      // Вызываем функцию регистрации из auth.js
      const result = await registerUser(data.email, data.password, data.name);
      
      if (result.success) {
        // Успешная регистрация - закрываем модалку
        handleClose();
      } else {
        // Ошибка от Firebase - показываем сообщение
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      // Непредвиденная ошибка
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false); // Выключаем загрузку
    }
  };

  // Закрытие по клику на фон
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Закрытие по клавише Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Registration</h2>
        </div>  
        
        {/* Кнопка закрытия модалки */}
        <button className="close-btn" onClick={handleClose}>
          <svg>
            <use href={`${svg}#icon-close`}></use>
          </svg>
        </button>
        
        {/* Поясняющий текст */}
        <div className="modal-description">
          <p className="description-text">
            Thank you for your interest in our platform! In order to register, 
            we need some information. Please provide us with the following information.
          </p>
        </div>
        
        {/* Сообщение об ошибке от Firebase */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        {/* Форма регистрации */}
        <form className="form-group" onSubmit={handleSubmit(onSubmit)}>
          {/* Поле Name */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Name"
              className={errors.name ? 'input-error' : ''}
              {...register('name')}
              disabled={loading}
            />
            {errors.name && (
              <span className="error">{errors.name.message}</span>
            )}
          </div>
          
          {/* Поле Email */}
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              className={errors.email ? 'input-error' : ''}
              {...register('email')}
              disabled={loading}
            />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>
          
          {/* Поле Password с кнопкой показа/скрытия */}
          <div className="input-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={errors.password ? 'input-error' : ''}
              {...register('password')}
              disabled={loading}
            />
            <button 
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={loading}
            >
              <svg className="toggle-password-icon">
                <use href={showPassword ? `${svg}#icon-eye` : `${svg}#icon-eye-off`}></use>
              </svg>
            </button>
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>
          
          {/* Кнопка отправки формы */}
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;