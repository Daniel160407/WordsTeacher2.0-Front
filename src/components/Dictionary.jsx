import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import SearchBar from "./uiComponents/SearchBar";
import "../style/Dictionary.scss";
import DictionaryWordList from "./model/DictionaryWordList";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dictionary = ({ updatedWords, languageId }) => {
    const [words, setWords] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (languageId !== null && languageId !== undefined) {
            Cookies.set("languageId", languageId, { expires: 7 });
        }

        const fetchWords = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/wordsTeacher/dictionary?type=all&userid=${Cookies.get("userId")}&languageid=${Cookies.get("languageId")}&tests=${false}`,
                    {
                        headers: {
                            Authorization: `${Cookies.get("token") || ""}`,
                        },
                    }
                );
                setWords(response.data);
            } catch (error) {
                console.error("Error fetching dictionary data!", error);
            }
        };

        fetchWords();
    }, [languageId]);

    useEffect(() => {
        if (updatedWords && updatedWords.length > 0) {
            setWords(updatedWords);
        }
    }, [updatedWords]);

    return (
        <div id="dictionary" className="dictionary-container tab-pane fade">
            <SearchBar search={search} setSearch={setSearch} />
            <DictionaryWordList words={words} search={search} />
        </div>
    );
};

export default Dictionary;
