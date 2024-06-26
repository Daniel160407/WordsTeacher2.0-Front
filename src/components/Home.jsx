import axios from "axios";
import { useEffect, useState, useRef } from "react";
import '../style/Home.scss';

// eslint-disable-next-line react/prop-types
const Home = ({ updatedWords }) => {
    const [words, setWords] = useState([]);
    const checkboxesRef = useRef({});

    useEffect(() => {
        axios.get('http://localhost:8080/wordsTeacher/words')
            .then(response => {
                setWords(response.data);
            });
    }, []);

    useEffect(() => {
        if (updatedWords !== '') {
            setWords(updatedWords);
        }
    }, [updatedWords]);

    const sendWords = () => {
        const checkedWords = words.filter(word => checkboxesRef.current[word.word]?.checked);
        axios.put('http://localhost:8080/wordsTeacher/dropper', checkedWords)
            .then(response => {
                setWords(response.data);
            });
    };

    return (
        <div id="words" className="tab-pane fade show active">
            {words.map(word => (
                <div className="word" key={word.word + word.meaning}>
                    <h1>{word.word} - {word.meaning}</h1>
                    <input 
                        type="checkbox"
                        ref={el => checkboxesRef.current[word.word] = el}
                    />
                </div>
            ))}
            <button type="button" className="btn btn-warning" onClick={sendWords}>Send</button>
        </div>
    );
}

export default Home;
