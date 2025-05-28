const WordInput = ({ word, value, onChange, disabled, feedback, firstLetterHint }) => {
  return (
    <div className="word">
      <h1>{word}</h1>
      <input
        type="text"
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={firstLetterHint ? `Starts with: ${firstLetterHint}` : ""}
      />
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default WordInput;
