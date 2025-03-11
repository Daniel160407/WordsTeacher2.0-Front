const BlockedOverlay = ({ message, onUpgrade }) => {
  return (
    <div className="blocked-overlay">
      <div className="blocked-content">
        <div className="lock-icon">🔒</div>
        <h3>Premium Feature Locked</h3>
        <p>{message || "This feature requires a premium subscription"}</p>
        <button className="subscribe-button" onClick={onUpgrade}>
          Upgrade to Unlock
        </button>
      </div>
    </div>
  );
};

export default BlockedOverlay;