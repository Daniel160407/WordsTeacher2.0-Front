import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import WordList from "./model/WordList";
import AdvancementMessage from "./uiComponents/AdvancementMessage";
import "../style/Home.scss";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = ({ updatedWords, setUpdatedWords, setUpdatedDictionaryWords, languageId }) => {
  const [words, setWords] = useState([]);
  const [level, setLevel] = useState(0);
  const [wordsType, setWordsType] = useState("word");
  const [advancement, setAdvancement] = useState(null);
  const checkboxesRef = useRef({});

  useEffect(() => {
    if (languageId !== null && languageId !== undefined) {
      Cookies.set("languageId", languageId, { expires: 7 });
    }

    axios
      .get(`${API_BASE_URL}/wordsTeacher/words?wordstype=${wordsType}&userid=${Cookies.get("userId")}&languageid=${Cookies.get("languageId")}&tests=false`, {
        headers: { Authorization: `${Cookies.get("token") || ""}` },
      })
      .then((response) => setWords(response.data));

    axios
      .get(`${API_BASE_URL}/wordsTeacher/words/level?userid=${Cookies.get("userId")}&languageid=${Cookies.get("languageId")}`, {
        headers: { Authorization: `${Cookies.get("token") || ""}` },
      })
      .then((response) => setLevel(response.data.level));
  }, [wordsType, languageId]);

  useEffect(() => {
    if (updatedWords !== "") {
      setWords(updatedWords);
    }
  }, [updatedWords]);

  const showAdvancementMessage = (message) => {
    setAdvancement(message);
    const sound = new Audio("/sounds/advancement_sound.mp3");
    sound.play();
    setTimeout(() => setAdvancement(null), 5000);
  };

  const sendWords = () => {
    const checkedWords = words.filter((word) => checkboxesRef.current[word.word]?.checked);
    axios
      .put(`${API_BASE_URL}/wordsTeacher/dropper`, checkedWords, {
        headers: { Authorization: `${Cookies.get("token") || ""}` },
      })
      .then((response) => {
        setWords(response.data.wordDtos);
        if (response.data.advancement) {
          showAdvancementMessage(response.data.advancement);
        }
        axios
          .get(`${API_BASE_URL}/wordsTeacher/words/level?userid=${Cookies.get("userId")}&languageid=${Cookies.get("languageId")}`, {
            headers: { Authorization: `${Cookies.get("token") || ""}` },
          })
          .then((res) => setLevel(res.data.level));
      });

    Object.values(checkboxesRef.current).forEach((checkbox) => {
      if (checkbox) checkbox.checked = false;
    });
  };

  return (
    <div id="words" className="tab-pane fade show active">
      <h1>Level {level}</h1>
      <select onChange={(e) => setWordsType(e.target.value)}>
        <option value="word">Words</option>
        <option value="difficult">Difficult Verbs</option>
        <option value="redemittel">Redemittels</option>
      </select>

      <WordList words={words} setWords={setWords} setUpdatedWords={setUpdatedWords} setUpdatedDictionaryWords={setUpdatedDictionaryWords} checkboxesRef={checkboxesRef} />

      <button id="send-button" type="button" className="btn btn-warning" onClick={sendWords}>
        Drop
      </button>

      {advancement && <AdvancementMessage message={advancement} />}
    </div>
  );
};

export default Home;
