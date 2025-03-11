import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  const handleSave = () => {
    const changedWord = {
      word: editValue,
      meaning: meaningEditValue,
      wordType: wordTypeEditValue,
      userId: Cookies.get("userId"),
    };

    const changedWordArray = [word, changedWord];

    axios
      .put(`${API_BASE_URL}/wordsTeacher/words`, changedWordArray, {
        headers: {
          Authorization: `${Cookies.get("token") || ""}`,
        },
      })
      .then((response) => {
        setWords(response.data);
        setUpdatedWords(response.data);
        setEditWord(null);
        setEditValue("");
        setMeaningEditValue("");
        setWordTypeEditValue("");

        return axios.put(
          `${API_BASE_URL}/wordsTeacher/dictionary`,
          changedWordArray,
          {
            headers: {
              Authorization: `${Cookies.get("token") || ""}`,
            },
          }
        );
      })
      .then((response) => setUpdatedDictionaryWords(response.data))
      .catch((error) => {
        console.error("Error updating word:", error);
      });
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
