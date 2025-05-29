import Cookies from "js-cookie";
import "../style/Dictionary.scss";
import { useEffect, useState } from "react";
import SearchBar from "./uiComponents/SearchBar";
import DictionaryWordList from "./model/DictionaryWordList";
import getAxiosInstance from "./util/GetAxiosInstance";
import WordLevelStats from "./uiComponents/WordLevelStates";

const Dictionary = ({ setDictionaryWords, updatedWords, languageId }) => {
  const [words, setWords] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (languageId !== null && languageId !== undefined) {
      Cookies.set("languageId", languageId, { expires: 7 });
    }

    const fetchWords = async () => {
      try {
        const response = await getAxiosInstance(
          `/wordsTeacher/dictionary?type=all&userid=${Cookies.get(
            "userId"
          )}&languageid=${Cookies.get("languageId")}&tests=${false}`,
          "get"
        );
        setWords(response.data.dictionaryDtos);
        setDictionaryWords(response.data.dictionaryDtos);
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
      <div className="word-count-label">
        <strong>Words in Dictionary:</strong> {words.length}
      </div>      
      <DictionaryWordList words={words} search={search} />
    </div>
  );
};

export default Dictionary;
