import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthChange } from './firebase/auth';
import './index.css';

// Страницы
import HomePage from './pages/HomePage/HomePage';
import PsychologistsPage from './pages/PsychologistsPage/PsychologistsPage';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';

// Компоненты
import Header from './components/Header/Header';
import LoginModal from './components/AuthModal/LoginModal/LoginModal';
import RegisterModal from './components/AuthModal/RegisterModal/RegisterModal';
import AuthRequiredModal from './components/AuthModal/AuthRequiredModal/AuthRequiredModal';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        localStorage.setItem('psychologistUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('psychologistUser');
      }
      
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
        <Route 
          path="/psychologists" 
          element={
            <PsychologistsPage 
              user={user}
              onOpenAuthRequired={() => setShowAuthRequiredModal(true)}
            />
          }
        />
        <Route 
          path="/favorites" 
          element={
            user ? <FavoritesPage user={user} /> : <Navigate to="/" />
          } 
        />
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
      
      <AuthRequiredModal 
        isOpen={showAuthRequiredModal}
        onClose={() => setShowAuthRequiredModal(false)}
      />
    </BrowserRouter>
  );
}

export default App;