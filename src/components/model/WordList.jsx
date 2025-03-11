import WordItem from "./WordItem";

const WordList = ({ words, setWords, setUpdatedWords, setUpdatedDictionaryWords, checkboxesRef }) => {
  return (
    <div>
      {words.map((word) => (
        <WordItem key={word.word + word.meaning} word={word} setWords={setWords} setUpdatedWords={setUpdatedWords} setUpdatedDictionaryWords={setUpdatedDictionaryWords} checkboxesRef={checkboxesRef} />
      ))}
    </div>
  );
};

export default WordList;
