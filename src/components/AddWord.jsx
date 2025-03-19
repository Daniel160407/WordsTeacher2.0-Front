import { useState, useCallback, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import getAxiosInstance from "./util/GetAxiosInstance";
import "../style/AddWord.scss";

const AddWord = ({ setUpdatedWords, setUpdatedDictionaryWords }) => {
  const [wordData, setWordData] = useState({
    word: "",
    meaning: "",
    wordType: "word",
  });
  const [advancement, setAdvancement] = useState(null);
  const [languageLevel, setLanguageLevel] = useState(
    Cookies.get("languageLevel")
  );

  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/advancement_sound.mp3");

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (!Cookies.get("languageLevel")) {
      Cookies.set("languageLevel", "A1", { expires: 7 });
    }
  }, []);

  const playAdvancementSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing advancement sound:", error);
      });
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setWordData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleLanguageLevelChange = useCallback((e) => {
    const newLevel = e.target.value;
    setLanguageLevel(newLevel);
    Cookies.set("languageLevel", newLevel, { expires: 7 });
  }, []);

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
        getAxiosInstance("/wordsTeacher/words", "post", newWord),
        getAxiosInstance("/wordsTeacher/dictionary", "post", newWord),
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
      console.error("Error adding word:", error.response?.data || error.message);
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
    </div>
  );
};

export default AddWord;