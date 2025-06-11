import WordEntry from "./WordEntry";

const DictionaryWordList = ({ words, search, expandedWord, toggleExamples }) => {
    const groupWordsByFirstLetter = (words) => {
        const articles = ["der", "die", "das"];
        return words.reduce((acc, word) => {
            let actualWord = word.word;
            articles.forEach((article) => {
                if (actualWord.toLowerCase().startsWith(article + " ")) {
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
    };

    const filteredWords = search
        ? words.filter(
              (word) =>
                  word.word.toLowerCase().includes(search.toLowerCase()) ||
                  word.meaning.toLowerCase().includes(search.toLowerCase())
          )
        : words;

    const groupedWords = groupWordsByFirstLetter(filteredWords);

    return (
        <>
            {Object.keys(groupedWords)
                .sort()
                .map((letter) => (
                    <div key={letter} className="dictionary-section">
                        <h2 className="dictionary-letter">{letter}</h2>
                        {groupedWords[letter].map((word, index) => (
                            <WordEntry 
                                key={word.word + word.meaning + index} 
                                word={word} 
                                isExpanded={expandedWord === word}
                                toggleExamples={() => toggleExamples(word)}
                            />
                        ))}
                    </div>
                ))}
        </>
    );
};

export default DictionaryWordList;