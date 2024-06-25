import axios from "axios";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
const AddWord = ({setUpdatedWords}) => {
    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');

    const addWord = (event) => {
        event.preventDefault();

        const newWord = {
            word: word,
            meaning: meaning
        }

        axios.post('http://localhost:8080/wordsTeacher/words', newWord)
            .then(response => {
                setUpdatedWords(response.data);
                setWord('');
                setMeaning('');
            });
    }

    return (
        <div id="addWords" className="tab-pane fade">
            <h2>Add new words</h2>
            <div className="center-box">
                <form id="wordInputForm" onSubmit={addWord}>
                    <h3>Word:</h3>
                    <input id="word" value={word} onChange={(e) => setWord(e.target.value)} name="word" type="text" required />
                    <h3>Meaning:</h3>
                    <input id="meaning" value={meaning} onChange={(e) => setMeaning(e.target.value)} name="meaning" type="text" required />
                    <h6 id="freeSlots"></h6>
                    <button type="submit">Add Word</button>
                </form>
            </div>
        </div>
    );
}

export default AddWord;
