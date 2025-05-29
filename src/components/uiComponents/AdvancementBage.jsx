const AdvancementBadge = ({ text }) => {
  return (
    <div className="advancement-badge">
      <div className="advancement-badge-icon">🏆</div>
      <div className="advancement-badge-text">{text}</div>
    </div>
  );
};

export default AdvancementBadge;