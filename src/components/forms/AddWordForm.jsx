import React from "react";

const AddWordForm = ({
  wordData,
  languageLevel,
  advancement,
  handleChange,
  handleLanguageLevelChange,
  addWord,
}) => {
  return (
    <div className="center-box">
      {advancement && (
        <div className="advancement-message fade-in">
          <h3>{advancement}</h3>
        </div>
      )}
      <form id="wordInputForm" onSubmit={addWord}>
        <h3>Word:</h3>
        <input
          name="word"
          value={wordData.word}
          onChange={handleChange}
          type="text"
          required
        />
        <h3>Meaning:</h3>
        <input
          name="meaning"
          value={wordData.meaning}
          onChange={handleChange}
          type="text"
          required
        />
        <h3>Usage Examples:</h3>
        <textarea
          name="example"
          value={wordData.example}
          onChange={handleChange}
          placeholder="Enter example sentences (separate with new lines)..."
          rows="3"
        />

        <div className="meta-data">
          <select
            name="wordType"
            value={wordData.wordType}
            onChange={handleChange}
          >
            <option value="word">Word</option>
            <option value="difficult">Difficult Verb</option>
            <option value="redemittel">Redemittel</option>
          </select>
          <select
            className="level"
            value={languageLevel}
            onChange={handleLanguageLevelChange}
          >
            <option>A1</option>
            <option>A2</option>
            <option>B1</option>
            <option>B2</option>
            <option>C1</option>
            <option>C2</option>
          </select>
        </div>
        <button type="submit" className="btn-warning">
          Add Word
        </button>
      </form>
    </div>
  );
};

export default AddWordForm;