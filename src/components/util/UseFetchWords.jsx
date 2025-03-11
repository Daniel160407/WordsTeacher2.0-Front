import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useFetchWords = (newLanguageId, wordsList, firstLetter, language, setIsBlocked, setBlockMessage) => {
  const [allWords, setAllWords] = useState({});
  const [words, setWords] = useState([]);
  const [meanings, setMeanings] = useState([]);

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchData = async () => {
      const userId = Cookies.get("userId");
      const languageId = newLanguageId ?? Cookies.get("languageId");
      if (!userId) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/wordsTeacher/words`, {
          params: { wordstype: wordsList, userid: userId, languageid: languageId, tests: true },
          headers: { Authorization: Cookies.get("token") || "" },
        });

        setAllWords({ [wordsList]: shuffleArray(response.data || []) });
      } catch (error) {
        if (error.response?.status === 403) {
          setIsBlocked(true);
          setBlockMessage(error.response.data.message || "This feature requires a premium subscription");
        }
      }
    };

    fetchData();
  }, [newLanguageId, wordsList]);

  useEffect(() => {
    if (!allWords[wordsList]) return;

    const filteredWords = allWords[wordsList].filter(
      (item) => !firstLetter || item.word[0].toUpperCase() === firstLetter
    );

    setWords(filteredWords.map((item) => (language === "GEO" ? item.word : item.meaning)));
    setMeanings(filteredWords.map((item) => (language === "GEO" ? item.meaning : item.word)));
  }, [wordsList, allWords, firstLetter, language]);

  return { words, meanings, setAllWords };
};

export default useFetchWords;
