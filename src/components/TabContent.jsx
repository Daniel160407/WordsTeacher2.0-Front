import { useEffect, useState } from "react";
import AddWord from "./AddWord";
import Home from "./Home";
import Tests from "./Tests";
import Dictionary from "./Dictionary";
import Statistics from "./Statistics";

const TabContent = ({updatedLanguageWords, languageId}) => {
    const [updatedWords, setUpdatedWords] = useState([]);
    const [updatedDictionaryWords, setUpdatedDictionaryWords] = useState([]);
    const [dictionaryWords, setDictionaryWords] = useState([]);
    const [advancement, setAdvancement] = useState('');

    useEffect(() => {
        setUpdatedWords(updatedLanguageWords);
    }, [updatedLanguageWords]);

    return (
        <div className="tab-content">
            <Home updatedWords={updatedWords} setUpdatedWords={setUpdatedWords} setUpdatedDictionaryWords={setUpdatedDictionaryWords} dayStreakAdvancement={advancement} languageId={languageId}/>
            <AddWord setUpdatedWords={setUpdatedWords} setUpdatedDictionaryWords={setUpdatedDictionaryWords}/>
            <Tests updatedWords={updatedWords} newLanguageId={languageId}/>
            <Dictionary setDictionaryWords={setDictionaryWords} updatedWords={updatedDictionaryWords} langueageId={languageId}/>
            <Statistics dictionaryWords={dictionaryWords} setAdvancement={setAdvancement} />
        </div>
    );
}
export default TabContent;