import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import "../style/AddWord.scss";

// eslint-disable-next-line react/prop-types
const AddWord = ({ setUpdatedWords, setUpdatedDictionaryWords }) => {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [wordType, setWordType] = useState("word");
  const [advancement, setAdvancement] = useState(null);

  const playAdvancementSound = () => {
    const sound = new Audio("/sounds/advancement_sound.mp3");
    sound.play();
  };

  const addWord = (event) => {
    event.preventDefault();

    const newWord = {
      word: word,
      meaning: meaning,
      wordType: wordType,
      userId: Cookies.get('userId'),
    };

    axios
      .post("http://localhost:8080/wordsTeacher/words", newWord, {
        headers: {
          Authorization: `${Cookies.get("token") || ""}`,
        },
      })
      .then((response) => {
        setUpdatedWords(response.data);
        setWord("");
        setMeaning("");
      });

    axios
      .post("http://localhost:8080/wordsTeacher/dictionary", newWord, {
        headers: {
          Authorization: `${Cookies.get("token") || ""}`,
        },
      })
      .then((response) => {
        setUpdatedDictionaryWords(response.data.dictionaryDtos);
        setAdvancement(response.data.advancement ?? null);
        if (response.data.advancement) {
          playAdvancementSound();
          setTimeout(() => setAdvancement(null), 5000);
        }
      });
  };

  return (
    <div id="addWords" className="tab-pane fade">
      <h2>Add New Words</h2>
      <div className="center-box">
        {advancement && (
          <div className="advancement-message">
            <h3>{advancement}</h3>
          </div>
        )}
        <form id="wordInputForm" onSubmit={addWord}>
          <h3>Word:</h3>
          <input
            id="word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            name="word"
            type="text"
            required
          />
          <h3>Meaning:</h3>
          <input
            id="meaning"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            name="meaning"
            type="text"
            required
          />
          <select onChange={(e) => setWordType(e.target.value)}>
            <option value={"word"}>Word</option>
            <option value={"difficult"}>Difficult Verb</option>
          </select>
          <button type="submit" className="btn-warning">
            Add Word
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddWord;
