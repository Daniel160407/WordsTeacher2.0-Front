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

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    Object.values(checkboxesRef.current).forEach((checkbox) => {
      if (checkbox) {
        checkbox.checked = newSelectAll;
      }
    });
  };

  useEffect(() => {
    const allChecked =
      words.length > 0 &&
      words.every((word) => checkboxesRef.current[word.word]?.checked);
    setSelectAll(allChecked);
  }, [words]);

  return (
    <div>
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

      {words.map((word) => (
        <WordItem
          key={word.word + word.meaning}
          word={word}
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
