import { useState, useEffect } from 'react';
import './PsychologistsPage.css';
import PsychologistCard from '../../components/PsychologistCard/PsychologistCard';

const mockPsychologists = [
  {
    id: 1,
    name: "Dr. Sarah Davis",
    avatar_url: "",
    experience: "12 years",
    reviews: [
      { reviewer: "Michael Brown", comment: "Dr. Davis has been a great help in managing my depression. Her insights have been valuable.", rating: 4.5 },
      { reviewer: "Linda Johnson", comment: "I'm very satisfied with Dr. Davis's therapy. She's understanding and empathetic.", rating: 5 }
    ],
    price_per_hour: 120,
    rating: 4.75,
    license: "Licensed Psychologist (License #67890)",
    specialization: "Depression and Mood Disorders",
    initial_consultation: "Free 45-minute initial consultation",
    about: "Dr. Sarah Davis is a highly experienced and licensed psychologist specializing in Depression and Mood Disorders. With 12 years of practice, she has helped numerous individuals overcome their depression and regain control of their lives. Dr. Davis is known for her empathetic and understanding approach to therapy, making her clients feel comfortable and supported throughout their journey to better mental health."
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    avatar_url: "",
    experience: "8 years",
    reviews: [
      { reviewer: "Alex K.", comment: "Very professional approach.", rating: 4.8 },
      { reviewer: "Sarah M.", comment: "Helped me with anxiety issues.", rating: 4.7 }
    ],
    price_per_hour: 95,
    rating: 4.8,
    license: "Licensed Psychologist (License #12345)",
    specialization: "Anxiety, Stress Management",
    initial_consultation: "Free 30-minute consultation",
    about: "Specializes in anxiety disorders and stress management techniques."
  },
  {
    id: 3,
    name: "Dr. Emily Wilson",
    avatar_url: "",
    experience: "10 years",
    reviews: [
      { reviewer: "John D.", comment: "Excellent family therapist.", rating: 4.9 },
      { reviewer: "Maria S.", comment: "Great with relationship issues.", rating: 4.8 }
    ],
    price_per_hour: 110,
    rating: 4.9,
    license: "Licensed Psychologist (License #54321)",
    specialization: "Family Therapy, Relationships",
    initial_consultation: "Free 40-minute consultation",
    about: "Family and relationship therapist with 10 years of experience."
  },
  {
    id: 4,
    name: "Dr. Robert Johnson",
    avatar_url: "",
    experience: "15 years",
    reviews: [
      { reviewer: "Tom B.", comment: "Very experienced therapist.", rating: 4.7 },
      { reviewer: "Emma W.", comment: "Professional approach.", rating: 4.6 }
    ],
    price_per_hour: 130,
    rating: 4.7,
    license: "Licensed Psychologist (License #98765)",
    specialization: "Trauma, PTSD",
    initial_consultation: "Free 50-minute consultation",
    about: "Specializes in trauma and PTSD therapy with 15 years of experience."
  }
];

const PsychologistsPage = () => {
  const [sortOption, setSortOption] = useState('show-all');
  const [visibleCount, setVisibleCount] = useState(3);
  const [psychologists, setPsychologists] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      setPsychologists(mockPsychologists);
    };
    
    loadData();
  }, []);

  const sortPsychologists = (psychologistsList) => {
    const sorted = [...psychologistsList];
    
    switch (sortOption) {
      case 'a-to-z':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'z-to-a':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'less-to-greater':
        return sorted.sort((a, b) => a.price_per_hour - b.price_per_hour);
      case 'greater-to-less':
        return sorted.sort((a, b) => b.price_per_hour - a.price_per_hour);
      case 'popular':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'not-popular':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'show-all':
      default:
        return sorted;
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const sortedPsychologists = sortPsychologists(psychologists);
  const visiblePsychologists = sortedPsychologists.slice(0, visibleCount);

  return (
    <div className="psychologists-page">
      <main className="psychologists-main">
        <div className="container">
          
          {/* Фильтры */}
          <div className="filters-section">
            <div className="filters-label">Filters</div>
            <div className="filter-select-wrapper">
              <select 
                className="filter-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="show-all">Show all</option>
                <option value="a-to-z">A to Z</option>
                <option value="z-to-a">Z to A</option>
                <option value="less-to-greater">Less to greater</option>
                <option value="greater-to-less">Greater to less</option>
                <option value="popular">Popular</option>
                <option value="not-popular">Not popular</option>
              </select>
            </div>
          </div>
          
          {/* Сетка карточек */}
          <div className="psychologists-grid">
            {visiblePsychologists.map(psychologist => (
              <PsychologistCard 
                key={psychologist.id}
                psychologist={psychologist}
              />
            ))}
          </div>
          
          {/* Кнопка Load More */}
          {visibleCount < psychologists.length && (
            <div className="load-more-container">
              <button 
                className="load-more-btn"
                onClick={handleLoadMore}
              >
                Load more
              </button>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
};

export default PsychologistsPage;