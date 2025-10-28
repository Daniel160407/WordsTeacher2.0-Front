import { useState } from "react";
import getAxiosInstance from "../util/GetAxiosInstance";

const AddWordForm = ({
  wordData,
  languageLevel,
  advancement,
  handleChange,
  handleLanguageLevelChange,
  addWord,
}) => {
  const [promptDetails, setPromptDetails] = useState({
    thema: "",
    quantity: 5,
    translateFrom: "",
    translateTo: "",
    languageLevel,
  });
  const [generatedWords, setGeneratedWords] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateExamples = async () => {
    const prompt = `Generate 3 example sentences in ${languageLevel}, where the word: ${wordData.word} is used, one per line, without any extra text`;
    const response = await getAxiosInstance("/wordsTeacher/genai", "post", {
      prompt,
    });

    if (response?.status === 200) {
      handleChange({
        target: { name: "example", value: response.data },
      });
    }
  };

  const handlePromptDetailsChange = (e) => {
    setPromptDetails({ ...promptDetails, [e.target.name]: e.target.value });
  };

  const handleGeminiWordsSubmit = async (event) => {
    event.preventDefault();
    setIsGenerating(true);

    const prompt = `Generate ${promptDetails.quantity} words in ${promptDetails.translateFrom} with translations in ${promptDetails.translateTo} of level ${promptDetails.languageLevel} and about thema: ${promptDetails.thema}. If there is a noun, start its article with uppercase letter. Return only a JSON array in this format: [{"word": "word1", "meaning": "translation"}, ...] without any additional text, explanations, or markdown formatting.`;

    try {
      const response = await getAxiosInstance("/wordsTeacher/genai", "post", {
        prompt,
      });

      if (response?.status === 200) {
        console.log("Raw response:", response.data);

        let cleanedResponse = response.data;

        console.log("Cleaned response:", cleanedResponse);

        try {
          if (typeof cleanedResponse === "string") {
            cleanedResponse = JSON.parse(cleanedResponse);
          }

          if (Array.isArray(cleanedResponse)) {
            setGeneratedWords(cleanedResponse);
          } else {
            console.error("Generated words is not an array:", cleanedResponse);
            alert("Invalid response format from AI. Please try again.");
          }
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            try {
              const parsedData = JSON.parse(jsonMatch[0]);
              setGeneratedWords(parsedData);
            } catch (secondError) {
              console.error("Second parse error:", secondError);
              alert("Error parsing generated words. Please try again.");
            }
          } else {
            alert("Could not parse generated words. Please try again.");
          }
        }
      }
    } catch (error) {
      console.error("Error generating words:", error);
      alert("Error generating words. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveClick = (word) => {
    handleChange({ target: { name: "word", value: word.word } });
    handleChange({ target: { name: "meaning", value: word.meaning } });
    word.example = "";
    word.wordType = "word";

    addWord({ preventDefault: () => {} }, word);
  };

  return (
    <div id="addWords">
      {advancement && (
        <div className="advancement-message fade-in">
          <h3>{advancement}</h3>
        </div>
      )}

      <div className="center-box">
        <form id="wordInputForm" onSubmit={(e) => addWord(e)}>
          <h3>Word:</h3>
          <input
            name="word"
            value={wordData.word}
            onChange={handleChange}
            type="text"
            required
          />
          <h3>Meaning:</h3>
          <input
            name="meaning"
            value={wordData.meaning}
            onChange={handleChange}
            type="text"
            required
          />
          <h3>Usage Examples:</h3>
          <textarea
            name="example"
            value={wordData.example}
            onChange={handleChange}
            placeholder="Enter example sentences (separate with new lines)..."
            rows="3"
          />
          <button
            type="button"
            className="generate-button"
            onClick={handleGenerateExamples}
          >
            Generate Examples with AI
          </button>

          <div className="meta-data">
            <select
              name="wordType"
              value={wordData.wordType}
              onChange={handleChange}
            >
              <option value="word">Word</option>
              <option value="difficult">Difficult Verb</option>
              <option value="redemittel">Redemittel</option>
            </select>
            <select
              className="level"
              value={languageLevel}
              onChange={handleLanguageLevelChange}
            >
              <option>A1</option>
              <option>A2</option>
              <option>B1</option>
              <option>B2</option>
              <option>C1</option>
              <option>C2</option>
            </select>
          </div>
          <button type="submit" className="save-button">
            Add Word
          </button>
        </form>

        <form className="gemini-word-form" onSubmit={handleGeminiWordsSubmit}>
          <input
            name="thema"
            type="text"
            value={promptDetails.thema}
            onChange={handlePromptDetailsChange}
            placeholder="Thema"
          />
          <input
            name="quantity"
            type="number"
            value={promptDetails.quantity}
            onChange={handlePromptDetailsChange}
            placeholder="Quantity"
          />
          <input
            name="translateFrom"
            type="text"
            value={promptDetails.translateFrom}
            onChange={handlePromptDetailsChange}
            placeholder="Translate from"
          />
          <input
            name="translateTo"
            type="text"
            value={promptDetails.translateTo}
            onChange={handlePromptDetailsChange}
            placeholder="Translate to"
          />
          <button type="submit" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Words with AI"}
          </button>
        </form>

        {generatedWords.length > 0 && (
          <div className="generated-words-container fade-in">
            <h3>Generated Words ({generatedWords.length})</h3>
            {generatedWords.map((word, index) => (
              <div key={index} className="generated-word-item">
                <div>
                  <p>
                    <span className="word">{word.word}</span> -{" "}
                    <span className="meaning">{word.meaning}</span>
                  </p>
                  <button type="button" onClick={() => handleSaveClick(word)}>
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddWordForm;
