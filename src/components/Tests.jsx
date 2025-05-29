import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import "../style/Tests.scss";
import Timer from "./uiComponents/Timer";
import WordInput from "./uiComponents/WordInput";
import BlockedOverlay from "./uiComponents/BlockedOverlay";
import TimeUpModal from "./uiComponents/TimeUpModal";
import getAxiosInstance from "./util/GetAxiosInstance";

const Tests = ({ updatedWords, newLanguageId }) => {
  const [language, setLanguage] = useState("GEO");
  const [wordsList, setWordsList] = useState("words");
  const [allWords, setAllWords] = useState({});
  const [words, setWords] = useState([]);
  const [meanings, setMeanings] = useState([]);
  const [inputs, setInputs] = useState({});
  const [overallFeedback, setOverallFeedback] = useState({});
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [answersChecked, setAnswersChecked] = useState(false);
  const [firstLetter, setFirstLetter] = useState("");
  const [timerChecked, setTimerChecked] = useState(false);
  const [timerTime, setTimerTime] = useState(60);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockMessage, setBlockMessage] = useState("");
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  const resultsRef = useRef(null);
  const bottomRef = useRef(null);

  const handleApiError = (error) => {
    if (error.response?.status === 403) {
      setIsBlocked(true);
      setBlockMessage(error.response.data.message || "This feature requires a premium subscription");
    }
    return { data: [] };
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const sortDictionaryWords = (words) => {
    return words.sort((a, b) => {
      const normalizeWord = (word) => {
        if (!word) return "";
        const lowerWord = word.toLowerCase();
        if (
          lowerWord.startsWith("der ") ||
          lowerWord.startsWith("die ") ||
          lowerWord.startsWith("das ")
        ) {
          return lowerWord.slice(4);
        }
        if (lowerWord.startsWith("sich ")) {
          return lowerWord.slice(5);
        }
        return lowerWord;
      };
      return normalizeWord(a.word).localeCompare(normalizeWord(b.word));
    });
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReloadClick = () => {
    const filteredWords = 
      wordsList === "dictionary" && firstLetter
        ? allWords.dictionary.filter(
            item => item.word[0].toUpperCase() === firstLetter ||
            ["der", "die", "das", "sich"].some(
              prefix => item.word.toLowerCase().startsWith(prefix + " ") &&
              item.word[4]?.toUpperCase() === firstLetter
            )
          )
        : allWords[wordsList];

    const shuffledWords = shuffleArray(filteredWords || []);
    setWords(shuffledWords.map(item => language === "GEO" ? item.word : item.meaning));
    setMeanings(shuffledWords.map(item => language === "GEO" ? item.meaning : item.word));
    setInputs({});
    setOverallFeedback({});
    setCorrectAnswersCount(0);
    setAnswersChecked(false);
    
    if (timerChecked) setTimerTime(60);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      const userId = Cookies.get("userId");
      const languageId = newLanguageId !== null ? newLanguageId : Cookies.get("languageId");
      if (!userId) return;

      const urls = {
        words: `/wordsTeacher/words?wordstype=word&userid=${userId}&languageid=${languageId}&tests=true`,
        difficult: `/wordsTeacher/words?wordstype=difficult&userid=${userId}&languageid=${languageId}&tests=true`,
        droppedWords: `/wordsTeacher/dropper?userid=${userId}&languageid=${languageId}&tests=true`,
        dictionary: `/wordsTeacher/dictionary?type=word&userid=${userId}&languageid=${languageId}&tests=true`,
        all: [
          `/wordsTeacher/words?wordstype=word&userid=${userId}&languageid=${languageId}&tests=true`,
          `/wordsTeacher/dropper?userid=${userId}&languageid=${languageId}&tests=true`,
        ],
      };

      try {
        const data = await Promise.all(
          Object.entries(urls).map(async ([key, url]) => {
            if (Array.isArray(url)) {
              const responses = await Promise.all(
                url.map((singleUrl) =>
                  getAxiosInstance(singleUrl, "get")
                    .then((res) => {
                      if (res?.status !== 403) {
                        Cookies.set("plan", "ultimate", { expires: 365 });
                      }
                      return res.data || [];
                    })
                    .catch(handleApiError)
                )
              );
              return { [key]: shuffleArray(responses.flat()) };
            } else {
              const res = await getAxiosInstance(url, "get").catch(handleApiError);
              let responseData = res?.data || [];
              if (key === "dictionary") responseData = sortDictionaryWords(responseData.dictionaryDtos);
              return { [key]: shuffleArray(responseData) };
            }
          })
        );
        setAllWords(Object.assign({}, ...data));
      } catch (error) {
        handleApiError(error);
      }
    };

    fetchAllData();
  }, [newLanguageId]);

  useEffect(() => {
    if (!allWords[wordsList] || isBlocked) return;

    const filteredWords =
      wordsList === "dictionary" && firstLetter
        ? allWords.dictionary.filter(
            (item) =>
              item.word[0].toUpperCase() === firstLetter ||
              ["der", "die", "das", "sich"].some(
                (prefix) =>
                  item.word.toLowerCase().startsWith(prefix + " ") &&
                  item.word[4]?.toUpperCase() === firstLetter
              )
          )
        : allWords[wordsList];

    const shuffledWords = shuffleArray(filteredWords);
    setWords(shuffledWords.map((item) => language === "GEO" ? item.word : item.meaning));
    setMeanings(shuffledWords.map((item) => language === "GEO" ? item.meaning : item.word));
    setInputs({});
    setOverallFeedback({});
    setCorrectAnswersCount(0);
    setAnswersChecked(false);
  }, [wordsList, language, firstLetter, allWords, isBlocked]);

  useEffect(() => {
    if (updatedWords.length > 0) {
      const shuffledWords = shuffleArray(updatedWords);
      setWords(shuffledWords.map((item) => language === "GEO" ? item.word : item.meaning));
      setMeanings(shuffledWords.map((item) => language === "GEO" ? item.meaning : item.word));
    }
  }, [updatedWords, language]);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    setInputs((prev) => ({ ...prev, [index]: value }));
  };

  const handleChangeLanguage = (e) => setLanguage(e.target.value);
  const handleChangeWords = (e) => setWordsList(e.target.value);

  const checkAnswers = () => {
    const feedback = {};
    let correctCount = 0;

    words.forEach((word, index) => {
      if (inputs[index]?.toLowerCase() === meanings[index].toLowerCase()) {
        feedback[index] = "✅";
        correctCount++;
      } else {
        feedback[index] = `❌ Correct: ${meanings[index]}`;
      }
    });

    setOverallFeedback(feedback);
    setCorrectAnswersCount(correctCount);
    setAnswersChecked(true);

    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTimeUp = () => setShowTimeUpModal(true);
  const closeTimeUpModal = () => setShowTimeUpModal(false);

  const wordCounts = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  const getFirstLetterHint = (index) => {
    const meaning = meanings[index];
    const word = words[index];
    return language === "DEU" && wordCounts[word] > 1 ? meaning[0] : "";
  };


  return (
    <div id="tests" className={`tab-pane fade ${isBlocked ? "blocked" : ""}`}>
      {isBlocked && <BlockedOverlay message={blockMessage} onUpgrade={scrollToBottom} />}
      {showTimeUpModal && <TimeUpModal onClose={closeTimeUpModal} />}

      <div>
        <select onChange={handleChangeLanguage} value={language}>
          <option value="GEO">GEO</option>
          <option value="DEU">DEU</option>
        </select>

        <select onChange={handleChangeWords} value={wordsList}>
          <option value="words">Words</option>
          <option value="droppedWords">Dropped Words</option>
          <option value="all">All</option>
          <option value="difficult">Difficult Verbs</option>
          <option value="dictionary">Dictionary</option>
        </select>

        {wordsList === "dictionary" && (
          <select value={firstLetter} onChange={(e) => setFirstLetter(e.target.value)}>
            <option value="">Select Letter</option>
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ".split("").map((letter) => (
              <option key={letter} value={letter}>{letter}</option>
            ))}
          </select>
        )}

        <div className="timer">
          <label htmlFor="timer">Timer</label>
          <input
            id="timer"
            type="checkbox"
            onChange={(e) => setTimerChecked(e.target.checked)}
          />
        </div>

        {timerChecked && <Timer timerTime={timerTime} setTimerTime={setTimerTime} onTimeUp={handleTimeUp} />}

        <div ref={resultsRef}>
          {answersChecked && (
            <div className="results-feedback">
              <p className="answers">Correct Answers: {correctAnswersCount} out of {words.length}</p>
              <div className="reload">
                <img 
                  src="/svg/reload.svg" 
                  alt="reload" 
                  onClick={handleReloadClick}
                  className="reload-icon"
                />
              </div>
            </div>
          )}
        </div>

        {words.map((word, index) => (
          <WordInput
            key={index}
            word={word}
            value={inputs[index]}
            onChange={(e) => handleInputChange(e, index)}
            disabled={isBlocked}
            feedback={overallFeedback[index]}
            firstLetterHint={getFirstLetterHint(index)}
          />
        ))}

        <button
          type="button"
          className="btn btn-warning"
          onClick={checkAnswers}
          disabled={isBlocked}
        >
          Check Answers
        </button>
      </div>

      <div ref={bottomRef}></div>
    </div>
  );
};

export default Tests;
