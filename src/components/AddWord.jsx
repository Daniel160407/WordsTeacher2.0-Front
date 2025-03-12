import axios from "axios";
import { useState, useCallback } from "react";
import Cookies from "js-cookie";
import "../style/AddWord.scss";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// eslint-disable-next-line react/prop-types
const AddWord = ({ setUpdatedWords, setUpdatedDictionaryWords }) => {
  const [wordData, setWordData] = useState({
    word: "",
    meaning: "",
    wordType: "word",
  });
  const [advancement, setAdvancement] = useState(null);

  const headers = {
    Authorization: Cookies.get("token") || "",
  };
  
  const [languageLevel, setLanguageLevel] = useState(Cookies.get('languageLevel'));

  const playAdvancementSound = useCallback(() => {
    new Audio("/sounds/advancement_sound.mp3").play();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWordData((prev) => ({ ...prev, [name]: value }));
  };

  const addWord = async (event) => {
    event.preventDefault();

    const newWord = {
      ...wordData,
      level: languageLevel,
      userId: Cookies.get("userId"),
      languageId: Cookies.get("languageId"),
    };

    try {
      const [wordsResponse, dictionaryResponse] = await Promise.all([
        axios.post(`${API_BASE_URL}/wordsTeacher/words`, newWord, { headers }),
        axios.post(`${API_BASE_URL}/wordsTeacher/dictionary`, newWord, {
          headers,
        }),
      ]);

      setUpdatedWords(wordsResponse.data);
      setUpdatedDictionaryWords(dictionaryResponse.data.dictionaryDtos);
      setWordData({ word: "", meaning: "", wordType: wordData.wordType });

      if (dictionaryResponse.data.advancement) {
        setAdvancement(dictionaryResponse.data.advancement);
        playAdvancementSound();
        setTimeout(() => setAdvancement(null), 5000);
      }
    } catch (error) {
      console.error("Error adding word:", error);
    }
  };

  return (
    <div id="addWords" className="tab-pane fade">
      <h2>Add New Words</h2>
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
              onChange={(e) => {
                setLanguageLevel(e.target.value);
                Cookies.set("languageLevel", e.target.value, { expires: 365 });
              }}
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
    </div>
  );
};

export default AddWord;
