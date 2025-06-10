import { FaEye, FaEyeSlash } from "react-icons/fa";

const WordEntry = ({ word, isExpanded, toggleExamples }) => {
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
    <div className={`dictionary-entry ${isExpanded ? "expanded" : ""}`}>
      <div className="word-info">
        <span className="dictionary-word">{word.word} -</span>
        <span className="dictionary-meaning">{word.meaning}</span>
        <button className="toggle-examples" onClick={toggleExamples}>
          {isExpanded ? <FaEyeSlash /> : <FaEye />}
        </button>
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
