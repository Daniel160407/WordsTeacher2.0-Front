import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import getAxiosInstance from "./util/GetAxiosInstance";
import StatisticCard from "./uiComponents/StatisticCard";
import AdvancementBadge from "./uiComponents/AdvancementBage";
import "../style/Statistics.scss";
import { FaBook, FaFire, FaSync, FaTrophy, FaLock } from "react-icons/fa";
import WordLevelStats from "./uiComponents/WordLevelStates";

const Statistics = ({ dictionaryWords, setAdvancement }) => {
  const [statistics, setStatistics] = useState(null);
  const [allAdvancements, setAllAdvancements] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      try {
        const [statsResponse, advancementsResponse] = await Promise.all([
          getAxiosInstance(
            `/statistics?userid=${Cookies.get(
              "userId"
            )}&languageid=${Cookies.get("languageId")}`,
            "get"
          ),
          getAxiosInstance("/statistics/advancements", "get"),
        ]);

        setStatistics(statsResponse.data);
        setAdvancement(statsResponse.data.advancement);
        setAllAdvancements(advancementsResponse.data);
      } catch (err) {
        setError("Failed to load statistics data");
        console.error("Statistics loading error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [setAdvancement]);

  const categorizeAdvancements = (advancements) => {
    return {
      words: advancements.filter(
        (adv) => adv.includes("word") || adv.includes("Word")
      ),
      cycles: advancements.filter(
        (adv) => adv.includes("cycle") || adv.includes("Cycle")
      ),
      streaks: advancements.filter(
        (adv) =>
          adv.includes("day") ||
          adv.includes("week") ||
          adv.includes("month") ||
          adv.includes("year")
      ),
    };
  };

  if (isLoading) {
    return (
      <div className="statistics-loading">
        <div className="loading-spinner"></div>
        <p>Loading your statistics...</p>
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

  const earnedAdvancements = statistics.advancements || [];
  const { words, cycles, streaks } = categorizeAdvancements(allAdvancements);

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
          loading={isLoading}
        />
        <StatisticCard
          title="Cycles Completed"
          value={statistics.cycles}
          icon={<FaSync />}
          loading={isLoading}
        />
        <StatisticCard
          title="Day Streak"
          value={statistics.dayStreak}
          icon={<FaFire />}
          loading={isLoading}
        />
      </div>
      <div className="level-stats">
        <WordLevelStats words={dictionaryWords} />
      </div>

      <div className="statistics-advancements">
        <div className="statistics-section-header">
          <h3>Your Achievements</h3>
          <div className="statistics-decorative-line"></div>
        </div>

        <div className="statistics-advancements-list">
          {earnedAdvancements.length > 0 ? (
            earnedAdvancements.map((advancement, index) => (
              <AdvancementBadge
                key={`earned-${index}`}
                text={advancement}
                icon={<FaTrophy />}
                earned={true}
              />
            ))
          ) : (
            <div className="statistics-empty">
              <div className="statistics-empty-icon">📭</div>
              <p>No achievements yet. Keep learning!</p>
            </div>
          )}
        </div>
      </div>

      <div className="statistics-all-advancements">
        <div className="statistics-section-header">
          <h3>Available Advancements</h3>
          <div className="statistics-decorative-line"></div>
        </div>

        <div className="advancement-category">
          <h4>Word Milestones</h4>
          <div className="advancement-category-list">
            {words.map((advancement, index) => (
              <AdvancementBadge
                key={`words-${index}`}
                text={advancement}
                earned={earnedAdvancements.includes(advancement)}
              />
            ))}
          </div>
        </div>

        <div className="advancement-category">
          <h4>Cycle Milestones</h4>
          <div className="advancement-category-list">
            {cycles.map((advancement, index) => (
              <AdvancementBadge
                key={`cycles-${index}`}
                text={advancement}
                earned={earnedAdvancements.includes(advancement)}
              />
            ))}
          </div>
        </div>

        <div className="advancement-category">
          <h4>Day streak Milestones</h4>
          <div className="advancement-category-list">
            {streaks.map((advancement, index) => (
              <AdvancementBadge
                key={`streaks-${index}`}
                text={advancement}
                earned={earnedAdvancements.includes(advancement)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
