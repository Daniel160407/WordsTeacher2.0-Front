import { useState } from "react";
import Cookies from "js-cookie";
import getAxiosInstance from "../util/GetAxiosInstance";

const LanguageList = ({
  languages,
  isBlocked,
  setUpdatedWords,
  setLanguageId,
  fetchLanguages,
}) => {
  const [showRemoveButton, setShowRemoveButton] = useState(null);

  const removeLanguage = async (language) => {
    if (isBlocked) return;

    try {
      await getAxiosInstance(
        `/language?language=${language}&userid=${Cookies.get("userId")}`,
        "delete"
      );
      fetchLanguages();
    } catch (error) {
      console.error("Failed to remove language:", error);
    }
  };

  const handleLanguageClick = async (language) => {
    if (isBlocked) {
      alert("Language switching is blocked. Please upgrade to premium.");
      return;
    }

    try {
      const response = await getAxiosInstance(
        `/language/id?language=${language}&userid=${Cookies.get("userId")}`,
        "get"
      );

      const languageId = response.data;
      setLanguageId(languageId);

      const wordsResponse = await getAxiosInstance(
        `/wordsTeacher/words?wordstype=word&userid=${Cookies.get(
          "userId"
        )}&languageid=${languageId}&tests=false`,
        "get"
      );

      setUpdatedWords(wordsResponse.data);
    } catch (error) {
      console.error("Error fetching language data:", error);
    }
  };

  const handleLanguageDoubleClick = (language, event) => {
    if (isBlocked) return;
    if (
      event.type === "dblclick" ||
      (event.type === "contextmenu" && event.button === 2)
    ) {
      event.preventDefault();
      setShowRemoveButton(language);
    }
  };

  return (
    <ul className="language-list">
      {languages.map((language, index) => (
        <li
          key={index}
          className="language-item"
          onDoubleClick={(e) => handleLanguageDoubleClick(language.language, e)}
          onContextMenu={(e) => handleLanguageDoubleClick(language.language, e)}
          onClick={() => handleLanguageClick(language.language)}
        >
          {language.language}
          {showRemoveButton === language.language && (
            <button
              onClick={() => removeLanguage(language.language)}
              className="remove-button"
            >
              Remove
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default LanguageList;
