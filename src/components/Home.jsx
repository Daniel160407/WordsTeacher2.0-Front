import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import "../style/Home.scss";

const Home = ({ updatedWords, setUpdatedWords, setUpdatedDictionaryWords, languageId }) => {
  const [words, setWords] = useState([]);
  const [level, setLevel] = useState(0);
  const checkboxesRef = useRef({});
  const [visibleWord, setVisibleWord] = useState(null);
  const [editWord, setEditWord] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [meaningEditValue, setMeaningEditValue] = useState("");
  const [wordTypeEditValue, setWordTypeEditValue] = useState("");
  const [wordsType, setWordsType] = useState("word");
  const [advancement, setAdvancement] = useState(null);

  const showAdvancementMessage = (advancementMessage) => {
    setAdvancement(advancementMessage);

    const sound = new Audio("/sounds/advancement_sound.mp3");
    sound.play();

    setTimeout(() => {
      setAdvancement(null);
    }, 5000);
  };

  useEffect(() => {
    if(languageId !== null){
      Cookies.set('languageId', languageId, {expires: 7});
    }
    axios
      .get(`http://localhost:8080/wordsTeacher/words?wordstype=${wordsType}&userid=${Cookies.get('userId')}&languageid=${Cookies.get('languageId')}&tests=${false}`, {
        headers: {
          Authorization: `${Cookies.get("token") || ""}`,
        },
      })
      .then((response) => {
        setWords(response.data);
      });

    axios
      .get(`http://localhost:8080/wordsTeacher/words/level?userid=${Cookies.get('userId')}&languageid=${Cookies.get('languageId')}`, {
        headers: {
          Authorization: `${Cookies.get("token") || ""}`,
        },
      })
      .then((response) => setLevel(response.data.level));
  }, [wordsType, languageId]);

  useEffect(() => {
    if (updatedWords !== "") {
      setWords(updatedWords);
    }
  }, [updatedWords]);

  const sendWords = () => {
    const checkedWords = words.filter(
      (word) => checkboxesRef.current[word.word]?.checked
    );
    axios
      .put("http://localhost:8080/wordsTeacher/dropper", checkedWords, {
        headers: {
          Authorization: `${Cookies.get("token") || ""}`,
        },
      })
      .then((response) => {
        setWords(response.data.wordDtos);
        if (response.data.advancement !== null) {
          setAdvancement(response.data.advancement);
          showAdvancementMessage(response.data.advancement);
        }
        axios
          .get(`http://localhost:8080/wordsTeacher/words/level?userid=${Cookies.get('userId')}&languageid=${Cookies.get('languageId')}`, {
            headers: {
              Authorization: `${Cookies.get("token") || ""}`,
            },
          })
          .then((response) => setLevel(response.data.level));
      });
    Object.values(checkboxesRef.current).forEach((checkbox) => {
      if (checkbox) checkbox.checked = false;
    });
  };

  const handleContextMenu = (word) => {
    setVisibleWord(word.word === visibleWord ? null : word.word);
  };

  const handleEdit = (word) => {
    setEditWord(word.word);
    setEditValue(word.word);
    setMeaningEditValue(word.meaning);
    setWordTypeEditValue(word.wordType);
  };

  const handleEditChange = (e) => setEditValue(e.target.value);
  const handleMeaningEditChange = (e) => setMeaningEditValue(e.target.value);

  const handleKeyPress = (e, word) => {
    if (e.key === "Enter") {
      handleSave(word);
    }
  };

  const handleSave = (word) => {
    const changedWord = {
      word: editValue,
      meaning: meaningEditValue,
      wordType: wordTypeEditValue,
      userId: Cookies.get('userId'),
    };

    const changedWordArray = [word, changedWord];
    axios
      .put(`http://localhost:8080/wordsTeacher/words`, changedWordArray, {
        headers: {
          Authorization: `${Cookies.get("token") || ""}`,
        },
      })
      .then((response) => {
        setWords(response.data);
        setUpdatedWords(response.data);
        setEditWord(null);
        setEditValue("");

        axios
          .put(
            "http://localhost:8080/wordsTeacher/dictionary",
            changedWordArray,
            {
              headers: {
                Authorization: `${Cookies.get("token") || ""}`,
              },
            }
          )
          .then((response) => setUpdatedDictionaryWords(response.data));
      });
  };

  const handleRemove = (word) => {
    axios
      .delete(
        `http://localhost:8080/wordsTeacher/words?word=${word.word}&meaning=${word.meaning}&wordtype=${word.wordType}&userid=${Cookies.get('userId')}&languageid=${Cookies.get('languageId')}`,
        {
          headers: {
            Authorization: `${Cookies.get("token") || ""}`,
          },
        }
      )
      .then((response) => {
        setWords(response.data);
        setUpdatedWords(response.data);

        axios
          .delete(
            `http://localhost:8080/wordsTeacher/dictionary?word=${word.word}&meaning=${word.meaning}&userid=${Cookies.get('userId')}&languageid=${Cookies.get('languageId')}&languageid=${Cookies.get('languageId')}`,
            {
              headers: {
                Authorization: `${Cookies.get("token") || ""}`,
              },
            }
          )
          .then((response) => setUpdatedDictionaryWords(response.data));
      });
  };

  const handleTouchStart = (e, word) => {
    e.persist();
    const touchTimeout = setTimeout(() => {
      handleContextMenu(word);
    }, 500);

    e.target.touchTimeout = touchTimeout;
  };

  const handleTouchEnd = (e) => {
    clearTimeout(e.target.touchTimeout);
  };

  return (
    <div id="words" className="tab-pane fade show active">
      <h1>Level {level}</h1>
      <select onChange={(e) => setWordsType(e.target.value)}>
        <option value="word">Words</option>
        <option value="difficult">Difficult Verbs</option>
        <option value="redemittel">Redemittels</option>
      </select>
      {words.map((word) => (
        <div
          className="word"
          key={word.word + word.meaning}
          onContextMenu={(e) => {
            e.preventDefault();
            handleContextMenu(word);
          }}
          onTouchStart={(e) => handleTouchStart(e, word)}
          onTouchEnd={handleTouchEnd}
        >
          {editWord === word.word ? (
            <div className="editWordContainer">
              <input
                type="text"
                className="edit-input"
                value={editValue}
                onChange={handleEditChange}
                onKeyPress={(e) => handleKeyPress(e, word)}
              />
              <input
                type="text"
                className="edit-input"
                value={meaningEditValue}
                onChange={handleMeaningEditChange}
                onKeyPress={(e) => handleKeyPress(e, word)}
              />
              <select
                className="editSelect"
                onChange={(e) => setWordTypeEditValue(e.target.value)}
              >
                <option value="word">Words</option>
                <option value="difficult">Difficult Verbs</option>
              </select>
              <button
                className="save-button btn btn-success"
                onClick={() => handleSave(word)}
              >
                Save
              </button>
            </div>
          ) : (
            <h1>
              {word.word} - {word.meaning}
            </h1>
          )}
          {visibleWord === word.word && (
            <div className="editWord">
              <img
                className="edit"
                src="/svg/pencil.svg"
                alt="edit"
                onClick={() => handleEdit(word)}
              />
              <img
                className="remove"
                src="/svg/trash.svg"
                alt="remove"
                onClick={() => handleRemove(word)}
              />
            </div>
          )}
          <input
            className="checkbox"
            type="checkbox"
            ref={(el) => (checkboxesRef.current[word.word] = el)}
          />
        </div>
      ))}
      <button
        id="send-button"
        type="button"
        className="btn btn-warning"
        onClick={sendWords}
      >
        Drop
      </button>

      {advancement && (
        <div className="advancement-message">
          <h3>{advancement}</h3>
        </div>
      )}
    </div>
  );
};

export default Home;
