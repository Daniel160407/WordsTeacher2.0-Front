import axios from "axios";
import { useEffect, useState } from "react";
import '../style/Home.scss';

// eslint-disable-next-line react/prop-types
const Home = ({updatedWords}) => {
    const [words, setWords] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/wordsTeacher/words')
            .then(response => {
                setWords(response.data);
            });
    }, []);

    useEffect(() => {
        if(updatedWords !== ''){
            setWords(updatedWords);
        }
    }, [updatedWords])

    return (
        <div id="words" className="tab-pane fade show active">
            {words.map(word => (
                <div className="word" key={word.word + word.meaning}>{word.word} - {word.meaning}</div>
            ))}
        </div>
    );
}
export default Home;