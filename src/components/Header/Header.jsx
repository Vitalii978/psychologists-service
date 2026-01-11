import { NavLink, Link } from 'react-router-dom';
import { logoutUser } from '../../firebase/auth';
import './Header.css';
import svg from '../../assets/images/icons.svg';

const Header = ({ user, onOpenLogin, onOpenRegister }) => {
  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-blue">psychologists.</span>
            <span className="logo-black">services</span>
          </Link>

          <nav className="navigation">
            <NavLink to="/" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Home
            </NavLink>

            <NavLink
              to="/psychologists"
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              Psychologists
            </NavLink>

            {user && (
              <NavLink
                to="/favorites"
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
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
              <button className="btn-register" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-register" onClick={onOpenLogin}>
                Log In
              </button>
              <button className="btn-register" onClick={onOpenRegister}>
                Registration
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;