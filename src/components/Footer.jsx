import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "../style/Footer.scss";
import PricingTable from "./freemius/PricingTable";

const Footer = ({ setUpdatedWords, setLanguageId }) => {
    const [languages, setLanguages] = useState([]);
    const [newLanguage, setNewLanguage] = useState("");
    const [showRemoveButton, setShowRemoveButton] = useState(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockMessage, setBlockMessage] = useState("");

    useEffect(() => {
        setIsBlocked(Cookies.get('plan') === 'free');
        fetchLanguages();
    }, []);

    const handleApiError = (error) => {
        if (error.response?.status === 403) {
            setIsBlocked(true);
            setBlockMessage(error.response.data.message || "This feature requires a premium subscription");
        }
    };

    const fetchLanguages = () => {
        axios
            .get(`http://localhost:8080/language?userid=${Cookies.get('userId')}`, {
                headers: {
                    Authorization: `${Cookies.get("token") || ""}`,
                },
            })
            .then((response) => {
                setLanguages(response.data);
            })
            .catch((error) => {
                handleApiError(error);
                console.error("Failed to fetch languages:", error);
            });
    };

    const addLanguage = () => {
        if (isBlocked) return;
        if (!newLanguage.trim()) return;

        const language = {
            language: newLanguage,
            userId: Cookies.get('userId'),
        };

        axios
            .post(`http://localhost:8080/language`, language, {
                headers: {
                    Authorization: `${Cookies.get("token") || ""}`,
                },
            })
            .then(() => {
                setNewLanguage("");
                fetchLanguages();
            })
            .catch((error) => {
                handleApiError(error);
                console.error("Failed to add language:", error);
            });
    };

    const removeLanguage = (language) => {
        if (isBlocked) return;
        axios
            .delete(`http://localhost:8080/language?language=${language}&userid=${Cookies.get('userId')}`, {
                headers: {
                    Authorization: `${Cookies.get("token") || ""}`,
                },
            })
            .then(() => {
                fetchLanguages();
            })
            .catch((error) => {
                handleApiError(error);
                console.error("Failed to remove language:", error);
            });
    };

    const handleLanguageDoubleClick = (language, event) => {
        if (isBlocked) return;
        if (event.type === "dblclick" || (event.type === "contextmenu" && event.button === 2)) {
            event.preventDefault();
            setShowRemoveButton(language);
        }
    };

    const handleLanguageClick = (language) => {
        if (isBlocked) {
            alert("Language switching is blocked. Please upgrade to premium.");
            return;
        }

        axios.get(`http://localhost:8080/language/id?language=${language}&userid=${Cookies.get('userId')}`, {
            headers: {
                Authorization: `${Cookies.get("token") || ""}`,
            },
        })
            .then(response => {
                const languageId = response.data;
                axios.get(`http://localhost:8080/wordsTeacher/words?wordstype=word&userid=${Cookies.get('userId')}&languageid=${languageId}`, {
                    headers: {
                        Authorization: `${Cookies.get("token") || ""}`,
                    },
                })
                    .then(response => {
                        setUpdatedWords(response.data);
                    });
                setLanguageId(languageId);
            });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            addLanguage();
        }
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    };

    return (
        <div className="footer">
            <h3 className="footer-heading">Your languages</h3>
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
            <div className={`add-language ${isBlocked ? "blocked" : ""}`}>
                {isBlocked && (
                    <div className="blocked-overlay">
                        <div className="blocked-content">
                            <div className="lock-icon">🔒</div>
                            <h3>Premium Feature Locked</h3>
                            <p>{blockMessage}</p>
                            <button className="subscribe-button" onClick={scrollToBottom}>
                                Upgrade to Unlock
                            </button>
                        </div>
                    </div>
                )}
                <h3>Add new language</h3>
                <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter language"
                    disabled={isBlocked}
                />
                <button onClick={addLanguage} className="add-button" disabled={isBlocked}>
                    Add
                </button>
            </div>

            {Cookies.get('plan') === 'free' && <PricingTable />}
        </div>
    );
};

export default Footer;