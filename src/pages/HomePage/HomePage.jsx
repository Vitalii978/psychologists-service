
import Header from '../../components/Header/Header';
import './HomePage.css';
import svg from "../../assets/images/icons.svg";
import { Link } from "react-router-dom";

const HomePage = () => {  
  return (
    <div className="home-page">
      {/* <Header /> */}
      
      <main className="home-main">
          <div className="home-content">
            <div className="home-left">
              <h1 className="home-title">
                The road to the 
                <span className="depths-blue"> depths </span> of the
                human soul
              </h1>
              
              <p className="home-description">
                We help you to reveal your potential, overcome challenges and find a guide in your own life with the help of our experienced psychologists.
              </p>

              <Link to="/psychologists">
          <button className="btn-get-started">
            Get started
            <svg>
              <use href={`${svg}#icon-arrow`} />
            </svg>
          </button>
              </Link>
            </div>
            
            <div className="home-right">
              <div className="image-container">
                <div className="green-square">
                    <svg>
                      <use href={`${svg}#icon-question`} />
                    </svg>
                </div>
                <div className="yellow-square">
                    <svg>
                      <use href={`${svg}#icon-users`} />
                    </svg>
                </div>
                
                <div className="blue-card">
                  <div className="card-icon">
                    <svg>
                      <use href={`${svg}#icon-check`} />
                    </svg>
                  </div>
                  <div className="card-text">
                    <p className="card-title">Experienced psychologists</p>
                    <p className="card-number">15,000</p>
                  </div>
                </div>
              </div>
            </div>            
          </div>
      </main>
    </div>
  );
};

export default HomePage;