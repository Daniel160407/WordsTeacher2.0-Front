import { useRef } from "react";

const WordEntry = ({ word, isExpanded, toggleExamples }) => {
  const touchTimerRef = useRef(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    toggleExamples();
  };

  const handleTouchStart = () => {
    touchTimerRef.current = setTimeout(() => {
      toggleExamples();
    }, 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(touchTimerRef.current);
  };

  const renderExamples = () => {
    if (!word.example) {
      return <p className="no-examples">No examples available</p>;
    }

    return (
      <ul className="examples-list">
        {word.example.split("\n").map((ex, index) => (
          <li key={index} className="example-item">
            {ex}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div
      className={`dictionary-entry ${isExpanded ? "expanded" : ""}`}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="word-info">
        <div className="dic-word">
          <span className="dictionary-word">{word.word} -</span>
          <span className="dictionary-meaning">{word.meaning}</span>
        </div>
        <div className="word-level">
          <p>{word.level}</p>
        </div>
      </div>

      {isExpanded && (
        <div className="examples-container">
          <h4>Usage Examples:</h4>
          {renderExamples()}
        </div>
      )}
    </div>
  );
};

export default WordEntry;
