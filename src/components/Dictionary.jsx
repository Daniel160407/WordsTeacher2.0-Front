import Cookies from "js-cookie";
import "../style/Dictionary.scss";
import { useEffect, useState } from "react";
import SearchBar from "./uiComponents/SearchBar";
import DictionaryWordList from "./model/DictionaryWordList";
import getAxiosInstance from "./util/GetAxiosInstance";

const Dictionary = ({ setDictionaryWords, updatedWords, languageId }) => {
  const [words, setWords] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedWord, setExpandedWord] = useState(null);

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
        setWords(response.data);
        setDictionaryWords(response.data);
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

  const toggleExamples = (word) => {
    if (expandedWord === word) {
      setExpandedWord(null);
    } else {
      setExpandedWord(word);
    }
  };

  return (
    <div id="dictionary" className="dictionary-container tab-pane fade">
      <SearchBar search={search} setSearch={setSearch} />
      <div className="word-count-label">
        <strong>Words in Dictionary:</strong> {words.length}
      </div>      
      <DictionaryWordList 
        words={words} 
        search={search} 
        expandedWord={expandedWord}
        toggleExamples={toggleExamples}
      />
    </div>
  );
};

export default Dictionary;