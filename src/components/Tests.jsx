import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "../style/Tests.scss";

const Tests = ({ updatedWords }) => {
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
  const [timeLeft, setTimeLeft] = useState(timerTime);
  const [timerRunning, setTimerRunning] = useState(false);

  const resultsRef = useRef(null);
  const timerRef = useRef(null);

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
        const lowerWord = word.toLowerCase();
        if (lowerWord.startsWith("der ") || lowerWord.startsWith("die ") || lowerWord.startsWith("das ")) {
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

  useEffect(() => {
    const fetchAllData = async () => {
      const urls = {
        words: "http://localhost:8080/wordsTeacher/words?wordstype=word",
        difficult: "http://localhost:8080/wordsTeacher/words?wordstype=difficult",
        droppedWords: "http://localhost:8080/wordsTeacher/dropper",
        dictionary: "http://localhost:8080/wordsTeacher/dictionary?type=word",
        all: [
          "http://localhost:8080/wordsTeacher/words?wordstype=word",
          "http://localhost:8080/wordsTeacher/dropper",
        ],
      };

      try {
        const data = await Promise.all(
          Object.entries(urls).map(async ([key, url]) => {
            if (Array.isArray(url)) {
              const responses = await Promise.all(
                url.map((singleUrl) => axios.get(singleUrl))
              );
              const combinedData = responses.flatMap((response) => response.data);
              return { [key]: shuffleArray(combinedData) };
            } else {
              const response = await axios.get(url);
              let responseData = response.data;

              // Apply sorting logic for the dictionary
              if (key === "dictionary") {
                responseData = sortDictionaryWords(responseData);
              }

              return { [key]: shuffleArray(responseData) };
            }
          })
        );

        setAllWords(Object.assign({}, ...data));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (!allWords[wordsList]) return;

    const filteredWords =
      wordsList === "dictionary" && firstLetter
        ? allWords.dictionary.filter(
            (item) => item.word[0].toUpperCase() === firstLetter || 
                      (["der", "die", "das", "sich"].some(prefix => 
                        item.word.toLowerCase().startsWith(prefix + " ") && 
                        item.word[4]?.toUpperCase() === firstLetter))
          )
        : allWords[wordsList];

    const shuffledWords = shuffleArray(filteredWords);

    setWords(
      shuffledWords.map((item) =>
        language === "GEO" ? item.word : item.meaning
      )
    );
    setMeanings(
      shuffledWords.map((item) =>
        language === "GEO" ? item.meaning : item.word
      )
    );
    setInputs({});
    setOverallFeedback({});
    setCorrectAnswersCount(0);
    setAnswersChecked(false);
  }, [wordsList, language, firstLetter, allWords]);

  useEffect(() => {
    if (updatedWords.length > 0) {
      const shuffledWords = shuffleArray(updatedWords);
      setWords(
        shuffledWords.map((item) =>
          language === "GEO" ? item.word : item.meaning
        )
      );
      setMeanings(
        shuffledWords.map((item) =>
          language === "GEO" ? item.meaning : item.word
        )
      );
    }
  }, [updatedWords, language]);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [index]: value }));
  };

  const handleChangeLanguage = (e) => {
    setLanguage(e.target.value);
  };

  const handleChangeWords = (e) => {
    setWordsList(e.target.value);
  };

  const checkAnswers = () => {
    const feedback = {};
    let correctCount = 0;

    words.forEach((word, index) => {
      if (
        inputs[index] &&
        inputs[index].toLowerCase() === meanings[index].toLowerCase()
      ) {
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

  const startTimer = () => {
    if (timerRunning) return;
    setTimeLeft(timerTime);
    setTimerRunning(true);

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          setTimerRunning(false);
          alert("Time is up!");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimeLeft(0);
  };

  return (
    <div id="tests" className="tab-pane fade">
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
          <select
            value={firstLetter}
            onChange={(e) => setFirstLetter(e.target.value)}
          >
            <option value="">Select Letter</option>
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ".split("").map((letter) => (
              <option key={letter} value={letter}>
                {letter}
              </option>
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

        {timerChecked && (
          <div>
            <input
              type="number"
              value={timerTime}
              onChange={(e) => {
                const value = e.target.value;
                setTimerTime(value === "" ? "" : Number(value));
              }}
            />

            <div className="timerControlButtons">
              <button className="btn-gold" onClick={startTimer}>
                Start
              </button>
              <button className="btn-danger" onClick={stopTimer}>
                Stop
              </button>
            </div>
            <h3 id="time">{timeLeft}</h3>
          </div>
        )}

        <div ref={resultsRef}>
          {answersChecked && (
            <p>
              Correct Answers: {correctAnswersCount} out of {words.length}
            </p>
          )}
        </div>

        {words.map((word, index) => (
          <div className="word" key={index}>
            <h1>{word}</h1>
            <input
              type="text"
              value={inputs[index] || ""}
              onChange={(e) => handleInputChange(e, index)}
            />
            {overallFeedback[index] && <p>{overallFeedback[index]}</p>}
          </div>
        ))}
        <button
          type="button"
          className="btn btn-warning"
          onClick={checkAnswers}
        >
          Check Answers
        </button>
      </div>
    </div>
  );
};

export default Tests;
