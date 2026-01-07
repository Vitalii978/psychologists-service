// import { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import './LoginModal.css';

// const schema = yup.object({
//   email: yup.string().required('Email required').email('Invalid email'),
//   password: yup.string().required('Password required').min(6, 'Min 6 chars'),
// });

// function LoginModal({ isOpen, onClose, onLogin }) { // Добавляем onLogin
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
//     console.log('Login data:', data);
//     onLogin(data); // Вызываем функцию входа
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
//           <h2>Log In</h2>
//           <button className="close-btn" onClick={onClose}>×</button>
//         </div>
        
//         <form onSubmit={handleSubmit(onSubmit)}>
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
          
//           <button type="submit" className="submit-btn">Log In</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default LoginModal;




import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { loginUser } from '../../../firebase/auth';
import './LoginModal.css';

const schema = yup.object({
  email: yup.string().required('Email required').email('Invalid email'),
  password: yup.string().required('Password required').min(6, 'Min 6 chars'),
});

function LoginModal({ isOpen, onClose }) {
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
    
    const result = await loginUser(data.email, data.password);
    
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
          <h2>Log In</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)}>
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
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Loading...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;