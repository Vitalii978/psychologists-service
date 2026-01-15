import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { registerUser } from '../../../firebase/auth';
import './RegisterModal.css';
import svg from '../../../assets/images/icons.svg';

const schema = yup.object({
  name: yup.string().required('Name required').min(2, 'Min 2 chars'),
  email: yup.string().required('Email required').email('Invalid email'),
  password: yup.string().required('Password required').min(6, 'Min 6 chars'),
});

function RegisterModal({ isOpen, onClose }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const handleClose = useCallback(() => {
    onClose();
    reset();
    setError('');
    setShowPassword(false);
  }, [onClose, reset]);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    
    const result = await registerUser(data.email, data.password, data.name);
    
    if (result.success) {
      handleClose();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

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
        
        {/* КРЕСТИК ДЛЯ ЗАКРЫТИЯ МОДАЛЬНОГО ОКНА */}
          <button className="close-btn" onClick={handleClose}>
            <svg>
              <use href={`${svg}#icon-close`}></use>
            </svg>
          </button>
        
        
        {/* ДОБАВЛЯЕМ ПОЯСНЯЮЩИЙ ТЕКСТ */}
        <div className="modal-description">
          <p className="description-text">
            Thank you for your interest in our platform! In order to register, 
            we need some information. Please provide us with the following information.
          </p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="form-group" onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Name"
              className={errors.name ? 'input-error' : ''}
              {...register('name')}
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>
          
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              className={errors.email ? 'input-error' : ''}
              {...register('email')}
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>
          
          <div className="input-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={errors.password ? 'input-error' : ''}
              {...register('password')}
            />
            <button 
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <svg className="toggle-password-icon">
                <use href={showPassword ? `${svg}#icon-eye` : `${svg}#icon-eye-off`}></use>
              </svg>
            </button>
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;