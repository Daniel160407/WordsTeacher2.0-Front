import { useState, useEffect } from "react";
import WordItem from "./WordItem";

const WordList = ({
  words,
  setWords,
  setUpdatedWords,
  setUpdatedDictionaryWords,
  checkboxesRef,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [wordTypes, setWordTypes] = useState([]);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    Object.values(checkboxesRef.current).forEach((checkbox) => {
      if (checkbox) checkbox.checked = newSelectAll;
    });
  };

  useEffect(() => {
    const allChecked =
      words.length > 0 &&
      words.every((word) => checkboxesRef.current[word.word]?.checked);
    setSelectAll(allChecked);
  }, [words]);

  useEffect(() => {
    const detectType = (word) => {
      const w = word.word;

      const verbRegex = /^(sich\s)?[a-zäöüß]+(en|n)$/i;
      const adjectiveRegex = /(ig|lich|isch|bar|haft|los|sam)$/i;
      const nounRegex = /^(Der|Die|Das)\b/i;

      if (verbRegex.test(w)) return "Verb";
      if (adjectiveRegex.test(w)) return "Adjektiv";
      if (nounRegex.test(w)) return "Substantiv";
      return "Unbekannt";
    };

    const types = words.map(detectType);
    setWordTypes(types);
  }, [words]);

  return (
    <div className="words-list">
      <div className="select-all-container">
        <label>
          Select All
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
        </label>
      </div>

      {words.map((word, index) => (
        <WordItem
          key={word.word + word.meaning}
          word={word}
          wordType={wordTypes[index]}
          setWords={setWords}
          setUpdatedWords={setUpdatedWords}
          setUpdatedDictionaryWords={setUpdatedDictionaryWords}
          checkboxesRef={checkboxesRef}
        />
      ))}
    </div>
  );
};

export default WordList;
