import axios from "axios";
import { useEffect, useState } from "react";
import '../style/Tests.scss';

const Tests = () => {
    const [language, setLanguage] = useState('GEO');
    const [words, setWords] = useState([]);
    const [meanings, setMeanings] = useState([]);
    const [inputs, setInputs] = useState({});
    const [overallFeedback, setOverallFeedback] = useState({});

    useEffect(() => {
        axios.get('http://localhost:8080/wordsTeacher/words')
            .then(response => {
                const data = response.data;
                if (language === 'GEO') {
                    setWords(data.map(item => item.word));
                    setMeanings(data.map(item => item.meaning));
                } else {
                    setWords(data.map(item => item.meaning));
                    setMeanings(data.map(item => item.word));
                }

                setInputs({});
                setOverallFeedback({});
            });
    }, [language]);

    const handleInputChange = (e, index) => {
        const { value } = e.target;
        setInputs(prevInputs => ({ ...prevInputs, [index]: value }));
    };

    const handleChangeLanguage = (e) => {
        setLanguage(e.target.value);
    };

    const checkAnswers = () => {
        const feedback = {};
        words.forEach((word, index) => {
            if (inputs[index] && inputs[index].toLowerCase() === meanings[index].toLowerCase()) {
                feedback[index] = '✅';
            } else {
                feedback[index] = '❌';
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
                {words.map((word, index) => (
                    <div className="word" key={word}>
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
