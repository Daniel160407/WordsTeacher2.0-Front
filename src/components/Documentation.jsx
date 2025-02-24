import React from "react";
import "../style/Documentation.scss";

const Documentation = () => {
  return (
    <div className="documentation-container">
      <h1 className="title">📘 WordsTeacher App Documentation</h1>
      
      <section className="section">
        <h2 className="subtitle">🚀 Overview</h2>
        <p>
          WordsTeacher is an innovative language-learning app that empowers users to 
          master vocabulary in multiple languages effortlessly. Using a structured 
          learning approach, it enhances retention and efficiency.
        </p>
      </section>
      
      <section className="section">
        <h2 className="subtitle">✨ Key Features</h2>
        <ul className="feature-list">
          <li>🌍 Learn words in various languages simultaneously (e.g., German, English, Russian).</li>
          <li>🧠 Custom learning method for better retention.</li>
          <li>🔎 Search by word or meaning in the dictionary for quick reference.</li>
          <li>📊 Interactive tests to track progress.</li>
        </ul>
      </section>
      
      <section className="section">
        <h2 className="subtitle">📖 How It Works</h2>
        <p>
          Add new words, link them with meanings, and 
          practice through engaging exercises. The app intelligently tracks progress 
          and applies smart repetition techniques to boost memorization.
        <br/>
        When you add words, you can learn them on the main page, then you can go
        to Tests tab and train in translations. When you are sure, that you know every word, you added, completely, you can drop it
        to the next level. There are 5 levels. On the 5th level you should know all words,
        and after dropping them to the next level, they will be automaticaly deleted 
        (Don`t worry, they will be available in your personal dictionary). After that you can add new word combinations.
        </p>
        <a id="redirection" href="/">Click here to start learning</a>
      </section>
    </div>
  );
};

export default Documentation;
