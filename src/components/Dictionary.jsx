import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import '../style/Dictionary.scss';

const Dictionary = ({ updatedWords, langueageId }) => {
    const [words, setWords] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (langueageId !== null) {
            Cookies.set('languageId', langueageId, {expires: 7});
        }
        const fetchWords = async () => {
            try {
                const response = await axios.get(`93.177.172.105:8080/wordsTeacher/dictionary?type=all&userid=${Cookies.get('userId')}&languageid=${Cookies.get('languageId')}&tests=${false}`, {
                        headers: {
                          Authorization: `${Cookies.get("token") || ""}`,
                        },
                      });
                setWords(response.data);
            } catch (error) {
                console.error("There was an error fetching the dictionary data!", error);
            }
        };

        fetchWords();
    }, [langueageId]);

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

    const filteredWords = search
        ? words.filter(word =>
            word.word.toLowerCase().includes(search.toLowerCase()) ||
            word.meaning.toLowerCase().includes(search.toLowerCase())
        )
        : words;

    const groupedWords = groupWordsByFirstLetter(filteredWords);

    return (
        <div id="dictionary" className="dictionary-container tab-pane fade">
            <input
                className="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by word or meaning..."
            />
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
