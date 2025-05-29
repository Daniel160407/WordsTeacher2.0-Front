import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import getAxiosInstance from './util/GetAxiosInstance';
import StatisticCard from './uiComponents/StatisticCard';
import AdvancementBadge from './uiComponents/AdvancementBage';
import '../style/Statistics.scss';
import { FaBook, FaFire, FaSync } from 'react-icons/fa';
import WordLevelStats from './uiComponents/WordLevelStates';

const Statistics = ({ dictionaryWords }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await getAxiosInstance(
          `/statistics?userid=${Cookies.get('userId')}&languageid=${Cookies.get('languageId')}`,
          'get'
        );
        setStatistics(response.data);
      } catch (err) {
        setError('Failed to load statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="statistics-loading">
        <div className="statistics-spinner"></div>
        <p>Loading your achievements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-error">
        <div className="statistics-error-icon">⚠️</div>
        <h3>{error}</h3>
        <p>Please try again later</p>
      </div>
    );
  }

  if (!statistics) return null;

  return (
    <div id="statistics" className="statistics-container tab-pane fade">
      <div className="statistics-header">
        <h2>Your Learning Statistics</h2>
        <p>Track your progress and achievements</p>
      </div>

      <div className="statistics-cards-grid">
        <StatisticCard 
          title="Words Learned" 
          value={statistics.wordsLearned} 
          icon={<FaBook />} 
        />
        <StatisticCard 
          title="Cycles Completed" 
          value={statistics.cycles} 
          icon={<FaSync />} 
        />
        <StatisticCard 
          title="Day Streak" 
          value={statistics.dayStreak} 
          icon={<FaFire />} 
        />
        <WordLevelStats words={dictionaryWords} />
      </div>

      <div className="statistics-advancements">
        <div className="statistics-section-header">
          <h3>Your Advancements</h3>
          <div className="statistics-decorative-line"></div>
        </div>
        
        <div className="statistics-advancements-list">
          {statistics.advancements?.length > 0 ? (
            statistics.advancements.map((advancement, index) => (
              <AdvancementBadge key={index} text={advancement} />
            ))
          ) : (
            <div className="statistics-empty">
              <div className="statistics-empty-icon">📭</div>
              <p>No advancements yet. Keep learning!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;