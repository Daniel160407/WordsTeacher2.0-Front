import axios from "axios";
import { useEffect, useState } from "react";
import '../style/Dictionary.scss'

const Dictionary = ({ updatedWords }) => {
    const [words, setWords] = useState([]);

    useEffect(() => {
        const fetchWords = async () => {
            try {
                const response = await axios.get('http://localhost:8080/wordsTeacher/dictionary');
                setWords(response.data);
            } catch (error) {
                console.error("There was an error fetching the dictionary data!", error);
            }
        };

        fetchWords();
    }, []);

    useEffect(() => {
        if (updatedWords && updatedWords.length > 0) {
            setWords(updatedWords);
        }
    }, [updatedWords]);

    const groupWordsByFirstLetter = (words) => {
        const articles = ["der", "die", "das"];
        const groups = words.reduce((acc, word) => {
            let actualWord = word.word;
            articles.forEach(article => {
                if (actualWord.toLowerCase().startsWith(article + ' ')) {
                    actualWord = actualWord.substring(article.length + 1);
                }
            });

            const firstLetter = actualWord.charAt(0).toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(word);
            return acc;
        }, {});

        return groups;
    };

    const groupedWords = groupWordsByFirstLetter(words);

    return (
        <div id="dictionary" className="dictionary-container tab-pane fade">
            {Object.keys(groupedWords).sort().map(letter => (
                <div key={letter} className="dictionary-section">
                    <h2 className="dictionary-letter">{letter}</h2>
                    {groupedWords[letter].map((word, index) => (
                        <p key={word.word + word.meaning + index} className="dictionary-entry">
                            <span className="dictionary-word">{word.word} -</span>
                            <span className="dictionary-meaning">{word.meaning}</span>
                        </p>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Dictionary;