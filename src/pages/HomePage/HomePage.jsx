// // Импортируем наш компонент Header
// import Header from '../../components/Header/Header';
// // Импортируем изображение
// import psychologistImage from '../../assets/images/psychologist.jpg';

// const HomePage = () => {
//   return (
//     <div className="min-h-screen bg-white">
//       {/* Используем компонент Header */}
//       <Header />
      
//       {/* Основной контент страницы */}
//       <main className="container mx-auto px-4 py-12 lg:py-20">
        
//         {/* Две колонки */}
//         <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">
          
//           {/* ЛЕВАЯ КОЛОНКА - Текст и кнопка */}
//           <div 
//             className="w-full lg:w-[595px] flex flex-col items-start justify-start gap-10"
//             style={{
//               height: '438px',
//               gap: '40px' // Точный gap по ТЗ
//             }}
//           >
//             {/* Заголовок */}
//             <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
//               Explore the{' '}
//               <span className="text-blue-600">depths</span>
//               <br />
//               of psychology with us
//             </h1>
            
//             {/* Текст описания */}
//             <p className="text-xl text-gray-600">
//               Our psychologists provide professional help for your mental health. 
//               Find the right specialist for you.
//             </p>
            
//             {/* Кнопка Get started */}
//             <button className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition duration-300 text-lg font-medium">
//               Get started
//             </button>
//           </div>
          
//           {/* ПРАВАЯ КОЛОНКА - Изображение с элементами */}
//           <div className="w-full lg:w-auto relative">
            
//             {/* Основное изображение с точными размерами */}
//             <div className="relative">
//               <img 
//                 src={psychologistImage} 
//                 alt="Psychologist"
//                 className="rounded-[10px] w-full max-w-[464px] h-auto lg:w-[464px] lg:h-[526px] object-cover"
//                 style={{
//                   borderRadius: '10px',
//                   width: '464px',
//                   height: '526px'
//                 }}
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='464' height='526' viewBox='0 0 464 526'%3E%3Crect width='464' height='526' fill='%23e5e7eb' rx='10'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='20' fill='%239ca3af'%3EИзображение психолога%3C/text%3E%3C/svg%3E";
//                 }}
//               />
              
//               {/* ЗЕЛЕНЫЙ квадратик (сверху слева) */}
//               <div 
//                 className="absolute -top-5 -left-5 w-20 h-20 bg-green-400 rounded-lg z-10"
//                 style={{
//                   width: '80px',
//                   height: '80px'
//                 }}
//               ></div>
              
//               {/* ЖЕЛТЫЙ квадратик (снизу справа) */}
//               <div 
//                 className="absolute -bottom-5 -right-5 w-20 h-20 bg-yellow-400 rounded-lg z-10"
//                 style={{
//                   width: '80px',
//                   height: '80px'
//                 }}
//               ></div>
              
//               {/* ГОЛУБОЙ прямоугольный блок с информацией */}
//               <div 
//                 className="absolute bottom-8 left-8 bg-blue-500 rounded-2xl p-6 z-20"
//                 style={{
//                   width: '311px',
//                   height: '118px'
//                 }}
//               >
//                 <div className="flex items-center space-x-4 h-full">
//                   {/* Иконка галочки в белом прямоугольнике */}
//                   <div 
//                     className="bg-white rounded-lg flex items-center justify-center"
//                     style={{
//                       width: '48px',
//                       height: '48px'
//                     }}
//                   >
//                     {/* Синяя галочка */}
//                     <svg 
//                       className="w-6 h-6 text-blue-600" 
//                       fill="none" 
//                       stroke="currentColor" 
//                       viewBox="0 0 24 24"
//                     >
//                       <path 
//                         strokeLinecap="round" 
//                         strokeLinejoin="round" 
//                         strokeWidth="3" 
//                         d="M5 13l4 4L19 7"
//                       ></path>
//                     </svg>
//                   </div>
                  
//                   {/* Текстовый блок (белый текст) */}
//                   <div>
//                     <p className="font-semibold text-white">
//                       Experienced psychologists
//                     </p>
//                     <p className="text-2xl font-bold text-white">
//                       15,000
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default HomePage;


import Header from '../../components/Header/Header';
import './HomePage.css';
import svg from "../../assets/images/icons.svg";
import { Link } from "react-router-dom";

const HomePage = () => {  
  return (
    <div className="home-page">
      <Header />
      
      <main className="home-main">
        <div className="container">
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
                <div className="main-image">
                  {/* <img 
                    src="/images/hero@1x.jpg" 
                    srcSet="/src/assets/images/hero@1x.jpg, /src/assets/images/hero@2x.jpg 2x" 
                    alt="Psychologist" 
                    className="main-image"
                  /> */}
                </div>
                
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
        </div>
      </main>
    </div>
  );
};

export default HomePage;