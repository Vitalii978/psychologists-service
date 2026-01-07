
// import { Outlet, NavLink, Link } from 'react-router-dom';
// // import { useState } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// import { Suspense } from "react";
// import './Header.css';

// import svg from "../../assets/images/icons.svg";
// // import Loader from "../Loader/Loader";


// const Header = () => {
//   // Временно для демонстрации - позже будет из Redux/Firebase
//   const user = null; // Пока нет пользователя
  
//   // Временные функции для демонстрации
//   const handleLoginClick = () => {
//     console.log ('Login clicked');
//     // Здесь будет открытие модального окна логина
//   };
  
//   const handleRegisterClick = () => {
//     console.log('Register clicked');
//     // Здесь будет открытие модального окна регистрации
//   };
  
//   const handleLogout = () => {
//     console.log ('Logout clicked');
//     // Здесь будет logout из Firebase
//   };
  
//   // Временный пользователь для демонстрации
//   // const user = { displayName: 'John Doe' }; // Раскомментируйте для теста
//   return (
//     <header className="header">
      
//         <div className="header-content">
//           <Link to="/" className="logo">
//             <span className="logo-blue">psychologists.</span>
//             <span className="logo-black">services</span>
//           </Link>
        
//           <nav className="navigation">
//             <NavLink 
//                 to="/" 
//                   className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
//             >
//               Home
//             </NavLink>

//             <NavLink 
//                 to="/psychologists" 
//                   className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
//             >
//               Psychologists
//             </NavLink>
        
//         {user && (
//             <NavLink 
//                 to="/favorites" 
//                   className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
//             >
//               Favorites
//             </NavLink>
//         )}  
//           </nav>
//         </div>    
//         <div>
//           {user ? (
//             <div className="userContainer">
//               <div class="nameContainer">
//                 <div className="iconContainer">
//                   <svg>
//                     <use href={`${svg}#icon-user`} />
//                   </svg>
//                 </div>

//                 <span>{user.displayName}</span>
//               </div>
//               <button className="btn-register" onClick={handleLogout}>Log Out</button>
//             </div>
//           ) : (
//             <div className="auth-buttons">
//               <button className="btn-register" onClick={handleLoginClick}>Log In</button>
//               <button className="btn-register" onClick={handleRegisterClick}>Registration</button>
//             </div>
//           )}
//         </div>
      
//     </header>
//   );
// };

// export default Header;

// import { NavLink, Link } from 'react-router-dom';
// import './Header.css';
// import svg from "../../assets/images/icons.svg";

// const Header = ({ user, onOpenLogin, onOpenRegister, onLogout }) => { // Добавляем пропсы
  
//   return (
//     <header className="header">
//       <div className="header-content">
//         <Link to="/" className="logo">
//           <span className="logo-blue">psychologists.</span>
//           <span className="logo-black">services</span>
//         </Link>
      
//         <nav className="navigation">
//           <NavLink 
//             to="/" 
//             className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
//           >
//             Home
//           </NavLink>

//           <NavLink 
//             to="/psychologists" 
//             className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
//           >
//             Psychologists
//           </NavLink>
      
//           {user && ( // Показываем Favorites только если есть пользователь
//             <NavLink 
//               to="/favorites" 
//               className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
//             >
//               Favorites
//             </NavLink>
//           )}  
//         </nav>
//       </div>    
      
//       <div>
//         {user ? (
//           // Если пользователь залогинен
//           <div className="userContainer">
//             <div className="nameContainer">
//               <div className="iconContainer">
//                 <svg>
//                   <use href={`${svg}#icon-user`} />
//                 </svg>
//               </div>
//               <span>{user.displayName}</span>
//             </div>
//             <button className="btn-register" onClick={onLogout}>Log Out</button>
//           </div>
//         ) : (
//           // Если пользователь не залогинен
//           <div className="auth-buttons">
//             <button className="btn-register" onClick={onOpenLogin}>Log In</button>
//             <button className="btn-register" onClick={onOpenRegister}>Registration</button>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;



import { NavLink, Link } from 'react-router-dom';
import { logoutUser } from '../../firebase/auth';
import './Header.css';
import svg from "../../assets/images/icons.svg";

const Header = ({ user, onOpenLogin, onOpenRegister }) => {
  
  const handleLogout = async () => {
    await logoutUser();
  };
  
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-blue">psychologists.</span>
          <span className="logo-black">services</span>
        </Link>
      
        <nav className="navigation">
          <NavLink 
            to="/" 
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            Home
          </NavLink>

          <NavLink 
            to="/psychologists" 
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            Psychologists
          </NavLink>
      
          {user && (
            <NavLink 
              to="/favorites" 
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            >
              Favorites
            </NavLink>
          )}  
        </nav>
      </div>    
      
      <div>
        {user ? (
          <div className="userContainer">
            <div className="nameContainer">
              <div className="iconContainer">
                <svg>
                  <use href={`${svg}#icon-user`} />
                </svg>
              </div>
              <span>{user.displayName}</span>
            </div>
            <button className="btn-register" onClick={handleLogout}>Log Out</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="btn-register" onClick={onOpenLogin}>Log In</button>
            <button className="btn-register" onClick={onOpenRegister}>Registration</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;