// import { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import './RegisterModal.css';

// const schema = yup.object({
//   name: yup.string().required('Name required').min(2, 'Min 2 chars'),
//   email: yup.string().required('Email required').email('Invalid email'),
//   password: yup.string().required('Password required').min(6, 'Min 6 chars'),
//   confirmPassword: yup.string()
//     .required('Confirm password')
//     .oneOf([yup.ref('password')], 'Passwords must match'),
// });

// function RegisterModal({ isOpen, onClose, onRegister }) { // Добавляем onRegister
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape') {
//         onClose();
//       }
//     };
    
//     window.addEventListener('keydown', handleEscape);
//     return () => window.removeEventListener('keydown', handleEscape);
//   }, [onClose]);

//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const onSubmit = (data) => {
//     console.log('Register data:', data);
//     onRegister(data); // Вызываем функцию регистрации
//   };

//   const handleBackdropClick = (e) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   if (!isOpen) {
//     return null;
//   }

//   return (
//     <div className="modal-backdrop" onClick={handleBackdropClick}>
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Registration</h2>
//           <button className="close-btn" onClick={onClose}>×</button>
//         </div>
        
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="input-group">
//             <input
//               type="text"
//               placeholder="Name"
//               className={errors.name ? 'input-error' : ''}
//               {...register('name')}
//             />
//             {errors.name && <span className="error">{errors.name.message}</span>}
//           </div>
          
//           <div className="input-group">
//             <input
//               type="email"
//               placeholder="Email"
//               className={errors.email ? 'input-error' : ''}
//               {...register('email')}
//             />
//             {errors.email && <span className="error">{errors.email.message}</span>}
//           </div>
          
//           <div className="input-group">
//             <input
//               type="password"
//               placeholder="Password"
//               className={errors.password ? 'input-error' : ''}
//               {...register('password')}
//             />
//             {errors.password && <span className="error">{errors.password.message}</span>}
//           </div>
          
//           <div className="input-group">
//             <input
//               type="password"
//               placeholder="Confirm Password"
//               className={errors.confirmPassword ? 'input-error' : ''}
//               {...register('confirmPassword')}
//             />
//             {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
//           </div>
          
//           <button type="submit" className="submit-btn">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default RegisterModal;


import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { registerUser } from '../../../firebase/auth';
import './RegisterModal.css';

const schema = yup.object({
  name: yup.string().required('Name required').min(2, 'Min 2 chars'),
  email: yup.string().required('Email required').email('Invalid email'),
  password: yup.string().required('Password required').min(6, 'Min 6 chars'),
  confirmPassword: yup.string()
    .required('Confirm password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

function RegisterModal({ isOpen, onClose }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  // Функция закрытия модалки
  const handleClose = useCallback(() => {
    onClose();
    reset();
    setError('');
  }, [onClose, reset]);

  // Отправка формы
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

  // Закрытие по backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Закрытие по Escape
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
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)}>
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
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              className={errors.password ? 'input-error' : ''}
              {...register('password')}
            />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              className={errors.confirmPassword ? 'input-error' : ''}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;