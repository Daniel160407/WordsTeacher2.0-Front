import React from 'react';
import PropTypes from 'prop-types';

const TestInput = ({ words, inputs, handleInputChange, overallFeedback, isBlocked }) => {
  return (
    <div id="test-inputs">
      {words.map((word, index) => (
        <div key={index} className="word-input">
          <label htmlFor={`word-${index}`} className="word-label">
            {word}
          </label>
          <input
            id={`word-${index}`}
            type="text"
            value={inputs[index] || ""}
            onChange={(e) => handleInputChange(e, index)}
            disabled={isBlocked}
            className={`word-input-field ${overallFeedback[index] ? 'feedback' : ''}`}
            placeholder="Your translation"
          />
          {overallFeedback[index] && (
            <span className="feedback-message">
              {overallFeedback[index]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

TestInput.propTypes = {
  words: PropTypes.array.isRequired,
  inputs: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  overallFeedback: PropTypes.object.isRequired,
  isBlocked: PropTypes.bool.isRequired,
};

export default TestInput;
