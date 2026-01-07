// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import HomePage from './pages/HomePage/HomePage';
// import PsychologistsPage from './pages/PsychologistsPage/PsychologistsPage';
// import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
// import Header from './components/Header/Header';
// import './index.css';
// import TestFirebase from './components/TestFirebase';
// import LoginModal from './components/AuthModal/LoginModal/LoginModal';



// function App() {
//   return (
//     <BrowserRouter>
//       <Header />
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/psychologists" element={<PsychologistsPage />} />
//         <Route path="/favorites" element={<FavoritesPage />} />
//         {/* Если пользователь ввел несуществующий путь - перенаправляем на главную */}
//         <Route path="*" element={<HomePage />} />
//         <Route path="/test-firebase" element={<TestFirebase />} />
//       </Routes>
//     </BrowserRouter>
//   );
  
// }

// export default App;

// import { useState } from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// // Страницы
// import HomePage from './pages/HomePage/HomePage';
// import PsychologistsPage from './pages/PsychologistsPage/PsychologistsPage';
// import FavoritesPage from './pages/FavoritesPage/FavoritesPage';

// // Компоненты
// import Header from './components/Header/Header';
// import LoginModal from './components/AuthModal/LoginModal/LoginModal';
// import RegisterModal from './components/AuthModal/RegisterModal/RegisterModal';

// // Стили
// import './index.css';

// function App() {
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showRegisterModal, setShowRegisterModal] = useState(false);
//   const [user, setUser] = useState(null); // Добавляем состояние пользователя

//   // Функция для входа
//   const handleLogin = (userData) => {
//     console.log('User logged in:', userData);
//     setUser({
//       displayName: userData.email.split('@')[0], // Имя из email
//       email: userData.email
//     });
//     setShowLoginModal(false);
//   };

//   // Функция для регистрации
//   const handleRegister = (userData) => {
//     console.log('User registered:', userData);
//     setUser({
//       displayName: userData.name, // Имя из формы
//       email: userData.email
//     });
//     setShowRegisterModal(false);
//   };

//   // Функция для выхода
//   const handleLogout = () => {
//     console.log('User logged out');
//     setUser(null);
//   };

//   return (
//     <BrowserRouter>
//       <Header 
//         user={user} // Передаем пользователя
//         onOpenLogin={() => setShowLoginModal(true)}
//         onOpenRegister={() => setShowRegisterModal(true)}
//         onLogout={handleLogout} // Передаем функцию выхода
//       />
      
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/psychologists" element={<PsychologistsPage />} />
//         <Route path="/favorites" element={<FavoritesPage />} />
//         <Route path="*" element={<HomePage />} />
//       </Routes>

//       <LoginModal 
//         isOpen={showLoginModal}
//         onClose={() => setShowLoginModal(false)}
//         onLogin={handleLogin} // Передаем функцию входа
//       />
      
//       <RegisterModal 
//         isOpen={showRegisterModal}
//         onClose={() => setShowRegisterModal(false)}
//         onRegister={handleRegister} // Передаем функцию регистрации
//       />
//     </BrowserRouter>
//   );
// }

// export default App;


import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import PsychologistsPage from './pages/PsychologistsPage/PsychologistsPage';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import Header from './components/Header/Header';
import LoginModal from './components/AuthModal/LoginModal/LoginModal';
import RegisterModal from './components/AuthModal/RegisterModal/RegisterModal';
import { onAuthChange } from './firebase/auth';
import './index.css';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Следим за авторизацией
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Header 
        user={user}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenRegister={() => setShowRegisterModal(true)}
      />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/psychologists" element={<PsychologistsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      
      <RegisterModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </BrowserRouter>
  );
}

export default App;