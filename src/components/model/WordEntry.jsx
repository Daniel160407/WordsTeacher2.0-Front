const WordEntry = ({ word }) => {
    return (
        <p className="dictionary-entry">
            <span className="dictionary-word">{word.word} -</span>
            <span className="dictionary-meaning">{word.meaning}</span>
        </p>
    );
};

export default WordEntry;
