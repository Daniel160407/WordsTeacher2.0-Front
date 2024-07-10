import axios from "axios";
import { useEffect, useState } from "react";
import '../style/Tests.scss';

// eslint-disable-next-line react/prop-types
const Tests = ({ updatedWords }) => {
    const [language, setLanguage] = useState('GEO');
    const [wordsList, setWordsList] = useState('words');
    const [words, setWords] = useState([]);
    const [meanings, setMeanings] = useState([]);
    const [inputs, setInputs] = useState({});
    const [overallFeedback, setOverallFeedback] = useState({});

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    useEffect(() => {
        const fetchData = async (url) => {
            const response = await axios.get(url);
            return response.data;
        };

        const getData = async () => {
            let data = [];
            if (wordsList === 'words') {
                data = await fetchData(`http://localhost:8080/wordsTeacher/words?wordstype=word`);
            } else if(wordsList === 'difficult') {
                data = await fetchData(`http://localhost:8080/wordsTeacher/words?wordstype=difficult`);
            } else if (wordsList === 'droppedWords') {
                data = await fetchData('http://localhost:8080/wordsTeacher/dropper');
            } else if (wordsList === 'all') {
                const data1 = await fetchData('http://localhost:8080/wordsTeacher/words?wordstype=word');
                const data2 = await fetchData(`http://localhost:8080/wordsTeacher/words?wordstype=difficult`);
                const data3 = await fetchData('http://localhost:8080/wordsTeacher/dropper');
                data = [...data1, ...data2, ...data3];
            }

            const shuffledData = shuffleArray(data);

            if (language === 'GEO') {
                setWords(shuffledData.map(item => item.word));
                setMeanings(shuffledData.map(item => item.meaning));
            } else {
                setWords(shuffledData.map(item => item.meaning));
                setMeanings(shuffledData.map(item => item.word));
            }

            setInputs({});
            setOverallFeedback({});
        };

        getData();
    }, [language, wordsList]);

    useEffect(() => {
        if (updatedWords.length > 0) {
            const wordsCopy = [...updatedWords];
            const shuffledWords = shuffleArray(wordsCopy);

            if (language === 'GEO') {
                setWords(shuffledWords.map(item => item.word));
                setMeanings(shuffledWords.map(item => item.meaning));
            } else {
                setWords(shuffledWords.map(item => item.meaning));
                setMeanings(shuffledWords.map(item => item.word));
            }
        }
    }, [updatedWords, language]);

    const handleInputChange = (e, index) => {
        const { value } = e.target;
        setInputs(prevInputs => ({ ...prevInputs, [index]: value }));
    };

    const handleChangeLanguage = (e) => {
        setLanguage(e.target.value);
    };

    const handleChangeWords = (e) => {
        setWordsList(e.target.value);
    };

    const checkAnswers = () => {
        const feedback = {};
        words.forEach((word, index) => {
            if (inputs[index] && inputs[index].toLowerCase() === meanings[index].toLowerCase()) {
                feedback[index] = '✅';
            } else {
                feedback[index] = `❌ \n Correct: ${meanings[index]}`;
            }
        });
        setOverallFeedback(feedback);
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
                </select>
                {words.map((word, index) => (
                    <div className="word" key={index}>
                        <h1>{word}</h1>
                        <input
                            type="text"
                            value={inputs[index] || ''}
                            onChange={(e) => handleInputChange(e, index)}
                        />
                        {overallFeedback[index] && <p>{overallFeedback[index]}</p>}
                    </div>
                ))}
                <button type="button" className="btn btn-warning" onClick={checkAnswers}>Check Answers</button>
            </div>
        </div>
    );
}

export default Tests;
