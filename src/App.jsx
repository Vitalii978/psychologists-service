import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import PsychologistsPage from './pages/PsychologistsPage/PsychologistsPage';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import Header from './components/Header/Header';
import './index.css';
import TestFirebase from './components/TestFirebase';




function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/psychologists" element={<PsychologistsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        {/* Если пользователь ввел несуществующий путь - перенаправляем на главную */}
        <Route path="*" element={<HomePage />} />
        <Route path="/test-firebase" element={<TestFirebase />} />
      </Routes>
    </BrowserRouter>
  );
  
}

export default App;

