import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import getAxiosInstance from "./GetAxiosInstance";

const useFetchWords = (
  newLanguageId,
  wordsList,
  firstLetter,
  language,
  setIsBlocked,
  setBlockMessage
) => {
  const [allWords, setAllWords] = useState({});
  const [words, setWords] = useState([]);
  const [meanings, setMeanings] = useState([]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = Cookies.get("userId");
      const languageId = newLanguageId ?? Cookies.get("languageId");
      if (!userId) return;

      try {
        const response = await getAxiosInstance(
          `/wordsTeacher/words?wordstype=${wordsList}&userid=${userId}&languageid=${languageId}&tests=${true}`,
          "get"
        );

        setAllWords({ [wordsList]: shuffleArray(response.data || []) });
      } catch (error) {
        if (error.response?.status === 403) {
          setIsBlocked(true);
          setBlockMessage(
            error.response.data?.message ||
              "This feature requires a premium subscription."
          );
        }
      }
    };

    fetchData();
  }, [newLanguageId, wordsList, setIsBlocked, setBlockMessage]);

  useEffect(() => {
    if (!allWords[wordsList]) return;

    const filteredWords = allWords[wordsList].filter(
      (item) => !firstLetter || item.word[0].toUpperCase() === firstLetter
    );

    setWords(
      filteredWords.map((item) =>
        language === "GEO" ? item.word : item.meaning
      )
    );
    setMeanings(
      filteredWords.map((item) =>
        language === "GEO" ? item.meaning : item.word
      )
    );
  }, [allWords, wordsList, firstLetter, language]);

  return { words, meanings, setAllWords };
};

export default useFetchWords;
