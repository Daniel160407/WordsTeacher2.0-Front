import { useState } from "react";
import Cookies from "js-cookie";
import { FaEdit, FaTrash, FaEye, FaTimes, FaLightbulb } from "react-icons/fa";
import EditWordForm from "../forms/EditWordForm";
import getAxiosInstance from "../util/GetAxiosInstance";

const WordItem = ({
  word,
  setWords,
  wordType,
  setUpdatedWords,
  setUpdatedDictionaryWords,
  checkboxesRef,
}) => {
  const [visibleWord, setVisibleWord] = useState(null);
  const [editWord, setEditWord] = useState(null);
  const [showExamples, setShowExamples] = useState(false);
  let touchTimeout = null;

  const getMarkerColor = () => {
    switch (wordType) {
      case "Verb":
        return "#4CAF50";
      case "Adjektiv":
        return "#9C27B0";
      case "Substantiv":
        return "#2196F3";
      default:
        return "#fff700";
    }
  };

  const toggleContextMenu = () => {
    setVisibleWord(word.word === visibleWord ? null : word.word);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    toggleContextMenu();
  };

  const handleDoubleClick = () => {
    toggleContextMenu();
  };

  const handleEdit = () => {
    setEditWord(word.word);
    setVisibleWord(null);
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
    setVisibleWord(null);
  };

  const toggleExamples = () => {
    setShowExamples(!showExamples);
    setVisibleWord(null);
  };

  const renderExamples = () => {
    if (!word.example) {
      return <p>No examples available for this word.</p>;
    }

    return (
      <ul className="examples-list">
        {word.example.split('\n').map((ex, index) => (
          <li key={index} className="example-item">
            {ex}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div
      className="word"
      style={{ borderLeft: `3px solid ${getMarkerColor()}` }}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
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
        <>
          <h1>
            {word.word} - {word.meaning}
          </h1>
          {showExamples && (
            <div className="examples-container">
              <div className="examples-header">
                <h3>Usage Examples</h3>
              </div>
              {renderExamples()}
              <button 
                className="close-examples-btn"
                onClick={() => setShowExamples(false)}
              >
                Close
              </button>
            </div>
          )}
        </>
      )}

      {visibleWord === word.word && (
        <div className="context-menu">
          <div className="menu-item" onClick={handleEdit}>
            <FaEdit className="icon" />
            <span>Edit</span>
          </div>
          <div className="menu-item" onClick={handleRemove}>
            <FaTrash className="icon" />
            <span>Remove</span>
          </div>
          <div className="menu-item" onClick={toggleExamples}>
            <FaEye className="icon" />
            <span>Examples</span>
          </div>
        </div>
      )}

      <div className="word-controls">
        <input
          className="checkbox"
          type="checkbox"
          ref={(el) => (checkboxesRef.current[word.word] = el)}
        />
        <button className="bulb-icon" onClick={toggleExamples}>
          <FaLightbulb />
        </button>
      </div>
    </div>
  );
};

export default WordItem;