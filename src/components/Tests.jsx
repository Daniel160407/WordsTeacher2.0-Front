import axios from "axios";
import { useEffect, useState } from "react";
import '../style/Tests.scss';

const Tests = ({updatedWords}) => {
    const [language, setLanguage] = useState('GEO');
    const [wordsList, setWordsList] = useState('words');
    const [words, setWords] = useState([]);
    const [meanings, setMeanings] = useState([]);
    const [inputs, setInputs] = useState({});
    const [overallFeedback, setOverallFeedback] = useState({});

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    useEffect(() => {
        const fetchData = async (url) => {
            const response = await axios.get(url);
            return response.data;
        };

        const getData = async () => {
            let data = [];
            if (wordsList === 'words') {
                data = await fetchData('http://localhost:8080/wordsTeacher/words');
            } else if (wordsList === 'droppedWords') {
                data = await fetchData('http://localhost:8080/wordsTeacher/dropper');
            } else if (wordsList === 'all') {
                const data1 = await fetchData('http://localhost:8080/wordsTeacher/words');
                const data2 = await fetchData('http://localhost:8080/wordsTeacher/dropper');
                data = [...data1, ...data2];
            }

            shuffleArray(data);

            if (language === 'GEO') {
                setWords(data.map(item => item.word));
                setMeanings(data.map(item => item.meaning));
            } else {
                setWords(data.map(item => item.meaning));
                setMeanings(data.map(item => item.word));
            }

            setInputs({});
            setOverallFeedback({});
        };

        getData();
    }, [language, wordsList]);

    useEffect(() => {
        if(updatedWords.length > 0){
            shuffleArray(updatedWords);

            if (language === 'GEO') {
                setWords(updatedWords.map(item => item.word));
                setMeanings(updatedWords.map(item => item.meaning));
            } else {
                setWords(updatedWords.map(item => item.meaning));
                setMeanings(updatedWords.map(item => item.word));
            }
        }
    }, [updatedWords]);

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
                <select onChange={handleChangeLanguage}>
                    <option value="GEO">GEO</option>
                    <option value="DEU">DEU</option>
                </select>
                <select onChange={handleChangeWords}>
                    <option value="words">Words</option>
                    <option value="droppedWords">Dropped Words</option>
                    <option value="all">All</option>
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
