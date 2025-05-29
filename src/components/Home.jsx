import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import getAxiosInstance from "./util/GetAxiosInstance";
import WordList from "./model/WordList";
import AdvancementMessage from "./uiComponents/AdvancementMessage";
import "../style/Home.scss";

const Home = ({ updatedWords, setUpdatedWords, setUpdatedDictionaryWords, dayStreakAdvancement, languageId }) => {
  const [words, setWords] = useState([]);
  const [level, setLevel] = useState(0);
  const [wordsType, setWordsType] = useState("word");
  const [advancement, setAdvancement] = useState(null);
  const checkboxesRef = useRef({});

  useEffect(() => {
    if (languageId !== null && languageId !== undefined) {
      Cookies.set("languageId", languageId, { expires: 7 });
    }

    const userId = Cookies.get("userId") ?? "";
    const langId = Cookies.get("languageId") ?? "";

    const fetchWords = async () => {
      try {
        const response = await getAxiosInstance(
          `/wordsTeacher/words?wordstype=${wordsType}&userid=${userId}&languageid=${langId}&tests=false`,
          "get"
        );
        setWords(response.data);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    const fetchLevel = async () => {
      try {
        const response = await getAxiosInstance(
          `/wordsTeacher/words/level?userid=${userId}&languageid=${langId}`,
          "get"
        );
        setLevel(response.data.level);
      } catch (error) {
        console.error("Error fetching level:", error);
      }
    };

    fetchWords();
    fetchLevel();
  }, [wordsType, languageId]);

  useEffect(() => {
    if (Array.isArray(updatedWords) && updatedWords.length > 0) {
      setWords(updatedWords);
    }
  }, [updatedWords]);

  useEffect(() => {
    showAdvancementMessage(dayStreakAdvancement);
  }, [dayStreakAdvancement]);

  const showAdvancementMessage = (message) => {
    setAdvancement(message);
    const sound = new Audio("/sounds/advancement_sound.mp3");
    sound.play();
    setTimeout(() => setAdvancement(null), 5000);
  };

  const sendWords = async () => {
    const checkedWords = words.filter((word) => checkboxesRef.current?.[word.word]?.checked);

    try {
      const response = await getAxiosInstance(`/wordsTeacher/dropper`, "put", checkedWords);
      setWords(response.data.wordDtos);

      if (response.data.advancement) {
        showAdvancementMessage(response.data.advancement);
      }

      const userId = Cookies.get("userId") ?? "";
      const langId = Cookies.get("languageId") ?? "";

      const levelResponse = await getAxiosInstance(
        `/wordsTeacher/words/level?userid=${userId}&languageid=${langId}`,
        "get"
      );
      setLevel(levelResponse.data.level);
    } catch (error) {
      console.error("Error sending words:", error);
    }

    Object.values(checkboxesRef.current).forEach((checkbox) => {
      if (checkbox) checkbox.checked = false;
    });
  };

  return (
    <div id="words" className="tab-pane fade show active">
      <h1>Level {level}</h1>

      <select onChange={(e) => setWordsType(e.target.value)} value={wordsType}>
        <option value="word">Words</option>
        <option value="difficult">Difficult Verbs</option>
        <option value="redemittel">Redemittels</option>
      </select>

      <WordList
        words={words}
        setWords={setWords}
        setUpdatedWords={setUpdatedWords}
        setUpdatedDictionaryWords={setUpdatedDictionaryWords}
        checkboxesRef={checkboxesRef}
      />

      <button id="send-button" type="button" className="btn btn-warning" onClick={sendWords}>
        Drop
      </button>

      {advancement && <AdvancementMessage message={advancement} />}
    </div>
  );
};

export default Home;
