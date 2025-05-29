const StatisticCard = ({ title, value, icon }) => {
  return (
    <div className="statistic-card">
      <div className="statistic-card-icon">{icon}</div>
      <div className="statistic-card-content">
        <div className="statistic-card-value">{value}</div>
        <div className="statistic-card-title">{title}</div>
      </div>
    </div>
  );
};

export default StatisticCard;