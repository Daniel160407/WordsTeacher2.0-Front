import axios from "axios";
import { useEffect, useState, useRef } from "react";
import '../style/Home.scss';

// eslint-disable-next-line react/prop-types
const Home = ({ updatedWords, setUpdatedWords, setUpdatedDictionaryWords }) => {
    const [words, setWords] = useState([]);
    const [level, setLevel] = useState(0);
    const checkboxesRef = useRef({});
    const [visibleWord, setVisibleWord] = useState(null);
    const [editWord, setEditWord] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [meaningEditValue, setMeaningEditValue] = useState("");
    const [wordTypeEditValue, setWordTypeEditValue] = useState("");
    const [wordsType, setWordsType] = useState('word');

    useEffect(() => {
        axios.get(`http://localhost:8080/wordsTeacher/words?wordstype=${wordsType}`)
            .then(response => {
                setWords(response.data);
            });

        axios.get('http://localhost:8080/wordsTeacher/words/level')
            .then(response => {
                setLevel(response.data.level);
            });
    }, [wordsType]);

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
                axios.get('http://localhost:8080/wordsTeacher/words/level')
                    .then(response => {
                    setLevel(response.data.level);
                });
            });
            Object.values(checkboxesRef.current).forEach(checkbox => {
                if (checkbox) checkbox.checked = false;
            });
    };

    const handleContextMenu = (e, word) => {
        e.preventDefault();
        setVisibleWord(word.word === visibleWord ? null : word.word);
    };

    const handleEdit = (word) => {
        setEditWord(word.word);
        setEditValue(word.word);
        setMeaningEditValue(word.meaning);
        setWordTypeEditValue(word.wordType);
    };

    const handleEditChange = (e) => {
        setEditValue(e.target.value);
    };

    const handleMeaningEditChange = (e) => {
        setMeaningEditValue(e.target.value);
    }

    const handleKeyPress = (e, word) => {
        if(e.target.value === 'Enter'){
            handleSave(word);
        }
    }

    const handleSave = (word) => {
        const changedWord = {
            word: editValue,
            meaning: meaningEditValue,
            wordType: wordTypeEditValue
        }

        const changedWordArray = [word, changedWord];
        axios.put(`http://localhost:8080/wordsTeacher/words`, changedWordArray)
            .then(response => {
                setWords(response.data);
                setUpdatedWords(response.data);
                setEditWord(null);
                setEditValue("");

                axios.put('http://localhost:8080/wordsTeacher/dictionary', changedWordArray)
                    .then(response => {
                        setUpdatedDictionaryWords(response.data);
                    });
            });
    };

    const handleRemove = (word) => {
        axios.delete(`http://localhost:8080/wordsTeacher/words?word=${word.word}&meaning=${word.meaning}`)
            .then(response => {
                setWords(response.data);
                setUpdatedWords(response.data);

                axios.delete(`http://localhost:8080/wordsTeacher/dictionary?word=${word.word}&meaning=${word.meaning}`)
                    .then(response => {
                        setUpdatedDictionaryWords(response.data);
                    });
            });
    };

    return (
        <div id="words" className="tab-pane fade show active">
            <h1>Level {level}</h1>
            <select onChange={(e) => setWordsType(e.target.value)}>
                <option value={'word'}>Words</option>
                <option value={'difficult'}>Difficult Verbs</option>
            </select>
            {words.map(word => (
                <div 
                    className="word" 
                    key={word.word + word.meaning} 
                    onContextMenu={(e) => handleContextMenu(e, word)}
                >
                    {editWord === word.word ? (
                        <div className="editWordContainer">
                            <input 
                                type="text" 
                                className="edit-input" 
                                value={editValue} 
                                onChange={handleEditChange} 
                                onKeyPress={(e) => handleKeyPress(e, word)}
                            />
                            <input 
                                type="text" 
                                className="edit-input" 
                                value={meaningEditValue} 
                                onChange={handleMeaningEditChange} 
                                onKeyPress={(e) => handleKeyPress(e, word)}
                            />
                            <select className="editSelect" onChange={(e) => setWordTypeEditValue(e.target.value)}>
                                <option value={'word'}>Words</option>
                                <option value={'difficult'}>Difficult Verbs</option>
                            </select>
                            <button 
                                className="save-button btn btn-success" 
                                onClick={() => handleSave(word)}
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <h1>{word.word} - {word.meaning}</h1>
                    )}
                    {visibleWord === word.word && (
                        <div className="editWord">
                            <img className="edit" src="/svg/pencil.svg" alt="edit" onClick={() => handleEdit(word)} />
                            <img className="remove" src="/svg/trash.svg" alt="remove" onClick={() => handleRemove(word)} />
                        </div>
                    )}
                    <input 
                        className="checkbox"
                        type="checkbox"
                        ref={el => checkboxesRef.current[word.word] = el}
                    />
                </div>
            ))}
            <button id="send-button" type="button" className="btn btn-warning" onClick={sendWords}>Drop</button>
        </div>
    );
}

export default Home;
