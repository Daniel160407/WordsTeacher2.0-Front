import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LanguageList = ({ languages, isBlocked, setUpdatedWords, setLanguageId, fetchLanguages }) => {
    const [showRemoveButton, setShowRemoveButton] = useState(null);

    const removeLanguage = (language) => {
        if (isBlocked) return;

        axios
            .delete(`${API_BASE_URL}/language?language=${language}&userid=${Cookies.get("userId")}`, {
                headers: { Authorization: `${Cookies.get("token") || ""}` },
            })
            .then(fetchLanguages)
            .catch((error) => console.error("Failed to remove language:", error));
    };

    const handleLanguageClick = (language) => {
        if (isBlocked) {
            alert("Language switching is blocked. Please upgrade to premium.");
            return;
        }

        axios
            .get(`${API_BASE_URL}/language/id?language=${language}&userid=${Cookies.get("userId")}`, {
                headers: { Authorization: `${Cookies.get("token") || ""}` },
            })
            .then((response) => {
                const languageId = response.data;
                axios
                    .get(
                        `${API_BASE_URL}/wordsTeacher/words?wordstype=word&userid=${Cookies.get("userId")}&languageid=${languageId}&tests=false`,
                        {
                            headers: { Authorization: `${Cookies.get("token") || ""}` },
                        }
                    )
                    .then((response) => setUpdatedWords(response.data));
                setLanguageId(languageId);
            });
    };

    const handleLanguageDoubleClick = (language, event) => {
        if (isBlocked) return;
        if (event.type === "dblclick" || (event.type === "contextmenu" && event.button === 2)) {
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
                        <button onClick={() => removeLanguage(language.language)} className="remove-button">
                            Remove
                        </button>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default LanguageList;
