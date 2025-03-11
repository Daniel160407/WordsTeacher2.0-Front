const BlockedFeature = ({ blockMessage }) => {
    const scrollToBottom = () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    };

    return (
        <div className="blocked-overlay">
            <div className="blocked-content">
                <div className="lock-icon">🔒</div>
                <h3>Premium Feature Locked</h3>
                <p>{blockMessage}</p>
                <button className="subscribe-button" onClick={scrollToBottom}>
                    Upgrade to Unlock
                </button>
            </div>
        </div>
    );
};

export default BlockedFeature;
