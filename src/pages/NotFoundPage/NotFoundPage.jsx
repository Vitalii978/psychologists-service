import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist.</p>
      <Link to="/" className="home-link">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;