import React from 'react';
import PropTypes from 'prop-types';

const WordListSelector = ({ wordsList, setWordsList, firstLetter, setFirstLetter }) => {
  const handleWordsListChange = (e) => {
    setWordsList(e.target.value);
  };

  const handleFirstLetterChange = (e) => {
    setFirstLetter(e.target.value);
  };

  return (
    <div className="wordlist-selector">
      <label htmlFor="words-list" className="selector-label">Select Word List:</label>
      <select
        id="words-list"
        value={wordsList}
        onChange={handleWordsListChange}
        className="selector-dropdown"
      >
        <option value="words">Words</option>
        <option value="verbs">Verbs</option>
        <option value="nouns">Nouns</option>
      </select>

      <label htmlFor="first-letter" className="selector-label">Filter by First Letter:</label>
      <input
        id="first-letter"
        type="text"
        value={firstLetter}
        onChange={handleFirstLetterChange}
        className="first-letter-input"
        maxLength={1}
        placeholder="A"
      />
    </div>
  );
};

WordListSelector.propTypes = {
  wordsList: PropTypes.string.isRequired,
  setWordsList: PropTypes.func.isRequired,
  firstLetter: PropTypes.string.isRequired,
  setFirstLetter: PropTypes.func.isRequired,
};

export default WordListSelector;
