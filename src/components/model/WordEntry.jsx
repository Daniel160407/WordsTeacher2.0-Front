const WordEntry = ({ word }) => {
    return (
        <div className="dictionary-entry">
            <span className="dictionary-word">{word.word} -</span>
            <span className="dictionary-meaning">{word.meaning}</span>
            <div className="word-level">
                <p>{word.level}</p>
            </div>
        </div>
    );
};

export default WordEntry;