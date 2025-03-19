import { useState } from "react";
import Cookies from "js-cookie";
import getAxiosInstance from "../util/GetAxiosInstance";

const EditWordForm = ({
  word,
  setEditWord,
  setWords,
  setUpdatedWords,
  setUpdatedDictionaryWords,
}) => {
  const [editValue, setEditValue] = useState(word.word);
  const [meaningEditValue, setMeaningEditValue] = useState(word.meaning);
  const [wordTypeEditValue, setWordTypeEditValue] = useState(word.wordType);

  const handleSave = async () => {
    const changedWord = {
      word: editValue,
      meaning: meaningEditValue,
      wordType: wordTypeEditValue,
      userId: Cookies.get("userId"),
    };

    const changedWordArray = [word, changedWord];

    try {
      const wordResponse = await getAxiosInstance(
        `/wordsTeacher/words`,
        "put",
        changedWordArray
      );

      setWords(wordResponse.data);
      setUpdatedWords(wordResponse.data);
      setEditWord(null);

      const dictionaryResponse = await getAxiosInstance(
        `/wordsTeacher/dictionary`,
        "put",
        changedWordArray
      );

      setUpdatedDictionaryWords(dictionaryResponse.data);

      // Reset fields only after successful requests
      setEditValue("");
      setMeaningEditValue("");
      setWordTypeEditValue("");
    } catch (error) {
      console.error("Error updating word:", error);
    }
  };

  return (
    <div className="editWordContainer">
      <input
        type="text"
        className="edit-input"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
      />
      <input
        type="text"
        className="edit-input"
        value={meaningEditValue}
        onChange={(e) => setMeaningEditValue(e.target.value)}
      />
      <select
        className="editSelect"
        value={wordTypeEditValue}
        onChange={(e) => setWordTypeEditValue(e.target.value)}
      >
        <option value="word">Words</option>
        <option value="difficult">Difficult Verbs</option>
        <option value="redemittel">Redemittel</option>
      </select>
      <button className="save-button btn btn-success" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default EditWordForm;
