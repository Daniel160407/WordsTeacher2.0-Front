import React from "react";

const WordLevelStats = ({ words }) => {
  const levelStats = React.useMemo(() => {
    const stats = {
      A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0, 
      UNKNOWN: 0, OTHER: 0, TOTAL: words.length
    };

    words.forEach(word => {
      const level = word.level?.toUpperCase().trim();
      
      if (level) {
        if (stats.hasOwnProperty(level)) {
          stats[level]++;
        } else {
          stats.OTHER++;
        }
      } else {
        stats.UNKNOWN++;
      }
    });

    return stats;
  }, [words]);

  return (
    <div className="level-stats-container">
      <h4 className="stats-title">Word Level Distribution</h4>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">A1</span>
          <span className="stat-value">{levelStats.A1}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">A2</span>
          <span className="stat-value">{levelStats.A2}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">B1</span>
          <span className="stat-value">{levelStats.B1}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">B2</span>
          <span className="stat-value">{levelStats.B2}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">C1</span>
          <span className="stat-value">{levelStats.C1}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">C2</span>
          <span className="stat-value">{levelStats.C2}</span>
        </div>
      </div>
      {(levelStats.UNKNOWN > 0 || levelStats.OTHER > 0) && (
        <div className="additional-stats">
          {levelStats.UNKNOWN > 0 && (
            <div className="stat-item">
              <span className="stat-label">Unknown</span>
              <span className="stat-value">{levelStats.UNKNOWN}</span>
            </div>
          )}
          {levelStats.OTHER > 0 && (
            <div className="stat-item">
              <span className="stat-label">Other</span>
              <span className="stat-value">{levelStats.OTHER}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WordLevelStats;