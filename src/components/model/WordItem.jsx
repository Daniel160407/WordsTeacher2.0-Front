import { useState } from "react";
import Cookies from "js-cookie";
import EditWordForm from "../forms/EditWordForm";
import getAxiosInstance from "../util/GetAxiosInstance";

const WordItem = ({
  word,
  setWords,
  setUpdatedWords,
  setUpdatedDictionaryWords,
  checkboxesRef,
}) => {
  const [visibleWord, setVisibleWord] = useState(null);
  const [editWord, setEditWord] = useState(null);
  let touchTimeout = null;

  const handleContextMenu = () => {
    setVisibleWord(word.word === visibleWord ? null : word.word);
  };

  const handleTouchStart = () => {
    touchTimeout = setTimeout(handleContextMenu, 500);
  };

  const handleTouchEnd = () => {
    if (touchTimeout) clearTimeout(touchTimeout);
  };

  const handleEdit = () => {
    setEditWord(word.word);
  };

  const handleRemove = async () => {
    const userId = Cookies.get("userId");
    const languageId = Cookies.get("languageId");

    try {
      const response = await getAxiosInstance(
        `/wordsTeacher/words?word=${word.word}&meaning=${word.meaning}&wordtype=${word.wordType}&userid=${userId}&languageid=${languageId}`,
        "delete"
      );

      setWords(response.data);
      setUpdatedWords(response.data);

      const dictionaryResponse = await getAxiosInstance(
        `/wordsTeacher/dictionary?word=${word.word}&meaning=${word.meaning}&userid=${userId}&languageid=${languageId}`,
        "delete"
      );

      setUpdatedDictionaryWords(dictionaryResponse.data);
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  return (
    <div
      className="word"
      onContextMenu={(e) => {
        e.preventDefault();
        handleContextMenu();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
      <div>
        <input
          className="checkbox"
          type="checkbox"
          ref={(el) => (checkboxesRef.current[word.word] = el)}
        />
      </div>
    </div>
  );
};

export default WordItem;
