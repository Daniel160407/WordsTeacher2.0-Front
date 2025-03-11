const LanguageSelector = ({ language, setLanguage }) => (
  <select onChange={(e) => setLanguage(e.target.value)} value={language}>
    <option value="GEO">GEO</option>
    <option value="DEU">DEU</option>
  </select>
);

export default LanguageSelector;
