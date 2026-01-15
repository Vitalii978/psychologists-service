import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { loginUser } from '../../../firebase/auth';
import '../RegisterModal/RegisterModal.css';
import svg from '../../../assets/images/icons.svg';

// Схема валидации
const schema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string().required('Password is required').min(6, 'Minimum 6 characters'),
});

function LoginModal({ isOpen, onClose }) {
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
      // Вызываем функцию логина из auth.js
      const result = await loginUser(data.email, data.password);
      
      if (result.success) {
        // Успешный логин - закрываем модалку
        handleClose();
      } else {
        // Ошибка от Firebase - показываем сообщение
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      // Непредвиденная ошибка
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
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
          <h2>Log In</h2>
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
            Welcome back! Please enter your credentials to access your account 
            and continue your search for a psychologist.
          </p>
        </div>
        
        {/* Сообщение об ошибке от Firebase */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        {/* Форма логина */}
        <form className="form-group" onSubmit={handleSubmit(onSubmit)}>
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
            {loading ? 'Loading...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;