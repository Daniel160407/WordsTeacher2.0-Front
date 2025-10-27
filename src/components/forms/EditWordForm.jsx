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
  const [exampleEditValue, setExampleEditValue] = useState(word.example || "");
  const [wordTypeEditValue, setWordTypeEditValue] = useState(word.wordType);
  const [levelEditValue, setLevelEditValue] = useState(word.level);

  const handleSave = async () => {
    const changedWord = {
      word: editValue,
      meaning: meaningEditValue,
      example: exampleEditValue,
      wordType: wordTypeEditValue,
      level: levelEditValue,
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

      setEditValue("");
      setMeaningEditValue("");
      setExampleEditValue("");
      setWordTypeEditValue("");
    } catch (error) {
      console.error("Error updating word:", error);
    }
  };

  const handleGenerateExamples = async () => {
    const prompt = `Generate 3 example sentences in ${word.level}, where the word: ${word.word} is used, one per line, without any extra text`;
    const response = await getAxiosInstance("/wordsTeacher/genai", "post", {
      prompt,
    });

    if (response?.status === 200) {
      setExampleEditValue(response.data);
    }
  };

  return (
    <div className="editWordContainer">
      <div className="form-row">
        <label>Word:</label>
        <input
          type="text"
          className="edit-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label>Meaning:</label>
        <input
          type="text"
          className="edit-input"
          value={meaningEditValue}
          onChange={(e) => setMeaningEditValue(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label>Examples:</label>
        <textarea
          className="edit-textarea"
          value={exampleEditValue}
          onChange={(e) => setExampleEditValue(e.target.value)}
          placeholder="Enter examples (one per line)"
          rows="3"
        />
        <button className="save-button" onClick={handleGenerateExamples}>
          Generate
        </button>
      </div>

      <div className="form-row">
        <label>Type:</label>
        <select
          className="editSelect"
          value={wordTypeEditValue}
          onChange={(e) => setWordTypeEditValue(e.target.value)}
        >
          <option value="word">Word</option>
          <option value="difficult">Difficult Verb</option>
          <option value="redemittel">Redemittel</option>
        </select>
      </div>

      <div className="form-row">
        <label>Level:</label>
        <select
          className="editSelect"
          value={levelEditValue}
          onChange={(e) => setLevelEditValue(e.target.value)}
        >
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="C1">C1</option>
          <option value="C2">C2</option>
        </select>
      </div>

      <div className="form-actions">
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
        <button className="cancel-button" onClick={() => setEditWord(null)}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditWordForm;
