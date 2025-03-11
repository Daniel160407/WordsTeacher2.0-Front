import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import EditWordForm from "../forms/EditWordForm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const WordItem = ({
  word,
  setWords,
  setUpdatedWords,
  setUpdatedDictionaryWords,
  checkboxesRef,
}) => {
  const [visibleWord, setVisibleWord] = useState(null);
  const [editWord, setEditWord] = useState(null);

  const handleContextMenu = () => {
    setVisibleWord(word.word === visibleWord ? null : word.word);
  };

  const handleEdit = () => {
    setEditWord(word.word);
  };

  const handleRemove = () => {
    axios
      .delete(
        `${API_BASE_URL}/wordsTeacher/words?word=${word.word}&meaning=${
          word.meaning
        }&wordtype=${word.wordType}&userid=${Cookies.get(
          "userId"
        )}&languageid=${Cookies.get("languageId")}`,
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
            `${API_BASE_URL}/wordsTeacher/dictionary?word=${
              word.word
            }&meaning=${word.meaning}&userid=${Cookies.get(
              "userId"
            )}&languageid=${Cookies.get("languageId")}&languageid=${Cookies.get(
              "languageId"
            )}`,
            {
              headers: {
                Authorization: `${Cookies.get("token") || ""}`,
              },
            }
          )
          .then((response) => setUpdatedDictionaryWords(response.data));
      });
  };

  return (
    <div
      className="word"
      onContextMenu={(e) => {
        e.preventDefault();
        handleContextMenu();
      }}
    >
      {editWord === word.word ? (
        <EditWordForm
          word={word}
          setEditWord={setEditWord}
          setWords={setWords}
          setUpdatedWords={setUpdatedWords}
          setUpdatedDictionaryWords={setUpdatedDictionaryWords}
        />
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
            onClick={handleEdit}
          />
          <img
            className="remove"
            src="/svg/trash.svg"
            alt="remove"
            onClick={handleRemove}
          />
        </div>
      )}
      <input
        className="checkbox"
        type="checkbox"
        ref={(el) => (checkboxesRef.current[word.word] = el)}
      />
    </div>
  );
};

export default WordItem;
